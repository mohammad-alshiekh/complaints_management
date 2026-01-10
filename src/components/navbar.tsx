"use client";

 import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSearch, FiBell, FiMessageSquare, FiGlobe, FiChevronDown } from "react-icons/fi";
import { getUserRole } from "@/lib/auth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const userRole = getUserRole();
    if (userRole === 0) setRole("Admin");
    else if (userRole === 1) setRole("User");

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full h-20 bg-white    transition-all duration-300 flex items-center px-8 sticky top-0 z-50 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex justify-between items-center w-full">
        {/* Search section */}
        <div className="hidden md:flex items-center gap-3  ">
          
        </div>

        {/* icons & profile section */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative group">
              <FiGlobe className="text-xl" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Language
              </div>
            </button>
            <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative group">
              <FiMessageSquare className="text-xl" />
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Messages
              </div>
            </button>
            <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative group">
              <FiBell className="text-xl" />
              <span className="absolute top-2 right-2.5 w-4 h-4 flex items-center justify-center bg-red-500 rounded-full text-white text-[10px] font-bold border-2 border-white">
                3
              </span>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Notifications
              </div>
            </button>
          </div>

          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 leading-none mb-1">Mohamad</span>
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">{role || "User"}</span>
            </div>
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:border-blue-200 transition-all">
                <Image
                  alt="avatar"
                  src="/avatar.png"
                  width={44}
                  height={44}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <FiChevronDown className="text-gray-400 group-hover:text-gray-600 transition-colors hidden md:block" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
