"use client";

import { useEffect, useState } from "react";
import TransactionDetails from "@/app/components/transactionDetails";
import DateRangePicker from "@/app/components/DateRangePicker";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import Transaction from "@/types/transaction";
import NewTransactionFormModal from "@/app/components/modals/NewTransactionForm";
import { Button } from "@heroui/react"; // theme css file

function fetchMockData() {
  return {
    data: [
      {
        id: "1",
        isExpense: false,
        title: "Food",
        amount: 400,
        currency: "USD",
        date: "2025-05-05",
        category: "Food",
      },
      {
        id: "2",
        isExpense: false,
        title: "Transport",
        amount: 250,
        currency: "USD",
        date: "2025-05-10",
        category: "Transport",
      },
      {
        id: "3",
        isExpense: false,
        title: "Health",
        amount: 600,
        currency: "USD",
        date: "2025-04-18",
        category: "Health",
      },
      {
        id: "4",
        isExpense: true,
        title: "Health",
        amount: 300,
        currency: "USD",
        date: "2025-03-12",
        category: "Health",
      },
      {
        id: "5",
        isExpense: false,
        title: "Misc",
        amount: 300,
        currency: "USD",
        date: "2025-02-20",
        category: "Misc",
      },
      {
        id: "6",
        isExpense: true,
        title: "Dining Out",
        amount: 120,
        currency: "USD",
        date: "2025-05-12",
        category: "Food",
      },
      {
        id: "7",
        isExpense: true,
        title: "Groceries",
        amount: 180,
        currency: "USD",
        date: "2025-05-20",
        category: "Food",
      },
      {
        id: "8",
        isExpense: true,
        title: "Subscription",
        amount: 90,
        currency: "USD",
        date: "2025-05-25",
        category: "Entertainment",
      },
      {
        id: "9",
        isExpense: true,
        title: "Gym Membership",
        amount: 50,
        currency: "USD",
        date: "2025-01-10",
        category: "Health",
      },
    ],
  };
}

export default function ExpenseListPage() {
  const [data, setData] = useState<Array<Transaction>>([]);
  const [filteredData, setFilteredData] = useState<Array<Transaction>>([]);
  const [dateFrom, setDateFrom] = useState<CalendarDate>(
    today(getLocalTimeZone()).subtract({ months: 1 }),
  );
  const [dateTo, setDateTo] = useState<CalendarDate>(today(getLocalTimeZone()));

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = fetchMockData().data;
    setData(data);
    filterByDate(data);
  }, []);

  function deleteItem(transaction: Transaction) {
    const index = data.indexOf(transaction, 0);
    console.log(data);
    if (index > -1) {
      data.splice(index, 1);
    }
    console.log(data);
    filterByDate(data);
  }

  function filterByDate(list: Array<Transaction>): void {
    console.log(list);
    const data = list.filter((item: Transaction) => {
      const date = parseDate(item.date);
      return date.compare(dateFrom) > 0 && date.compare(dateTo) < 0;
    });
    setFilteredData(data);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Income & Expenses</h1>

      <DateRangePicker
        initialFromDate={dateFrom}
        initialToDate={dateTo}
        onSearch={(range) => {
          setDateFrom(range.fromDate);
          setDateTo(range.toDate);
          filterByDate(data);
        }}
      />

      <div className="flex flex-wrap gap-4 mb-4">
        <h2 className="text-lg font-semibold mt-4 mb-2">Transactions</h2>

        <Button
          className="ml-auto bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          onPress={() => setIsModalOpen(true)}
        >
          New Expense/Income
        </Button>
        <NewTransactionFormModal
          isOpen={isModalOpen}
          onClose={() => {
            console.log("dialog closed");
            setIsModalOpen(false);
          }}
          onSave={() => {
            console.log("dialog closed with params");
            setIsModalOpen(false);
          }}
        ></NewTransactionFormModal>
      </div>

      <div>
        <ul className="space-y-2">
          {filteredData.map((item: any, i: any) => (
            <li
              key={i}
              className="flex justify-between items-center border px-4 py-2 rounded"
            >
              <TransactionDetails
                transactionData={item}
                onDelete={deleteItem}
              />
            </li>
          ))}
          {filteredData.length === 0 && (
            <li className="text-gray-400">No entries for selected range</li>
          )}
        </ul>
      </div>
    </div>
  );
}
