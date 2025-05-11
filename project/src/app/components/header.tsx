"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getSession().then((session) => {
      setIsLoggedIn(session.isLoggedIn);
    });
  }, []);

  if (isLoggedIn === null) return null; // or loading indicator

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
            onClick={() => setIsLoggedIn(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
              Login
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}
