import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  variant?: "default" | "success" | "gradient";
  label?: string;
  animated?: boolean;
  className?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  size = "md",
  showValue = false,
  variant = "default",
  label,
  animated = true,
  className,
}: AnimatedProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4 rounded-md",
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
  };

  return (
    <div className="w-full space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          {label && <span className="font-medium">{label}</span>}
          {showValue && (
            <span className="text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          sizeClasses[size],
          className
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", variantClasses[variant])}
          style={{ width: `${percentage}%` }}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 10,
          }}
        >
          {size === "lg" && showValue && (
            <span className="flex h-full items-center justify-center text-xs font-semibold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
