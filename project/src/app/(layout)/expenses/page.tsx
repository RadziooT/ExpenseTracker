"use client";

import { useEffect, useState } from "react";
import TransactionDetails from "@/components/transactionDetails";
import DateRangePicker from "@/components/dateRangePicker";
import {
  CalendarDate,
  getLocalTimeZone,
  startOfMonth,
  today,
} from "@internationalized/date";
import TransactionData from "@/types/transactionData";
import NewTransactionFormModal from "@/components/modals/newTransactionForm";
import { addToast, Button } from "@heroui/react";
import { useUserContext } from "@/app/userContextProvider";
import Loading from "@/components/global/loading";
import { AddUserTransactionsRequestDTO } from "@/types/api/AddUserTransactionsRequestDTO";
import { GetUserTransactionsRequestDTO } from "@/types/api/GetUserTransactionsRequestDTO";
import { NewTransactionFormData } from "@/types/api/NewTransactionFormData";
import { redirect } from "next/navigation";

export default function ExpenseListPage() {
  const [dateFrom, setDateFrom] = useState<CalendarDate>(
    startOfMonth(today(getLocalTimeZone())),
  );
  const [dateTo, setDateTo] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [data, setData] = useState<Array<TransactionData>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { userId, isUserAuthenticated, setDataRefreshRequired } =
    useUserContext();

  function setDateRange(
    newDateFrom: CalendarDate,
    newDateTo: CalendarDate,
  ): void {
    setDateFrom(newDateFrom);
    setDateTo(newDateTo);
  }

  useEffect(() => {
    if (!isUserAuthenticated) {
      redirect("/");
    }
    const request = {
      userId: userId!,
      dateFrom: dateFrom.toString(),
      dateTo: dateTo.toString(),
    };
    fetchUserTransactions(request).then((transactionData) => {
      setData(transactionData);
      setIsLoading(false);
    });
  }, []);

  function refreshData(dateFrom: CalendarDate, dateTo: CalendarDate): void {
    const request = {
      userId: userId!,
      dateFrom: dateFrom.toString(),
      dateTo: dateTo.toString(),
    };
    fetchUserTransactions(request).then((transactionData) => {
      setData(transactionData);
    });
  }

  const fetchUserTransactions = async (
    request: GetUserTransactionsRequestDTO,
  ): Promise<Array<TransactionData>> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/transactions/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      return await res.json();
    } catch (err: any) {
      addToast({
        title: "Oops",
        description: "Failed to fetch transactions",
        color: "danger",
        timeout: 2000,
        shouldShowTimeoutProgress: true,
      });
      throw new Error(err.error || "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  async function deleteItem(transaction: TransactionData) {
    try {
      setIsLoading(true);
      await fetch("/api/transactions/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId: transaction.id }),
      });

      setDataRefreshRequired(true);
      refreshData(dateFrom, dateTo);
    } catch (err: any) {
      console.log(err);
      if (err.message == "Failed to fetch") {
        addToast({
          title: "Offline mode",
          description: "Data modification is available only in online mode",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: "Oops!",
          description: "Couldn't delete transaction. Try again later",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function saveTransaction(data: NewTransactionFormData) {
    const transaction: AddUserTransactionsRequestDTO = {
      userId: userId!,
      isExpense: data.isExpense,
      title: data.title,
      amount: data.amount,
      currency: data.currency,
      date: data.date,
      category: data.category,
    };

    try {
      setIsLoading(true);

      await fetch("/api/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });
      setDataRefreshRequired(true);
      refreshData(dateFrom, dateTo);
    } catch (err: any) {
      console.log(err);
      if (err.message == "Failed to fetch") {
        addToast({
          title: "Offline mode",
          description: "Data modification is available only in online mode",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: "Oops!",
          description: "Couldn't add transaction. Try again later",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loading loadingContent="Loading data..." />;

  return (
    <div className="max-w-3xl mx-auto px-6 pb-4">
      <h1 className="text-2xl font-bold mb-4">My Income & Expenses</h1>

      <DateRangePicker
        disabled={false}
        initialFromDate={dateFrom}
        initialToDate={dateTo}
        onSearch={(range) => {
          setDateRange(range.fromDate, range.toDate);
          refreshData(range.fromDate, range.toDate);
        }}
      />

      <div className="flex flex-wrap gap-4 pt-4 pb-4 items-center justify-between">
        <h2 className="text-lg font-semibold">Transactions</h2>

        <Button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          onPress={() => setIsModalOpen(true)}
        >
          New Expense/Income
        </Button>
        <NewTransactionFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={(data: NewTransactionFormData) => {
            setIsModalOpen(false);
            saveTransaction(data).then();
          }}
        ></NewTransactionFormModal>
      </div>

      <div>
        <ul className="space-y-2">
          {data.map((item: TransactionData, i: number) => (
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
          {data.length === 0 && (
            <li className="text-gray-400">No entries for selected range</li>
          )}
        </ul>
      </div>
    </div>
  );
}
