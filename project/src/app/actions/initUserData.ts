"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import TransactionData from "@/models/TransactionData";

export interface InitUserDataRequestDTO {
  username: string;
}
export const initUserData = async (request: InitUserDataRequestDTO) => {
  try {
    await connectDB();
    const userFound = await User.findOne({ username: request.username });

    const transactions = await TransactionData.find({
      userId: userFound._id,
    });

    return {
      userData: {
        username: userFound.username,
        firstName: userFound.firstName,
        setSpendingBudget: userFound.setSpendingBudget,
        setOverallBudget: userFound.setOverallBudget,
        thisMonthIncomeCount: userFound.thisMonthIncomeCount,
        thisMonthExpensesCount: userFound.thisMonthExpensesCount,
      },
      transactions: transactions,
      chartEntries: [
        { type: "Food", amount: 500, count: 5 },
        { type: "Transport", amount: 300, count: 3 },
        { type: "General", amount: 700, count: 4 },
        { type: "Misc", amount: 300, count: 2 },
      ],
    };
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
