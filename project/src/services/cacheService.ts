import { initData } from "@/actions/initData";
import {
  clearUserData,
  getUserData,
  saveUserData,
} from "@/services/frontendDb/userService";
import {
  clearAllTransactionData,
  saveTransactions,
} from "@/services/frontendDb/transactionService";
import {
  clearSummaryChartData,
  getSummaryChartData,
  saveSummaryChartData,
} from "@/services/frontendDb/summaryChartService";
import SummaryChart from "@/types/summaryChart";
import { getLocalTimeZone, startOfMonth, today } from "@internationalized/date";

export const initAndCacheUserData = async (userId: string) => {
  const initDataResult = await initData({
    userId,
    dateFrom: startOfMonth(today(getLocalTimeZone())).toString(),
    dateTo: today(getLocalTimeZone()).toString(),
  });
  await clearCachedData();
  await saveUserData(initDataResult.userData);
  await saveTransactions(initDataResult.transactions);
  await saveSummaryChartData(initDataResult.summaryChart);

  return initDataResult;
};

export const getCachedUserData = async () => {
  return getUserData();
};

export const getCachedChartData = async (): Promise<SummaryChart> => {
  return getSummaryChartData();
};

export const clearCachedData = async (): Promise<void> => {
  await clearUserData();
  await clearAllTransactionData();
  await clearSummaryChartData();
};
