import { ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
