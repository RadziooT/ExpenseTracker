import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { INITIAL_MONTHLY_BUDGET } from "@/lib/constants/constants";

export async function POST(req: NextRequest) {
  const { username, password, firstName } = (await req.json()) as {
    username: string;
    password: string;
    firstName: string;
  };

  if (!username || !password || !firstName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
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
      monthlyBudget: INITIAL_MONTHLY_BUDGET,
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
