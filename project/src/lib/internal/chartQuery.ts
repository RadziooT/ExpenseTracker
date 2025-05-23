"use server";

import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export interface QueryData {
  category: string;
  totalAmount: number;
  label: string;
}

export interface ChartQueryParams {
  userId: string;
  dateFrom: string;
  dateTo: string;
}

export const ChartQuery = async (
  request: ChartQueryParams,
): Promise<Array<QueryData>> => {
  try {
    await connectDB();

    const aggregateData = await TransactionData.aggregate([
      {
        $match: {
          isExpense: true,
          userId: request.userId,
          date: {
            $gte: request.dateFrom,
            $lte: request.dateTo,
          },
        },
      },
      {
        $addFields: {
          amountNum: { $toDouble: "$amount" },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amountNum" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
          label: "$_id",
        },
      },
    ]);

    return aggregateData.map((data) => ({
      category: data.category as string,
      label: data.label as string,
      totalAmount: data.totalAmount as number,
    }));
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
