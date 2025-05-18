"use client";

import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useUserContext } from "@/app/userContextProvider";
import WelcomePage from "@/components/Welcome";
import Loading from "@/components/global/Loading";
import SummaryChart from "@/types/summaryChart";
import { getCachedChartData, getCachedUserData } from "@/services/cacheService";

Chart.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [pieData, setPieData] = useState<any>(null);
  const [budgetDiff, setBudgetDiff] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId, isUserAuthenticated } = useUserContext();

  let statusText = "";
  let color = "";

  useEffect(() => {
    if (!isUserAuthenticated) {
      setIsLoading(false);
      return;
    }

    getCachedUserData().then((userData) => {
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

        setIsLoading(false);
      });
    });
  }, [isUserAuthenticated]);

  if (isLoading) return <Loading loadingContent="Loading data..." />;

  if (!isUserAuthenticated) return <WelcomePage />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-center px-4">
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">Welcome, {data?.firstName}!</h1>
        <div className="flex-col items-center text-center px-4 border-solid rounded-xl outline-black">
          <p>Current budget</p>
          <p className={color}>{budgetDiff}</p>
          <p className={`mt-1 font-medium ${color}`}>{statusText}</p>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-lg">
          Checkout your spending analysis from current month
        </p>
      </div>

      <div className="w-full mt-10 max-w-md">
        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0">
            {pieData ? (
              <Pie
                data={pieData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
