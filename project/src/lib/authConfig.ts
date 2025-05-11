import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({
          username: credentials?.username,
        }).select("+password");

        if (!user) throw new Error("Wrong Credentials");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          user.password,
        );

        if (!passwordMatch) throw new Error("Wrong Credentials");
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
