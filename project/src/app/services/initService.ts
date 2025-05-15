import { initUserData } from "@/app/actions/initUserData";
import { getUserData } from "@/app/services/frontendDbService";

export const initAndCacheUserData = async (username: string) => {
  console.log("in initAndCacheUserData");
  return await initUserData({ username });
};

export const getCachedUserData = async () => {
  return getUserData();
};
