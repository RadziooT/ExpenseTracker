import { initData } from "@/actions/initData";
import { getUserData, saveUserData } from "@/services/frontendDb/userService";
import { saveTransactions } from "@/services/frontendDb/transactionService";
import {
  clearSummaryChartData,
  getSummaryChartData,
  saveSummaryChartData,
} from "@/services/frontendDb/summaryChartService";
import SummaryChart from "@/types/summaryChart";

export const initAndCacheUserData = async (username: string) => {
  const initDataResult = await initData({ username });
  await saveUserData(initDataResult.userData);
  await saveTransactions(initDataResult.transactions);
  //Clear summary chart (cause: incremented id in db)
  await clearSummaryChartData();
  await saveSummaryChartData(initDataResult.summaryChart);

  return initDataResult;
};

export const getCachedUserData = async () => {
  return getUserData();
};

export const getCachedChartData = async (): Promise<SummaryChart> => {
  return getSummaryChartData();
};
