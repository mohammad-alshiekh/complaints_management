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
    title: "home",
    icon: <LayoutDashboard className="h-5 w-5" />,
    url: "/dashboard",
    isActive: true,
  },
   
   
  {
    title: "complaints",
    icon: <Grid className="h-5 w-5" />,
    url: "/list/complaints" 
    
  },
   {
    title: "citizens",
    icon: <Layers className="h-5 w-5" />,
    url: "/list/users",
  },
  {
    title: "employees",
    icon: <Users className="h-5 w-5" />,
    url: "/list/employee",
  },
  {
    title: "agencies",
    icon: <Bookmark className="h-5 w-5" />,
    url: "/list/agencies",
  },
   
  {
    title: "profile",
    icon: <Users2 className="h-5 w-5" />,
     url: "/profile"
    
  } 
];
