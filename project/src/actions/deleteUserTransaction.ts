"use server";

import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export interface DeleteUserTransactionsRequestDTO {
  transactionId: string;
}
export const deleteUserTransaction = async (
  request: DeleteUserTransactionsRequestDTO,
) => {
  try {
    await connectDB();
    await TransactionData.deleteOne({
      _id: request.transactionId,
    });

    return Promise.resolve();
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
