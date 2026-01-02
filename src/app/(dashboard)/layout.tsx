import type { Metadata } from "next";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";

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
    <DashboardContainer>
      {children}
    </DashboardContainer>
  );
}
