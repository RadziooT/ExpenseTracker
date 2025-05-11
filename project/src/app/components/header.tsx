"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const router = useRouter();

  const { status } = useSession();

  useEffect(() => {
    if (status == "authenticated") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        <Link href="/">Expense Tracker</Link>
      </h1>

      <nav className="flex items-center space-x-4">
        <Link href="/home" className="text-gray-700 hover:text-blue-500">
          Home
        </Link>

        <Link
          href="/expenses"
          className={`${
            isLoggedIn
              ? "text-gray-700 hover:text-blue-500"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!isLoggedIn) e.preventDefault();
          }}
        >
          My Expenses
        </Link>

        <Link
          href="/statistics"
          className={`${
            isLoggedIn
              ? "text-gray-700 hover:text-blue-500"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!isLoggedIn) e.preventDefault();
          }}
        >
          Statistics
        </Link>
      </nav>

      <div className="space-x-3">
        {isLoggedIn ? (
          <button
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                router.push("/");
                setIsLoggedIn(false);
              });
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <section>
            <Link
              href="/auth/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 mx-2 rounded"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
            >
              Register
            </Link>
          </section>
        )}
      </div>
    </header>
  );
}
