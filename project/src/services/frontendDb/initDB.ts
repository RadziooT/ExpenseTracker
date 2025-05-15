import { openDB } from "idb";

const DB_NAME = "expenseTrackerDB";
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("userData")) {
        db.createObjectStore("userData", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("transactionData")) {
        db.createObjectStore("transactionData", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("chartData")) {
        db.createObjectStore("chartData", { autoIncrement: true });
      }
    },
  });
};
