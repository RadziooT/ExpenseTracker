"use client";

import { useEffect, useState } from "react";
import TransactionDetails from "@/components/transactionDetails";
import DateRangePicker from "@/components/DateRangePicker";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  startOfMonth,
  today,
} from "@internationalized/date";
import TransactionData from "@/types/transactionData";
import NewTransactionFormModal, {
  NewTransactionFormData,
} from "@/components/modals/NewTransactionForm";
import { Button } from "@heroui/react";
import { useUserContext } from "@/app/userContextProvider";
import {
  getUserTransactions,
  GetUserTransactionsRequestDTO,
} from "@/actions/getUserTransactions";
import {
  clearTransaction,
  getAllTransactions,
  refreshTransactions,
} from "@/services/frontendDb/transactionService";
import {
  addUserTransaction,
  AddUserTransactionsRequestDTO,
} from "@/actions/addUserTransaction";
import { deleteUserTransaction } from "@/actions/deleteUserTransaction";
import Loading from "@/components/global/Loading";

export default function ExpenseListPage() {
  let dateFrom: CalendarDate = startOfMonth(today(getLocalTimeZone()));
  let dateTo: CalendarDate = today(getLocalTimeZone());
  const [data, setData] = useState<Array<TransactionData>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { userId, isOffline } = useUserContext();

  function setDateRange(
    newDateFrom: CalendarDate,
    newDateTo: CalendarDate,
  ): void {
    dateFrom = newDateFrom;
    dateTo = newDateTo;
  }

  useEffect(() => {
    const request: GetUserTransactionsRequestDTO = {
      userId: userId!,
      dateFrom: dateFrom.toString(),
      dateTo: dateTo.toString(),
    };
    fetchUserTransactions(request).then((transactionData) => {
      setData(transactionData);
      setIsLoading(false);
    });
  }, []);

  function refreshData(): void {
    const request: GetUserTransactionsRequestDTO = {
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
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: TransactionData[] = await res.json();
      console.log(data);
      return data;
    } catch (err: any) {
      throw new Error(err.error || "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  function deleteItem(transaction: TransactionData) {
    if (isOffline) {
      clearTransaction(transaction.id).then(() => {
        //TODO: save operation in new object (will be used in data sync process)
        filterByDate(data);
      });
    } else {
      deleteUserTransaction({ transactionId: transaction.id }).then(() => {
        const request: GetUserTransactionsRequestDTO = {
          userId: userId!,
          dateFrom: dateFrom.toString(),
          dateTo: dateTo.toString(),
        };
        getUserTransactions(request).then((transactionData) => {
          refreshTransactions(transactionData).then(() => {});
          setData(transactionData);
        });
      });
    }
  }

  // only used in offline context
  function filterByDate(list: Array<TransactionData>): void {
    const data = list.filter((item: TransactionData) => {
      const date = parseDate(item.date);
      return date.compare(dateFrom) > 0 && date.compare(dateTo) <= 0;
    });
    setData(data);
  }

  function saveTransaction(data: NewTransactionFormData) {
    const transaction: AddUserTransactionsRequestDTO = {
      userId: userId!,
      isExpense: data.isExpense,
      title: data.title,
      amount: data.amount,
      currency: data.currency,
      date: data.date,
      category: data.category,
    };
    addUserTransaction(transaction).then(() => {});
  }

  if (isLoading) return <Loading loadingContent="Loading data..." />;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Income & Expenses</h1>

      <DateRangePicker
        disabled={false}
        initialFromDate={dateFrom}
        initialToDate={dateTo}
        onSearch={(range) => {
          setDateRange(range.fromDate, range.toDate);
          refreshData();
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
            setIsModalOpen(false);
          }}
          onSave={(data: NewTransactionFormData) => {
            saveTransaction(data);
            setIsModalOpen(false);
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
