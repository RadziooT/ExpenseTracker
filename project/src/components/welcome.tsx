"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "All expenses in one place",
    icon: ChartBarIcon,
    summary: "Track and analyze your finances with ease.",
    bullets: [
      "Compare spending over time",
      "Visual insights with charts",
      "Organized by categories",
    ],
  },
  {
    title: "Offline mode",
    icon: CloudIcon,
    summary: "Stay productive even without internet.",
    bullets: [
      "Access current month’s data",
      "Sync when reconnected",
      "Control offline changes",
    ],
  },
  {
    title: "Progressive Web App",
    icon: DevicePhoneMobileIcon,
    summary: "Install the app and budget on the go.",
    bullets: [
      "Receive smart push alerts",
      "Quick budget checks",
      "One-tap expense visualization",
    ],
  },
];

export default function WelcomePage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {features.map(({ title, icon: Icon, summary, bullets }, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={index}
              className={`flex-1 border border-gray-200 rounded-2xl p-4 bg-white transition-shadow duration-300 ${
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
  );
}
