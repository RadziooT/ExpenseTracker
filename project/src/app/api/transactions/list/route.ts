import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TransactionsQuery } from "@/actions/internal/TransactionsQuery";
import TransactionData from "@/types/transactionData";

interface GetUserTransactionsRequestDTO {
  userId: string;
  dateFrom: string;
  dateTo: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(req);

    console.log(body);

    const { userId, dateFrom, dateTo } = body;

    if (!userId || !dateFrom || !dateTo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    const transactions: Array<TransactionData> = await TransactionsQuery({
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
