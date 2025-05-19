"use client";

import { ReactNode } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {children}
      </div>
    </HeroUIProvider>
  );
}
