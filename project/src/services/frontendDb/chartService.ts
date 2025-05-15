import { initDB } from "@/services/frontendDb/initDB";

export const saveChartData = async (data: any) => {
  const db = await initDB();
  const dbTransaction = db.transaction("chartData", "readwrite");

  await Promise.all([
    data.forEach((entry: any) => {
      dbTransaction.store.put({ entry });
    }),
    dbTransaction.done,
  ]);
};

export const getChartData = async (id: string) => {
  const db = await initDB();
  return db.get("chartData", id);
};

export const getAllChartData = async () => {
  const db = await initDB();
  return db.getAll("chartData");
};

export const clearChartData = async () => {
  const db = await initDB();
  await db.clear("chartData");
};
