import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Provider } from "@/app/provider";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { UserProvider } from "@/app/userContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense Tracker App made for Mobile Systems Course",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <UserProvider>
      <HeroUIProvider>
        <ToastProvider />
        <html lang="en">
          <Provider>
            <body className="h-screen">{children}</body>
          </Provider>
        </html>
      </HeroUIProvider>
    </UserProvider>
  );
}
