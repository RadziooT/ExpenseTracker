import { UserData } from "@/types/userData";
import TransactionData from "@/types/transactionData";
import SummaryChart from "@/types/summaryChart";

export interface InitData {
  userData: UserData;
  transactions: Array<TransactionData>;
  summaryChart: SummaryChart;
}
