import { getUserRole } from "@/lib/auth";

export let role: "admin" | "employee" | null = null;

const userRole = getUserRole();

if (userRole === 0) {
  role = "admin";
} else if (userRole === 1) {
  role = "employee";
} else {
  role = null;
}
export const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Dashboard",
        href: "/dashboard",
        visible: ["admin", "employee"],
      },
      {
        icon: "/profile.png",
        label: "Complaints",
        href: "/list/complaints",
        visible: ["admin", "employee"],
      },
      {
        icon: "/announcement.png",
        label: "Users",
        href: "/list/users",
        visible: ["admin"],
      },
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "employee"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "employee"],
      },
    ],
  },
]; 
 