"use client";

import { ArcElement, Chart, ChartData, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useUserContext } from "@/app/userContextProvider";
import Loading from "@/components/global/loading";
import SummaryChart from "@/types/summaryChart";
import { getCachedChartData, getCachedUserData } from "@/services/cacheService";
import { UserData } from "@/types/userData";
import { redirect } from "next/navigation";
import { Button } from "@heroui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

Chart.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [data, setData] = useState<UserData>({
    currentMonthExpensesCount: 0,
    currentMonthIncomeCount: 0,
    firstName: "",
    spendingBudget: 0,
    userId: "",
    username: "",
  });
  const [pieData, setPieData] = useState<ChartData>({
    datasets: [],
    labels: [],
    xLabels: [],
    yLabels: [],
  });
  const [budgetDiff, setBudgetDiff] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isUserAuthenticated, dataRefreshRequired, setDataRefreshRequired } =
    useUserContext();
  const [noChartData, setNoChartData] = useState<boolean>(false);

  let statusText = "";
  let color = "";

  useEffect(() => {
    if (!isUserAuthenticated) {
      redirect("/");
    }

    getCachedUserData().then((userData: UserData) => {
      getCachedChartData().then((chartData: SummaryChart) => {
        const pieChart = {
          labels: chartData.labels,
          datasets: [
            {
              label: "Current month expenses summary",
              data: chartData.data,
              backgroundColor: chartData.backgroundColor,
              borderWidth: 1,
            },
          ],
        };

        if (chartData.data.length < 1) {
          setNoChartData(true);
        }

        setBudgetDiff(
          userData.spendingBudget - userData.currentMonthExpensesCount,
        );

        if (budgetDiff > -200) {
          statusText = "Over budget :(";
          color = "text-red-600";
        } else if (budgetDiff < 200) {
          statusText = "Spend carefully you're near your budget";
          color = "text-yellow-600";
        } else {
          statusText = "Well below budget keep going";
          color = "text-green-600";
        }

        setData(userData);
        setPieData(pieChart);
        console.log(pieChart);
        setIsLoading(false);
      });
    });
  }, [isUserAuthenticated]);

  if (isLoading) return <Loading loadingContent="Loading data..." />;

  return (
    <div className="w-full flex flex-col items-center text-center px-4">
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">Welcome {data?.firstName}!</h1>
        <div className="flex-col items-center text-center px-4 border-solid rounded-xl outline-black">
          <p>This month budget left:</p>
          <p className={color}>{budgetDiff}</p>
          <p className={`mt-1 font-medium ${color}`}>{statusText}</p>
        </div>
      </div>

      <div className="w-full mt-2 max-w-md">
        {dataRefreshRequired && (
          <Button className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium mb-2 py-2 px-4 rounded-full transition-colors">
            <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
            RefreshData
          </Button>
        )}
        <h1 className="text-lg font-semibold">Current month spending:</h1>
        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0">
            {noChartData ? (
              <p className="text-gray-400 text-sm">
                No data for current month yet
              </p>
            ) : (
              <Pie
                data={pieData as any}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
