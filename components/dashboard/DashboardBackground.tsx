import React from "react";

const DashboardBackground = () => {
  return (
    <div className="fixed inset-0 z-[1] overflow-hidden blur-[180px]">
      {/* Base background color */}
      <div className="absolute inset-0 bg-[#e2e2e2] dark:bg-primary-dark">
        {/* Top-left gradient */}
        <div
          className="absolute -top-[300px] -right-[300px] w-[1200px] h-[1200px] rounded-full opacity-99 "
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

        {/* Bottom-right gradient */}
        <div
          className="absolute -bottom-[200px] -left-[200px] w-[1000px] h-[1000px] rounded-full opacity-99 "
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

        {/* Center gradient for ambient light */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] rounded-full "
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
    </div>
  );
};

export default DashboardBackground;
