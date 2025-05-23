"use server";

import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";
import { getCurrentMonthDateRange } from "@/lib/util/CurrentMonthDateService";

export const transactionsQuery = async (queryFilter: any) => {
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

export const currentMonthTransactionsAmountQuery = async (userID: string) => {
  try {
    await connectDB();
    const dateRange = getCurrentMonthDateRange();
    const startDate = new Date(dateRange.dateFrom);
    const endDate = new Date(dateRange.dateTo);

    const aggregateData = await TransactionData.aggregate([
      {
        $match: {
          isExpense: true,
          userId: userID,
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
          totalAmount: { $sum: "$amountNum" },
        },
      },
    ]);

    return aggregateData[0]?.totalAmount || 0;
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
