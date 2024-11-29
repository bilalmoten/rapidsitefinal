"use client";

import { motion } from "framer-motion";

const themePresets = [
  // Light Themes
  {
    name: "Current",
    gradient: "from-purple-500 via-pink-500 to-red-500",
    background: "bg-white dark:bg-gray-900",
    category: "light",
  },
  {
    name: "Sunset",
    gradient: "from-orange-600 via-rose-500 to-pink-600",
    background: "bg-orange-50 dark:bg-gray-900",
    category: "light",
  },

  // Dark Themes
  {
    name: "Deep Space",
    gradient: "from-indigo-900 via-purple-800 to-blue-600",
    background: "bg-[#0A0118]",
    category: "dark",
  },
  {
    name: "Cyber",
    gradient: "from-cyan-500 via-blue-600 to-violet-700",
    background: "bg-[#0F1729]",
    category: "dark",
  },

  // Deep Dark Themes
  {
    name: "Midnight",
    gradient: "from-indigo-800 to-purple-700",
    background: "bg-black",
    category: "deep",
  },
  {
    name: "Abyss",
    gradient: "from-blue-900 via-violet-900 to-purple-900",
    background: "bg-[#050508]",
    category: "deep",
  },
];

export default function ThemePreview() {
  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4">
      <div className="max-w-6xl mx-auto flex items-center gap-4 overflow-x-auto pb-4">
        {themePresets.map((theme) => (
          <motion.div
            key={theme.name}
            whileHover={{ scale: 1.05 }}
            className="shrink-0"
          >
            <div
              className={`w-40 rounded-lg overflow-hidden shadow-lg ${theme.background}`}
            >
              {/* Theme Preview Card */}
              <div className="h-24 relative">
                {/* Background Color */}
                <div className={`absolute inset-0 ${theme.background}`} />
                {/* Gradient Strip */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r ${theme.gradient}`}
                />
              </div>
              {/* Sample Text */}
              <div className="p-3">
                <div
                  className={`h-2 w-16 rounded-full bg-gradient-to-r ${theme.gradient} mb-2`}
                />
                <div
                  className={`h-2 w-12 rounded-full bg-gradient-to-r ${theme.gradient} opacity-60`}
                />
              </div>
            </div>
            <p className="text-xs text-center mt-2 font-medium">{theme.name}</p>
            <p className="text-xs text-center text-gray-500">
              {theme.category}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
