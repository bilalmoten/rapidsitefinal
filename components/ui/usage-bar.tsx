interface UsageBarProps {
  label: string;
  current: number;
  limit: number;
}

export function UsageBar({ label, current, limit }: UsageBarProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {current}/{limit}
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
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
    </div>
  );
}
