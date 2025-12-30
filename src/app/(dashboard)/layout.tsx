import type { Metadata } from "next";
import Menu from "@/components/Menu";
import RouteGuard from "@/components/RouteGuard";
import Navbar from "@/components/navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Management Dashboard",
  description: "Management System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["admin", "employee"]}>
      <div className="h-screen flex bg-[#F8FAFC]">
        {/* SIDEBAR */}
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 flex flex-col border-r border-gray-200 bg-white">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-3 mb-8 px-2"
          >
            <div className="w-10 h-10 bg-[#0C3DA7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <span className="text-xl font-bold italic">S</span>
            </div>
            <span className="hidden lg:block font-bold text-xl text-[#1E293B] tracking-tight">
              SMART CMS
            </span>
          </Link>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Menu />
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
