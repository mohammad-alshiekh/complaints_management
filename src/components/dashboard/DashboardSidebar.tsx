"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  Search, 
  Settings, 
  Wand2, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sidebarItems } from "./sidebar-items";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { getUserRole } from "@/lib/auth";
import { isPathAllowed } from "@/lib/permissions";

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
}: DashboardSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { t, dir } = useLanguage();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const SidebarContent = () => {
    const role = getUserRole();
    const filteredItems = sidebarItems.filter(item => {
      if (!item.url) return true; // Items with sub-items (though currently none in Employee view)
      return isPathAllowed(role, item.url);
    });

    return (
      <div className={cn(
        "flex h-full flex-col border-r bg-background",
        dir === 'rtl' ? 'border-l border-r-0' : 'border-r'
      )} dir={dir}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <Wand2 className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">{t('dashboardTitle')}</h2>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-2" dir={dir}>
          <div className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = item.url === pathname || item.items?.some(sub => sub.url === pathname);
              
              return (
                <div key={item.title} className="mb-1">
                  {item.url ? (
                  <Link
                    href={item.url}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                      item.url === pathname ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {dir === 'rtl' ? (
                        <>
                          <span>{t(item.title)}</span>
                          {item.icon}
                        </>
                      ) : (
                        <>
                          {item.icon}
                          <span>{t(item.title)}</span>
                        </>
                      )}
                    </div>
                    {item.badge && (
                      <Badge variant="outline" className={`${dir === 'rtl' ? 'mr-auto' : 'ml-auto'} rounded-full px-2 py-0.5 text-xs`}>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ) : (
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-primary/5 text-primary" : "hover:bg-muted"
                    )}
                    onClick={() => item.items && toggleExpanded(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      {dir === 'rtl' ? (
                        <>
                          <span>{t(item.title)}</span>
                          {item.icon}
                        </>
                      ) : (
                        <>
                          {item.icon}
                          <span>{t(item.title)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {item.items && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems[item.title] ? "rotate-180" : ""
                          )}
                        />
                      )}
                    </div>
                  </button>
                )}

                {item.items && expandedItems[item.title] && (
                  <div className={`mt-1 ${dir === 'rtl' ? 'mr-6 border-r pr-3' : 'ml-6 border-l pl-3'} space-y-1`}>
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition-colors",
                          pathname === subItem.url ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                        )}
                      >
                        {t(subItem.title)}
                        {subItem.badge && (
                          <Badge variant="outline" className={`${dir === 'rtl' ? 'mr-auto' : 'ml-auto'} rounded-full px-2 py-0.5 text-xs`}>
                            {subItem.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

     
    </div>
    );
  };

  return (
    <>
      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 md:hidden" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden",
          dir === 'rtl' ? "right-0" : "left-0",
          mobileMenuOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full" : "-translate-x-full")
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-30 hidden w-64 transform bg-background transition-transform duration-300 ease-in-out md:block",
          dir === 'rtl' ? "right-0 border-l" : "left-0 border-r",
          sidebarOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full" : "-translate-x-full")
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
