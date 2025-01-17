"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Home,
  LayoutDashboard,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/dashboard",
      isActive: true,
    },
    {
      icon: LayoutDashboard,
      label: "Projects",
      href: "/dashboard/projects",
    },
    {
      icon: FileText,
      label: "Documentation",
      href: "/docs",
    },
  ];

  const bottomNavItems = [
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: HelpCircle,
      label: "Help",
      href: "/help",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col transition-all duration-300",
        isExpanded ? "w-64" : "w-20",
        "border-r border-neutral-80 bg-neutral-90/50 backdrop-blur-sm",
        className
      )}
    >
      {/* Top section with logo and collapse button */}
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-main text-neutral-10">
            RS
          </div>
          {isExpanded && (
            <span className="text-lg font-semibold text-neutral-10">
              RapidSite
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-40 hover:text-neutral-10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Main navigation items */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
              item.isActive
                ? "bg-primary-main/10 text-primary-main"
                : "text-neutral-40 hover:bg-neutral-80 hover:text-neutral-10"
            )}
          >
            <item.icon className="h-5 w-5" />
            {isExpanded && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2 p-4">
        {bottomNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-40 transition-colors hover:bg-neutral-80 hover:text-neutral-10"
          >
            <item.icon className="h-5 w-5" />
            {isExpanded && <span>{item.label}</span>}
          </Link>
        ))}

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-40 transition-colors hover:bg-neutral-80 hover:text-neutral-10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-5 w-5" />
              {isExpanded && <span>Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              {isExpanded && <span>Dark Mode</span>}
            </>
          )}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
