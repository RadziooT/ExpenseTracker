import { openDB } from "idb";
import {
  SUMMARY_CHART_DATA_STORE,
  TRANSACTION_DATA_STORE,
  USER_DATA_STORE,
} from "@/services/frontendDb/storeDefinitions";

const DB_NAME = "expenseTrackerDB";
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(USER_DATA_STORE)) {
        db.createObjectStore(USER_DATA_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(TRANSACTION_DATA_STORE)) {
        db.createObjectStore(TRANSACTION_DATA_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SUMMARY_CHART_DATA_STORE)) {
        db.createObjectStore(SUMMARY_CHART_DATA_STORE, { keyPath: "id" });
      }
    },
  });
};
