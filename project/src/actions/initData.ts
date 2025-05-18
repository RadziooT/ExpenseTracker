"use server";

import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { TransactionsQuery } from "@/lib/internal/transactionsQuery";
import { InitData } from "@/types/initData";
import { ChartQuery, QueryData } from "@/lib/internal/chartQuery";
import { InitUserDataRequestDTO } from "@/types/api/InitUserDataRequestDTO";

function randomHexColorCode() {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

function generateBackgroundColors(count: number) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(randomHexColorCode());
  }
  return result;
}

export const initData = async (
  request: InitUserDataRequestDTO,
): Promise<InitData> => {
  try {
    await connectDB();
    const userFound: UserDocument | null = await User.findOne({
      _id: request.userId,
    });

    if (!userFound) {
      return Promise.reject("User not found");
    }

    const transactions = await TransactionsQuery({
      userId: userFound._id,
    });

    const chartData: Array<QueryData> = await ChartQuery(
      userFound._id.toString(),
    );

    return {
      userData: {
        userId: userFound._id.toString(),
        username: userFound.username,
        firstName: userFound.firstName,
        spendingBudget: userFound.monthlyBudget,
        //TODO
        currentMonthIncomeCount: 0,
        currentMonthExpensesCount: 0,
      },
      transactions: transactions,
      summaryChart: {
        labels: chartData.map((entry: QueryData) => entry.label),
        label: "Current month expenses",
        data: chartData.map((entry: QueryData) => entry.totalAmount),
        backgroundColor: generateBackgroundColors(chartData.length),
      },
    };
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};
