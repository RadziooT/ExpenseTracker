import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TransactionData from "@/models/TransactionData";

export async function DELETE(req: NextRequest) {
  const { userId, transactionId } = (await req.json()) as {
    userId: string;
    transactionId: string;
  };

  if (!userId || !transactionId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const body = await req.json();
    const { transactionId } = body;

    await connectDB();
    await TransactionData.deleteOne({
      _id: transactionId,
      userId,
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
