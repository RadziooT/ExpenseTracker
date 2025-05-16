"use client";

import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Spinner } from "@heroui/react";
import { getCachedChartData, getCachedUserData } from "@/services/initService";
import { useUserContext } from "@/app/userContextProvider";
import WelcomePage from "@/components/Welcome";

Chart.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [pieData, setPieData] = useState<any>(null);
  const [budgetDiff, setBudgetDiff] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId, isUserAuthenticated, setIsOffline, setIsUserAuthenticated } =
    useUserContext();

  let status = "";
  let color = "";

  useEffect(() => {
    getCachedUserData().then((userData) => {
      getCachedChartData().then((chartData) => {
        const pieChart = {
          labels: chartData.map((entry: any) => entry.entry.label),
          datasets: [
            {
              label: "test",
              data: chartData.map((entry: any) => entry.entry.amount),
              backgroundColor: chartData.map((entry: any) => entry.entry.color),
              borderWidth: 1,
            },
          ],
        };

        setBudgetDiff(
          userData.spendingBudget - userData.currentMonthExpensesCount,
        );

        if (budgetDiff > -200) {
          status = "Over budget :(";
          color = "text-red-600";
        } else if (budgetDiff < 200) {
          status = "Spend carefully you're near your budget";
          color = "text-yellow-600";
        } else {
          status = "Well below budget keep going";
          color = "text-green-600";
        }

        setData(userData);
        setPieData(pieChart);

        setIsLoading(false);
      });
    });
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        <Spinner
          classNames={{ label: "text-foreground mt-4" }}
          label="Loading your data..."
          color="warning"
          variant="wave"
        />
      </div>
    );

  if (isUserAuthenticated != "authenticated") return <WelcomePage />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-center px-4">
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">Welcome, {data.firstName}!</h1>
        <div className="flex-col items-center text-center px-4 border-solid rounded-xl outline-black">
          <p>Current budget</p>
          <p className={color}>{budgetDiff}</p>
          <p className={`mt-1 font-medium ${color}`}>{status}</p>
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
            <Pie
              data={pieData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
