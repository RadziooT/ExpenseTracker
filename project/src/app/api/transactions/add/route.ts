import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export async function POST(req: NextRequest) {
  const { userId, isExpense, title, amount, currency, date, category } =
    (await req.json()) as {
      userId: string;
      isExpense: boolean;
      title: string;
      amount: string;
      currency: string;
      date: string;
      category: string;
    };

  if (
    !userId ||
    !isExpense ||
    !title ||
    !amount ||
    !currency ||
    !date ||
    !category
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const transactionData = new TransactionData({
      userId: userId,
      isExpense: isExpense,
      title: title,
      amount: amount,
      currency: currency,
      date: date,
      category: category,
    });

    await transactionData.save();
    return NextResponse.json("");
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Error during transaction creation" },
      { status: 400 },
    );
  }
}
