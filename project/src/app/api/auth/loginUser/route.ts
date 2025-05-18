import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(req);

    console.log(body);

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    const userFound = await User.findOne({ username });
    const hashedInputPassword = await bcrypt.hash(password, 10);

    console.log(userFound);

    if (!userFound || hashedInputPassword == userFound.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json(userFound.id.toString());
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
