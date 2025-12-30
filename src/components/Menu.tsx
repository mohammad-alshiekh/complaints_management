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
    <div className="mt-4 text-sm px-2">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2 mb-6" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-medium uppercase text-xs tracking-wider px-4 mb-2">
            {section.title}
          </span>
          {section.items
            .filter((item) => role && item.visible.includes(role))
            .map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-3 px-4 rounded-xl transition-all duration-200 group
                    ${active 
                      ? "bg-[#0C3DA7] text-white shadow-lg shadow-blue-200" 
                      : "hover:bg-gray-50 hover:text-[#0C3DA7]"
                    }`}
                >
                  <div className={`relative w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${active ? "brightness-0 invert" : ""}`}>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="hidden lg:block font-medium">{item.label}</span>
                </Link>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
