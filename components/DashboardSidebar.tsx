"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const DashboardSidebar = () => {
  const { isExpanded, darkMode, toggleSidebar, toggleDarkMode } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
    },
    {
      icon: HelpCircle,
      label: "Help",
      href: "/dashboard/help",
    },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      className={cn(
        "border-r bg-muted/30 transition-all duration-300 flex flex-col h-screen",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        <div
          className={cn(
            "flex items-center",
            isExpanded ? "gap-2" : "w-full justify-center"
          )}
        >
          <Wand2 className="h-6 w-6 text-blue-600" />
          {isExpanded && (
            <span className="font-semibold text-lg">RapidSite</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex flex-col gap-2 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full",
                    isExpanded ? "justify-start px-3" : "justify-center px-0",
                    isActive && "bg-muted"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  {isExpanded && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t p-3 space-y-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full",
            isExpanded ? "justify-start px-3" : "justify-center px-0"
          )}
          onClick={toggleDarkMode}
        >
          <Moon className={cn("h-6 w-6", darkMode && "text-blue-600")} />
          {isExpanded && (
            <div className="flex items-center justify-between flex-1 ml-3">
              <span>Dark Mode</span>
              <Switch checked={darkMode} />
            </div>
          )}
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:text-foreground",
            isExpanded ? "justify-start px-3" : "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
          {isExpanded && <span className="ml-3">Log Out</span>}
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground",
            isExpanded ? "justify-start px-3" : "justify-center px-0"
          )}
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-3">Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
