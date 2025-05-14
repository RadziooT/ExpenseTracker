"use client";

import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Spinner } from "@heroui/react";

Chart.register(ArcElement, Tooltip, Legend);

function fetchMockData() {
  return {
    userData: {
      username: "Alice",
      setSpendingBudget: 1500,
      setOverallBudget: 3000,
      thisMonthIncomeCount: 2200,
      thisMonthExpensesCount: 1800,
    },
    chartEntries: [
      { type: "Food", amount: 500, count: 5 },
      { type: "Transport", amount: 300, count: 3 },
      { type: "General", amount: 700, count: 4 },
      { type: "Misc", amount: 300, count: 2 },
    ],
  };
}

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [pieData, setPieData] = useState<any>(null);

  useEffect(() => {
    const data = fetchMockData();

    const pieChart = {
      labels: data.chartEntries.map((entry) => entry.type),
      datasets: [
        {
          label: "Expenses",
          data: data.chartEntries.map((entry) => entry.amount),
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
          borderWidth: 1,
        },
      ],
    };

    setData(data.userData);
    setPieData(pieChart);
  }, []);

  if (!data || !pieData)
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

  let { username, setSpendingBudget, thisMonthExpensesCount } = data;

  const budgetDiff = setSpendingBudget - thisMonthExpensesCount;
  let status = "";
  let color = "";

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

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-center px-4">
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">Welcome, {username}!</h1>
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
