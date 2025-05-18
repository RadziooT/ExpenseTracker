import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";
import { AddUserTransactionsRequestDTO } from "@/types/api/AddUserTransactionsRequestDTO";

export async function POST(req: NextRequest) {
  const { transaction } = (await req.json()) as {
    transaction: AddUserTransactionsRequestDTO;
  };

  if (!transaction) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    await TransactionData.create(transaction);

    return NextResponse.json("");
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Error during transaction creation" },
      { status: 400 },
    );
  }
}
