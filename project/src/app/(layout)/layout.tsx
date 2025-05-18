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
        {children}
        <Footer />
      </div>
    </HeroUIProvider>
  );
}
