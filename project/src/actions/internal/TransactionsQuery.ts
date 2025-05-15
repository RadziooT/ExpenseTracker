"use server";

import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export const TransactionsQuery = async (queryFilter: any) => {
  try {
    await connectDB();
    const transactions = await TransactionData.find(queryFilter);

    return transactions.map((transaction) => {
      return {
        id: transaction.id.toString(),
        isExpense: transaction.isExpense,
        title: transaction.title,
        amount: transaction.amount,
        currency: transaction.currency,
        date: transaction.date,
        category: transaction.category,
      };
    });
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
