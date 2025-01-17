import React from "react";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

const GradientBackground = ({
  className,
  children,
}: GradientBackgroundProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-[#0A0A0B]">
        {/* Top-right gradient */}
        <div
          className="absolute -top-[300px] -right-[300px] w-[1200px] h-[1200px] rounded-full opacity-75"
          style={{
            background: `radial-gradient(circle at center, 
              rgba(24, 226, 153, 0.2) 0%,
              rgba(24, 226, 153, 0.1) 20%,
              rgba(24, 226, 153, 0.05) 30%,
              rgba(24, 226, 153, 0) 70%
            )`,
            filter: "blur(120px)",
          }}
        />

        {/* Bottom-left gradient */}
        <div
          className="absolute -bottom-[200px] -left-[200px] w-[1000px] h-[1000px] rounded-full opacity-75"
          style={{
            background: `radial-gradient(circle at center, 
              rgba(24, 226, 153, 0.15) 0%,
              rgba(24, 226, 153, 0.08) 25%,
              rgba(24, 226, 153, 0.02) 50%,
              rgba(24, 226, 153, 0) 70%
            )`,
            filter: "blur(140px)",
          }}
        />

        {/* Center ambient light */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, 
              rgba(24, 226, 153, 0.03) 0%,
              rgba(24, 226, 153, 0.02) 25%,
              rgba(24, 226, 153, 0.01) 50%,
              rgba(24, 226, 153, 0) 75%
            )`,
            filter: "blur(120px)",
          }}
        />
      </div>
      {children}
    </div>
  );
};

export default GradientBackground;
