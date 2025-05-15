"use client";

import { useEffect, useState } from "react";
import TransactionDetails from "@/components/transactionDetails";
import DateRangePicker from "@/components/DateRangePicker";
import {
  CalendarDate,
  getLocalTimeZone,
  isToday,
  parseDate,
  today,
} from "@internationalized/date";
import Transaction from "@/types/transaction";
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
} from "@/services/frontendDb/transactionService";
import {
  addUserTransaction,
  AddUserTransactionsRequestDTO,
} from "@/actions/addUserTransaction";
import { deleteUserTransaction } from "@/actions/deleteUserTransaction";

export default function ExpenseListPage() {
  const [data, setData] = useState<Array<Transaction>>([]);
  const [filteredData, setFilteredData] = useState<Array<Transaction>>([]);
  const [dateFrom, setDateFrom] = useState<CalendarDate>(
    today(getLocalTimeZone()).subtract({ months: 1 }),
  );
  const [dateTo, setDateTo] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId, isOffline } = useUserContext();

  useEffect(() => {
    if (isOffline) {
      getAllTransactions().then((transactions) => {
        setData(transactions);
        filterByDate(data);
      });
    } else {
      const request: GetUserTransactionsRequestDTO = {
        userId: userId!,
        dateFrom: dateFrom.toString(),
        dateTo: dateTo.toString(),
      };
      getUserTransactions(request).then((transactionData) => {
        const newData = transactionData.transactions;
        setData(newData);
        filterByDate(newData);
      });
    }
  }, []);

  useEffect(() => {
    filterByDate(data);
  }, [data, dateFrom, dateTo]);

  function deleteItem(transaction: Transaction) {
    const now = new Date();
    const check = new Date(transaction.date);

    if (check.getMonth() == now.getMonth()) {
      clearTransaction(transaction.id).then(() => {
        deleteUserTransaction({ transactionId: transaction.id }).then(() =>
          filterByDate(data),
        );
      });
    } else {
      deleteUserTransaction({ transactionId: transaction.id }).then(() =>
        filterByDate(data),
      );
    }
  }

  function filterByDate(list: Array<Transaction>): void {
    const data = list.filter((item: Transaction) => {
      const date = parseDate(item.date);
      return date.compare(dateFrom) > 0 && date.compare(dateTo) <= 0;
    });
    setFilteredData(data);
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Income & Expenses</h1>

      <DateRangePicker
        disabled={isOffline}
        initialFromDate={dateFrom}
        initialToDate={dateTo}
        onSearch={(range) => {
          setDateFrom(range.fromDate);
          setDateTo(range.toDate);
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
