"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { TransactionsQuery } from "@/actions/internal/TransactionsQuery";

export interface InitUserDataRequestDTO {
  username: string;
}
export const initUserData = async (request: InitUserDataRequestDTO) => {
  try {
    await connectDB();
    const userFound = await User.findOne({ username: request.username });

    const transactions = await TransactionsQuery({
      userId: userFound._id,
    });

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
      chartEntries: [
        {
          color: "#36A2EB",
          label: "Food",
          type: "Food",
          amount: 500,
          count: 5,
        },
        {
          color: "#FF6384",
          label: "Transport",
          type: "Transport",
          amount: 300,
          count: 3,
        },
        {
          color: "#FFCE56",
          label: "General",
          type: "General",
          amount: 700,
          count: 4,
        },
        {
          color: "#4BC0C0",
          label: "Misc",
          type: "Misc",
          amount: 300,
          count: 2,
        },
      ],
    };
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
