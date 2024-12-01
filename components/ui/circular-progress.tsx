"use client";

import { Globe2, BarChart3, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  icon: "website" | "generated" | "ai";
  current: number;
  limit: number;
  label: string;
}

export function CircularProgress({
  icon,
  current,
  limit,
  label,
}: CircularProgressProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const icons = {
    website: Globe2,
    generated: BarChart3,
    ai: Bot,
  };

  const Icon = icons[icon];
  const strokeDasharray = 2 * Math.PI * 18; // Circle circumference
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  return (
    <div className="group relative px-4">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            className="fill-none stroke-muted stroke-2"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            className={cn(
              "fill-none stroke-2 transition-all",
              isAtLimit
                ? "stroke-red-500"
                : isNearLimit
                ? "stroke-yellow-500"
                : "stroke-primary"
            )}
            style={{
              strokeDasharray: strokeDasharray,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-full -top-2 
          bg-white dark:bg-gray-800 shadow-lg text-sm px-3 py-1.5 rounded-md 
          opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50
          min-w-max"
      >
        {label}
        <div className="font-medium text-center">
          {current}/{limit}
        </div>
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 
          bg-white dark:bg-gray-800 rotate-45 transform"
        />
      </div>
    </div>
  );
}
