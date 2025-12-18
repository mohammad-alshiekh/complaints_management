"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { menuItems } from "@/lib/data";
import { getUserRole } from "@/lib/auth";

const Menu = () => {
  const pathname = usePathname();

  // Get role dynamically
  const role = useMemo(() => {
    const userRole = getUserRole();
    if (userRole === 0) return "admin";
    if (userRole === 1) return "employee";
    return null;
  }, []);

  // Filter menu items based on role
  const filteredItems = useMemo(() => {
    if (!role) return [];
    return menuItems.flatMap((section) =>
      section.items.filter((item) => item.visible.includes(role))
    );
  }, [role]);

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#0C3DA7] text-white px-4 p-3 flex gap-6 overflow-x-auto no-scrollbar">
      {filteredItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            href={item.href}
            key={item.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-md whitespace-nowrap cursor-pointer transition
              ${active ? "bg-white text-[#0C3DA7] font-semibold" : "text-white hover:bg-blue-700"}`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={20}
              height={20}
            />
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Menu;
