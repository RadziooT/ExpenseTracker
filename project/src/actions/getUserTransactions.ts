"use server";

import { connectDB } from "@/lib/mongodb";
import { TransactionsQuery } from "@/actions/internal/TransactionsQuery";
import TransactionData from "@/types/transactionData";

export interface GetUserTransactionsRequestDTO {
  userId: string;
  dateFrom: string;
  dateTo: string;
}
export const getUserTransactions = async (
  request: GetUserTransactionsRequestDTO,
): Promise<Array<TransactionData>> => {
  try {
    await connectDB();

    return await TransactionsQuery({
      userId: request.userId,
      date: {
        $gte: request.dateFrom,
        $lte: request.dateTo,
      },
    });
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
