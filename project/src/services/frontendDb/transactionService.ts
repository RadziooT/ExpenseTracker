import { initDB } from "@/services/frontendDb/initDB";
import { TRANSACTION_DATA_STORE } from "@/services/frontendDb/storeDefinitions";
import TransactionData from "@/types/transactionData";

export const getAllTransactions = async (): Promise<Array<TransactionData>> => {
  const db = await initDB();
  return db.getAll(TRANSACTION_DATA_STORE);
};

export const clearAllTransactionData = async (): Promise<void> => {
  const db = await initDB();
  await db.clear(TRANSACTION_DATA_STORE);
};

export const saveTransactions = async (data: Array<TransactionData>) => {
  const db = await initDB();
  const dbTransaction = db.transaction(TRANSACTION_DATA_STORE, "readwrite");
  data.forEach((entry: TransactionData) => {
    dbTransaction.store.put({ id: entry.id, entry });
  });
  dbTransaction.done;
  return;
};
