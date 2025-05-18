import { initDB } from "@/services/frontendDb/initDB";
import { TRANSACTION_DATA_STORE } from "@/services/frontendDb/storeDefinitions";
import TransactionData from "@/types/transactionData";

export const saveTransactions = async (data: any) => {
  const db = await initDB();

  const dbTransaction = db.transaction(TRANSACTION_DATA_STORE, "readwrite");

  await Promise.all([
    data.forEach((entry: any) => {
      dbTransaction.store.put({ id: "current", entry });
    }),
    dbTransaction.done,
  ]);
};

export const getTransaction = async (id: string) => {
  const db = await initDB();
  return db.get(TRANSACTION_DATA_STORE, id);
};

export const getAllTransactions = async () => {
  const db = await initDB();
  return db.getAll(TRANSACTION_DATA_STORE);
};

export const clearTransaction = async (id: string) => {
  const db = await initDB();
  await db.delete(TRANSACTION_DATA_STORE, id);
};

export const refreshTransactions = async (data: Array<TransactionData>) => {
  const db = await initDB();
  const dbTransaction = db.transaction(TRANSACTION_DATA_STORE, "readwrite");
  await dbTransaction.store.clear();
  data.forEach((entry: any) => {
    dbTransaction.store.put({ id: entry.id, entry });
  });
  dbTransaction.done;

  // await Promise.all([
  //   data.forEach((entry: any) => {
  //     dbTransaction.store.put({ id: "current", entry });
  //   }),
  //   dbTransaction.done,
  // ]);
  return;
};
