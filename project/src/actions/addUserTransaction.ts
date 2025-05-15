"use server";

import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export interface AddUserTransactionsRequestDTO {
  userId: string;
  isExpense: boolean;
  title: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
}
export const addUserTransaction = async (
  data: AddUserTransactionsRequestDTO,
) => {
  try {
    await connectDB();
    const createdData = await TransactionData.create(data);
    console.log(createdData);
    return Promise.resolve();
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
