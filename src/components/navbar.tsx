"use client";

import Image from "next/image";
import { Input } from "postcss";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full h-[60px] bg-[#f7fbfa] transition-all duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="flex justify-between p-4 items-center h-full">
        {/* Search section */}
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image
            alt="search"
            src="/search.png"
            width={14}
            height={14}
            className=""
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-[200px] p-2 bg-transparent outline-none"
          />
        </div>
        {/* icons section */}
        <div className="flex items-center gap-6 justify-end w-full">
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
            <Image
              alt="search"
              src="/message.png"
              width={14}
              height={14}
              className=""
            />
          </div>
          <div className="relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
            <Image
              alt="ann"
              src="/announcement.png"
              width={14}
              height={14}
              className=""
            />
            <div className="absolute -top-2 w-4 h-4 flex items-center justify-center bg-purple-500 rounded-full text-white text-xs">
              1
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">Mohamad</span>
            <span className="text-[10px] text-gray-500 text-right">Admin</span>
          </div>
          <Image
            alt="avatar"
            src="/avatar.png"
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
