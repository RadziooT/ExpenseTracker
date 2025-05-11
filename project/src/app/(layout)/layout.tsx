import { ReactNode } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
