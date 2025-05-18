import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";
import { AddUserTransactionsRequestDTO } from "@/app/(layout)/expenses/page";

export async function POST(req: NextRequest) {
  try {
    const body: AddUserTransactionsRequestDTO = await req.json();
    console.log(req);
    console.log(body);

    await connectDB();
    const createdData = await TransactionData.create(body);
    console.log(createdData);
    return NextResponse.json("");
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Error during transaction creation" },
      { status: 400 },
    );
  }
}
