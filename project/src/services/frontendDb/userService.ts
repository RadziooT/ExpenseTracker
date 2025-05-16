import { initDB } from "@/services/frontendDb//initDB";
import { UserData } from "@/types/userData";
import { USER_DATA_STORE } from "@/services/frontendDb/storeDefinitions";

export const saveUserData = async (data: UserData) => {
  const db = await initDB();
  await db.put(USER_DATA_STORE, { id: "current", ...data });
};

export const getUserData = async (): Promise<UserData> => {
  const db = await initDB();
  return db.get(USER_DATA_STORE, "current");
};

export const clearUserData = async (): Promise<void> => {
  const db = await initDB();
  await db.clear(USER_DATA_STORE);
};
