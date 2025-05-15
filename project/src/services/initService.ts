import { initUserData } from "@/actions/initUserData";
import { getUserData, saveUserData } from "@/services/frontendDb/userService";
import { saveTransactions } from "@/services/frontendDb/transactionService";
import {
  clearChartData,
  getAllChartData,
  getChartData,
  saveChartData,
} from "@/services/frontendDb/chartService";

export const initAndCacheUserData = async (username: string) => {
  const initData = await initUserData({ username });
  await saveUserData(initData.userData);
  await saveTransactions(initData.transactions);
  await clearChartData();

  console.log("dwdawdwadw");
  console.log(initData.chartEntries);

  await saveChartData(initData.chartEntries);

  return initData;
};

export const getCachedUserData = async () => {
  return getUserData();
};

export const getCachedChartData = async () => {
  return getAllChartData();
};

function prepareOfflineData() {}
