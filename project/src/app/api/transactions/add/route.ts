import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";
import { currentMonthTransactionsAmountQuery } from "@/lib/internal/transactionsQuery";
import { AddUserTransactionsRequestDTO } from "@/types/api/AddUserTransactionsRequestDTO";
import User, { UserDocument } from "@/models/User";
import { BUDGET_THRESHOLD_WARNING } from "@/lib/constants/constants";
import { sendUserNotification } from "@/lib/internal/sendUserNotification";

export async function POST(req: NextRequest) {
  const { transaction } = (await req.json()) as {
    transaction: AddUserTransactionsRequestDTO;
  };

  if (
    !transaction.userId ||
    !transaction.title ||
    !transaction.amount ||
    !transaction.currency ||
    !transaction.date ||
    !transaction.category
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const transactionData = new TransactionData({
      userId: transaction.userId,
      isExpense: transaction.isExpense,
      title: transaction.title,
      amount: transaction.amount,
      currency: transaction.currency,
      date: transaction.date,
      category: transaction.category,
    });

    await transactionData.save();

    if (transactionData.isExpense) {
      currentMonthTransactionsAmountQuery(transaction.userId).then(
        async (sum) => {
          const userFound: UserDocument | null = await User.findOne({
            _id: transaction.userId,
          });

          if (!userFound) {
            return;
          }

          const leftBudget = userFound?.monthlyBudget - sum;
          if (leftBudget < BUDGET_THRESHOLD_WARNING) {
            if (leftBudget < 0) {
              sendUserNotification({
                userId: userFound._id.toString(),
                title: "Oops!!!",
                message: "You've exceeded your monthly budget!",
              }).then();
            } else {
              sendUserNotification({
                userId: userFound._id.toString(),
                title: "Oops!",
                message: "It seems you're reaching your set budget",
              }).then();
            }
          }
        },
      );
    }

    return NextResponse.json("");
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Error during transaction creation" },
      { status: 400 },
    );
  }
}
