"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { menuItems, role } from "@/lib/data";

const Menu = () => {
  const pathname = usePathname();

  return (
    <div className="w-full bg-[#0C3DA7] text-white px-4 p-3 flex gap-6 overflow-x-auto no-scrollbar">
      {menuItems.flatMap((section) =>
        section.items
          .filter((item) => item.visible.includes(role))
          .map((item) => {
            const active = pathname === item.href;

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
          })
      )}
    </div>
  );
};

export default Menu;
