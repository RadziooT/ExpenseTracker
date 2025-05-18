import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId } = body;

    await connectDB();
    await TransactionData.deleteOne({
      _id: transactionId,
    });
    return NextResponse.json("");
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Error during transaction deletion" },
      { status: 400 },
    );
  }
}
