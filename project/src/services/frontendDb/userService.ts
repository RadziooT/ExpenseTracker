import { initDB } from "@/services/frontendDb//initDB";

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
