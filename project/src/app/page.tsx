"use client";

import { useState } from "react";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import {
  BellAlertIcon,
  ChartPieIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";
import Header from "@/components/header";
import Footer from "@/components/footer";

const features = [
  {
    title: "Smarter Spending",
    icon: ChartPieIcon,
    summary: "Track and analyze your finances with ease.",
    bullets: [
      "Monitor habits visually",
      "Monthly expense snapshots",
      "Customize chart categories",
    ],
  },
  {
    title: "No Internet? No Problem",
    icon: WifiIcon,
    summary: "Stay on track even without internet.",
    bullets: [
      "Use offline mode seamlessly",
      "Access monthly data",
      "Sync automatically later",
    ],
  },
  {
    title: "Budget Anywhere",
    icon: DevicePhoneMobileIcon,
    summary: "Install the app and budget on the go.",
    bullets: [
      "Receive alerts about finance news",
      "Quick budget overview",
      "Expenses organized by categories",
    ],
  },
  {
    title: "Stay On Budget",
    icon: BellAlertIcon,
    summary: "Set budget and never spend too much.",
    bullets: [
      "Smart budget reminders",
      "Flexible budget editing",
      "Instant visual feedback",
    ],
  },
];

export default function WelcomePage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="overflow-y-auto h-[calc(100vh-116px)] p-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map(({ title, icon: Icon, summary, bullets }, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                className={`border border-gray-200 rounded-2xl p-4 bg-white transition-shadow duration-300 ${
                  isActive ? "shadow-2xl" : "shadow-md"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onTouchStart={() => setActiveIndex(index)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <p className="text-sm text-gray-600 mb-2">{summary}</p>
                {bullets.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {bullets.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
