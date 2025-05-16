"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { TransactionsQuery } from "@/actions/internal/TransactionsQuery";
import { InitData } from "@/types/initData";
import { ChartQuery, QueryData } from "@/actions/internal/ChartQuery";

function randomHexColorCode() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

function generateBackgroundColors(count: number) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(randomHexColorCode());
  }
  return result;
}

export interface InitUserDataRequestDTO {
  username: string;
}
export const initData = async (
  request: InitUserDataRequestDTO,
): Promise<InitData> => {
  try {
    await connectDB();
    const userFound = await User.findOne({ username: request.username });

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
        spendingBudget: userFound.spendingBudget,
        currentMonthIncomeCount: userFound.currentMonthIncomeCount,
        currentMonthExpensesCount: userFound.currentMonthExpensesCount,
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
    console.log(e);
    return Promise.reject(e);
  }
};
