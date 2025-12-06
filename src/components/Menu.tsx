import React from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems, role } from "@/lib/data";

const Menu = () => {
  return (
    <div className="flex flex-col">
      <div className="flex item-center gap-2 lg:justify-start justify-center p-2">
        <Image alt="logo" src="/logo.png" width={32} height={32} className="" />
        <span className="hidden lg:block text-gray-400  text-md ">
          {"Dashboard"}
        </span>
      </div>
      <div className=" text-xs px-3">
        {menuItems.map((i) => (
          <div key={i.title} className="gap-2 flex flex-col">
            <span className="hidden lg:block text-gray-400 font-light my-2">
              {i.title}
            </span>
            {i.items.map(
              (item) =>
                item.visible.includes(role) && (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="flex item-center gap-3 lg:justify-start justify-center py-2 text-gray-500 md:px-2 rounded-md hover:bg-cyanlightx"
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                      className=""
                    />
                    <span className="hidden lg:block  text-sm">
                      {item.label}
                    </span>
                  </Link>
                )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
