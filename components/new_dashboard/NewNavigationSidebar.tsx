"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TimerIcon,
  FileText,
  BookOpen,
  Video,
  HelpCircle,
  Settings,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    icon: Home,
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: TimerIcon,
    href: "/roadmap",
    label: "Roadmap",
  },
  {
    icon: FileText,
    href: "/changelog",
    label: "Changelog",
  },
];

const comingSoonItems = [
  {
    icon: BookOpen,
    label: "Documentation",
  },
  {
    icon: Video,
    label: "Tutorials",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
  },
];

const NewNavigationSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-[#0A0A0B] border-r border-neutral-800/30 flex flex-col items-center">
      {/* Navigation Items */}
      <div className="flex-1 w-full py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative w-full group"
            >
              <div
                className={cn(
                  "flex h-14 w-full items-center justify-center",
                  isActive && "relative"
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 border-r-2 border-primary" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-neutral-400 group-hover:text-neutral-200"
                  )}
                />

                {/* Tooltip */}
                <div className="absolute left-full ml-2 hidden rounded-md bg-neutral-800/90 px-2 py-1 text-xs text-neutral-200 group-hover:block">
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Coming Soon Items */}
        {comingSoonItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="relative w-full group">
              <div className="flex h-14 w-full items-center justify-center opacity-40">
                <Icon className="h-5 w-5 text-neutral-400" />

                {/* Coming Soon Indicator */}
                <div className="absolute -right-1 -top-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>

                {/* Tooltip */}
                <div className="absolute left-full ml-2 hidden rounded-md bg-neutral-800/90 px-2 py-1 text-xs group-hover:block">
                  <span className="text-neutral-200">{item.label}</span>
                  <span className="ml-1 text-primary text-xs">Soon</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="w-full py-4 space-y-2">
        <button className="flex h-14 w-full items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors">
          <Moon className="h-5 w-5" />
        </button>
        <button className="flex h-14 w-full items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default NewNavigationSidebar;
