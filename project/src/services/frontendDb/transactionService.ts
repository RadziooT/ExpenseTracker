import { initDB } from "@/services/frontendDb/initDB";
import { TRANSACTION_DATA_STORE } from "@/services/frontendDb/storeDefinitions";
import TransactionData from "@/types/transactionData";

export const getTransaction = async (id: string) => {
  const db = await initDB();
  return db.get(TRANSACTION_DATA_STORE, id);
};

export const getAllTransactions = async () => {
  const db = await initDB();
  return db.getAll(TRANSACTION_DATA_STORE);
};

export const clearAllTransactionData = async () => {
  const db = await initDB();
  await db.clear(TRANSACTION_DATA_STORE);
};

export const clearTransaction = async (id: string) => {
  const db = await initDB();
  await db.delete(TRANSACTION_DATA_STORE, id);
};

export const saveTransactions = async (data: Array<TransactionData>) => {
  const db = await initDB();
  const dbTransaction = db.transaction(TRANSACTION_DATA_STORE, "readwrite");
  data.forEach((entry: any) => {
    dbTransaction.store.put({ id: entry.id, entry });
  });
  dbTransaction.done;
  return;
};
