"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export interface RegisterUserRequestDTO {
  username: string;
  password: string;
  firstName: string;
}

export const register = async (request: RegisterUserRequestDTO) => {
  try {
    await connectDB();
    const userFound = await User.findOne({ username: request.username });
    if (userFound) {
      return Promise.reject("user already exists");
    }
    const hashedPassword = await bcrypt.hash(request.password, 10);
    const user = new User({
      username: request.username,
      password: hashedPassword,
      firstName: request.firstName,
      setSpendingBudget: 1000,
      setOverallBudget: 1000,
      thisMonthIncomeCount: 1000,
      thisMonthExpensesCount: 1000,
    });

    await user.save();
    return Promise.resolve();
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
