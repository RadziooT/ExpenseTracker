"use client";

import { ArcElement, Chart, ChartData, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useUserContext } from "@/app/userContextProvider";
import Loading from "@/components/global/loading";
import SummaryChart from "@/types/summaryChart";
import {
  getCachedChartData,
  getCachedUserData,
  initAndCacheUserData,
} from "@/services/cacheService";
import { UserData } from "@/types/userData";
import { redirect } from "next/navigation";
import { addToast, Button, Input } from "@heroui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { ChangeUserBudgetRequestDTO } from "@/types/api/ChangeUserBudgetRequestDTO";

Chart.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [data, setData] = useState<UserData>({
    currentMonthExpensesCount: 0,
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId, isUserAuthenticated } = useUserContext();
  const [noChartData, setNoChartData] = useState<boolean>(false);
  const [budgetDiff, setBudgetDiff] = useState<number>(0);
  const [newBudget, setNewBudget] = useState<string>("");

  let statusText = "";
  let color = "";

  useEffect(() => {
    if (!isUserAuthenticated) {
      redirect("/");
    }

    setIsLoading(true);
    calculateNewData().then(() => {
      setIsLoading(false);
    });
  }, [isUserAuthenticated]);

  const refreshUserData = async () => {
    setIsLoading(true);
    try {
      await initAndCacheUserData(userId!);
      await calculateNewData();
    } catch (err: any) {
      console.log(err);
      if (err.message == "Failed to fetch") {
        addToast({
          title: "Offline mode",
          description: "Data synchronization is available only in online mode",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: "Oops!",
          description: "Couldn't synchronize data. Try again later",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNewData = async () => {
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
      });
    });
  };

  const updateUserBudget = async () => {
    const request: ChangeUserBudgetRequestDTO = {
      userId: userId!,
      budget: parseFloat(newBudget),
    };

    try {
      setIsLoading(true);

      await fetch("/api/user/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      await refreshUserData();
    } catch (err: any) {
      console.log(err);
      if (err.message == "Failed to fetch") {
        addToast({
          title: "Offline mode",
          description: "Data modification is available only in online mode",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: "Oops!",
          description: "Couldn't change budget. Try again later",
          color: "warning",
          timeout: 2000,
          shouldShowTimeoutProgress: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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

        <Input
          className="mb-4"
          isRequired
          type="number"
          label="Budget"
          name="budget"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
        />
        <Button
          className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium mb-2 py-2 px-4 rounded-full transition-colors"
          onPress={() => updateUserBudget()}
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
          Set new budget
        </Button>
      </div>

      <div className="w-full mt-2 max-w-md">
        <Button
          className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium mb-2 py-2 px-4 rounded-full transition-colors"
          onPress={refreshUserData}
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
          RefreshData
        </Button>
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
