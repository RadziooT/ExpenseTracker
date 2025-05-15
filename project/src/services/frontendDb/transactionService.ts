import { initDB } from "@/services/frontendDb/initDB";

export const saveTransactions = async (data: any) => {
  const db = await initDB();

  const dbTransaction = db.transaction("transactionData", "readwrite");

  await Promise.all([
    data.forEach((entry: any) => {
      dbTransaction.store.put({ id: "current", entry });
    }),
    dbTransaction.done,
  ]);
};

export const getTransaction = async (id: string) => {
  const db = await initDB();
  return db.get("transactionData", id);
};

export const getAllTransactions = async () => {
  const db = await initDB();
  return db.getAll("transactionData");
};

export const clearTransaction = async (id: string) => {
  const db = await initDB();
  await db.delete("transactionData", id);
};
