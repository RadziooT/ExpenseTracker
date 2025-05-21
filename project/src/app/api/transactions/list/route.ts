import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { transactionsQuery } from "@/lib/internal/transactionsQuery";
import TransactionData from "@/types/transactionData";

export async function POST(req: NextRequest) {
  const { userId, dateFrom, dateTo } = (await req.json()) as {
    userId: string;
    dateFrom: string;
    dateTo: string;
  };

  if (!userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const transactions: Array<TransactionData> = await transactionsQuery({
      userId,
      date: {
        $gte: dateFrom,
        $lte: dateTo,
      },
    });

    return NextResponse.json(transactions);
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
