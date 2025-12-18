import type { Metadata } from "next";
import Menu from "@/components/Menu";
import RouteGuard from "@/components/RouteGuard";
import { MdLanguage } from "react-icons/md";
import { FiBell } from "react-icons/fi";

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
    <RouteGuard>
      <div className="h-screen flex">
        {/* Main Content Area */}
        <div className="w-full flex flex-col">
          <div className="h-[128px] flex-shrink-0">
            {/* TOP BAR */}
            <div className="bg-[#0C3DA7] text-white px-8 py-4 flex items-center justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-3 text-lg font-bold">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">📘</div>
                SMART CMS
              </div>

              {/* CENTER */}
              <div className="text-sm opacity-80">
                APPLICATION / <span className="font-semibold">DASHBOARD</span>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-5 text-xl">
                <MdLanguage />
                <FiBell />
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>

            {/* MENU BAR */}
            <Menu />
          </div>
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {children}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
