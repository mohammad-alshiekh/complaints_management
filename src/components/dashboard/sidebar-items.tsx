import React from "react";
import {
  Grid,
  FileText,
  Layers,
  BookOpen,
  Users,
  Bookmark,
  LayoutDashboard,
  BarChart3,
  Megaphone,
  Calendar,
  Settings,
  UserCircle,
  Users2,
  LogOut,
  AlertCircle
} from "lucide-react";

export interface SidebarSubItem {
  title: string;
  url: string;
  badge?: string;
}

export interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  url?: string;
  badge?: string;
  items?: SidebarSubItem[];
  isActive?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    url: "/admin",
    isActive: true,
  },
  {
    title: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    url: "/analytics",
  },
  {
    title: "Workflows",
    icon: <Layers className="h-5 w-5" />,
    url: "/over",
  },
  {
    title: "Management",
    icon: <Grid className="h-5 w-5" />,
    items: [
      { title: "Complaints", url: "/list/complaints" },
      { title: "Employees", url: "/list/employees" },
      { title: "Users", url: "/list/users" },
    ],
  },
  {
    title: "Communication",
    icon: <Megaphone className="h-5 w-5" />,
    items: [
      { title: "Announcements", url: "/list/announcements" },
      { title: "Events", url: "/list/events" },
    ],
  },
  {
    title: "Organization",
    icon: <Users2 className="h-5 w-5" />,
    items: [
      { title: "Team", url: "/team" },
      { title: "Profile", url: "/profile" },
    ],
  },
  {
    title: "System",
    icon: <Settings className="h-5 w-5" />,
    items: [
      { title: "Settings", url: "/settings" },
      { title: "Logout", url: "/logout" },
    ],
  },
];
