import { openDB } from "idb";

const DB_NAME = "expenseTrackerDB";
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("userData")) {
        db.createObjectStore("userData", { keyPath: "id" });
      }
    },
  });
};

export const saveUserData = async (data: any) => {
  const db = await initDB();
  await db.put("userData", { id: "current", ...data });
};

export const getUserData = async () => {
  const db = await initDB();
  return db.get("userData", "current");
};

export const clearUserData = async () => {
  const db = await initDB();
  await db.delete("userData", "current");
};
