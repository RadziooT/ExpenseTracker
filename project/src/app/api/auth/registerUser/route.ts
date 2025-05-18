import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(req);
    console.log(body);

    const { username, password, firstName } = body;

    if (!username || !password || !firstName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();
    const userFound = await User.findOne({ username });
    if (userFound) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      password: hashedPassword,
      firstName: firstName,
      setSpendingBudget: 1000,
      setOverallBudget: 1000,
      thisMonthIncomeCount: 1000,
      thisMonthExpensesCount: 1000,
    });

    await user.save();
    return NextResponse.json("");
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
