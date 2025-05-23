import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const { userId, budget } = (await req.json()) as {
    userId: string;
    budget: number;
  };

  if (!userId || !budget) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    await User.updateOne({ _id: userId }, { $set: { monthlyBudget: budget } });
    return NextResponse.json("");
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Error during budget change" },
      { status: 400 },
    );
  }
}
