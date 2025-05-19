"use server";

import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export interface CurrentMonthTransactionSumParams {
  userId: string;
  dateFrom: string;
  dateTo: string;
}

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

export const currentMonthTransactionsAmountQuery = async (
  request: CurrentMonthTransactionSumParams,
) => {
  try {
    await connectDB();
    const startDate = new Date(request.dateFrom);
    const endDate = new Date(request.dateTo);

    const aggregateData = await TransactionData.aggregate([
      {
        $match: {
          isExpense: true,
          userId: request.userId,
        },
      },
      {
        $addFields: {
          parsedDate: {
            $dateFromString: {
              dateString: "$date",
              format: "%Y-%m-%d",
            },
          },
        },
      },
      {
        $match: {
          parsedDate: {
            $gte: startDate,
            $lte: endDate,
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
          _id: null,
          totalAmount: { $sum: "$amountNum" }, // Sum here
        },
      },
    ]);

    return aggregateData[0]?.totalAmount;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
