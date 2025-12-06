import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import Menu from "@/components/Menu";
import Navbar from "@/components/navbar";
import Footer from "@/components/fotter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "  Management Dashboard",
  description: " Management System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Menu />
      </div>
      {/* Main Content Area */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#f7fbfa] flex flex-col">
        <div className="h-[60px] flex-shrink-0">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </div>
    </div>
  );
}
