"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBarChart2, FiGlobe, FiEye } from "react-icons/fi";

interface StatsProps {
  projectCount: number;
}

const Stats: React.FC<StatsProps> = ({ projectCount }) => {
  const [isHovered, setIsHovered] = useState(false);

  const stats = [
    {
      title: "Total Projects",
      value: projectCount.toString(),
      icon: FiBarChart2,
    },
    { title: "Published Sites", value: "8", icon: FiGlobe },
    { title: "Total Views", value: "3,721", icon: FiEye },
  ];

  return (
    <section className="mt-8 relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Your Stats
      </h2>
      <motion.div
        className="relative overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {!isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/70 to-white/90 dark:from-gray-800/70 dark:to-gray-800/90 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-gray-900/80 px-6 py-3 rounded-full shadow-md">
                Advanced Analytics Coming Soon
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Stats;
