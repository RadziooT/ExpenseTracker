"use server";

import { connectDB } from "@/lib/mongodb";
import { TransactionsQuery } from "@/actions/internal/TransactionsQuery";

export interface GetUserTransactionsRequestDTO {
  userId: string;
  dateFrom: string;
  dateTo: string;
}
export const getUserTransactions = async (
  request: GetUserTransactionsRequestDTO,
) => {
  try {
    await connectDB();
    const transactions = await TransactionsQuery({
      userId: request.userId,
    });

    return {
      transactions,
    };
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
