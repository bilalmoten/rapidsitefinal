import React, { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  variant?: "default" | "gradient" | "outline";
  hoverEffect?: "lift" | "glow" | "border" | "none";
  className?: string;
}

export function AnimatedCard({
  children,
  variant = "default",
  hoverEffect = "lift",
  className,
  ...props
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses = {
    default: "bg-card border shadow-sm",
    gradient:
      "bg-gradient-to-br from-background via-card to-background border shadow-sm",
    outline: "border-2 border-primary/20 bg-background",
  };

  // Get the appropriate glow color based on the variant
  const getGlowColor = () => {
    switch (variant) {
      case "gradient":
        return "rgba(124, 58, 237, 0.3)"; // Purple glow
      case "outline":
        return "rgba(59, 130, 246, 0.3)"; // Blue glow
      default:
        return "rgba(255, 255, 255, 0.1)"; // Subtle white glow
    }
  };

  const getHoverStyles = () => {
    if (!isHovered) return {};

    switch (hoverEffect) {
      case "glow":
        return {
          boxShadow: `0 0 20px 2px ${getGlowColor()}`,
        };
      case "border":
        return {
          boxShadow: "none",
        };
      case "lift":
      default:
        return {
          transform: "translateY(-8px)",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        };
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-xl transition-all duration-300",
        variantClasses[variant],
        hoverEffect === "border" && isHovered && "border-primary",
        className
      )}
      style={getHoverStyles()}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
