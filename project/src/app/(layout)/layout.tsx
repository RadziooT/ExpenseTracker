import { ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <div className="h-full">
        <Header />
        <div className="overflow-y-auto h-[calc(100vh-116px)] p-4 max-w-6xl mx-auto">
          {children}
        </div>
        <Footer />
      </div>
    </HeroUIProvider>
  );
}
