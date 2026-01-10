"use client";

import React from "react";
import { 
  Bell, 
  Cloud, 
  Menu, 
  MessageSquare, 
  PanelLeft, 
  Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

import { useLanguage } from "@/lib/language-context";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  notifications: number;
}

export function DashboardNavbar({
  sidebarOpen,
  setSidebarOpen,
  setMobileMenuOpen,
  notifications,
}: DashboardNavbarProps) {
  const [userInitials, setUserInitials] = useState("JD");
  const [userImage, setUserImage] = useState<string | null>(null);
  const { t, dir } = useLanguage();

  useEffect(() => {
    const user = getUser() as any;
    if (user) {
      const displayName = user.name || user.fullName || user.email || "JD";
      setUserInitials(displayName.charAt(0).toUpperCase());
      setUserImage(user.image || user.avatarUrl || null);
    }
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md" dir={dir}>
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-2xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelLeft className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-2xl"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
        </div>

        <div className="flex items-center gap-2">


          <Avatar className="h-10 w-10     overflow-hidden">
             <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
