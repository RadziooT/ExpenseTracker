"use client";

import React from "react";
import TransactionData from "@/types/transactionData";
import {
  AdjustmentsHorizontalIcon,
  HeartIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function TransactionDetails({
  transactionData,
  onDelete,
}: {
  transactionData: TransactionData;
  onDelete: (transaction: TransactionData) => void;
}) {
  const formattedAmount = `${transactionData.isExpense ? "-" : ""}${transactionData.amount} ${transactionData.currency}`;
  const amountStyle = transactionData.isExpense
    ? "text-black"
    : "text-green-600";

  const formattedDate = new Date(transactionData.date).toLocaleDateString(
    undefined,
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "Home":
        return <HomeIcon className="w-6 h-6 text-gray-500"></HomeIcon>;
      case "Health":
        return <HeartIcon className="w-6 h-6 text-gray-500"></HeartIcon>;
      default:
        return (
          <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-300"></AdjustmentsHorizontalIcon>
        );
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-full">
          {getCategoryIcon(transactionData.category)}
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4">
        <div className="font-semibold">{transactionData.title}</div>
        <div className={`text-sm ${amountStyle}`}>{formattedAmount}</div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-400">{formattedDate}</div>
        <button
          onClick={() => onDelete(transactionData)}
          className="mt-1 border border-black rounded-full p-1 hover:bg-red-100 transition"
          aria-label="Delete transaction"
        >
          <XMarkIcon className="w-4 h-4 text-red-600"></XMarkIcon>
        </button>
      </div>
    </div>
  );
}
