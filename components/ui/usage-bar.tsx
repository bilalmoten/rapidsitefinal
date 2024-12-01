import { Globe2, BarChart3, Bot } from "lucide-react";

interface UsageBarProps {
  label: string;
  current: number;
  limit: number;
  icon: "website" | "generated" | "ai";
}

export function UsageBar({ label, current, limit, icon }: UsageBarProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const icons = {
    website: Globe2,
    generated: BarChart3,
    ai: Bot,
  };

  const Icon = icons[icon];

  return (
    <div className="group relative">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
        <span className="ml-auto">
          {current}/{limit}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
              ? "bg-yellow-500"
              : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}: {current}/{limit}
      </span>
    </div>
  );
}
