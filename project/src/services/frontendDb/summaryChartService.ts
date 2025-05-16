import { initDB } from "@/services/frontendDb/initDB";
import { SUMMARY_CHART_DATA_STORE } from "@/services/frontendDb/storeDefinitions";
import SummaryChart from "@/types/summaryChart";

export const saveSummaryChartData = async (data: SummaryChart) => {
  const db = await initDB();
  await db.put(SUMMARY_CHART_DATA_STORE, { id: "current", ...data });
};

export const getSummaryChartData = async (): Promise<SummaryChart> => {
  const db = await initDB();
  return db.get(SUMMARY_CHART_DATA_STORE, "current");
};

export const clearSummaryChartData = async () => {
  const db = await initDB();
  await db.clear(SUMMARY_CHART_DATA_STORE);
};
