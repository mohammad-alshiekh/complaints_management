"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import DashboardPage from "../admin/page";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const userRole = getUserRole();

    // Redirect based on role if needed, or show default dashboard
    // For now, we'll show the same dashboard for both roles
    // You can customize this later to show different dashboards
  }, [router]);

  // Show the dashboard page (currently same for admin and employee)
  return <DashboardPage />;
}

