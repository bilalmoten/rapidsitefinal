"use client";

import { motion } from "framer-motion";
import { Palette } from "lucide-react";

interface ColorPaletteVisualizerProps {
  colorScheme: {
    primaryColors: string[];
    accentColors: string[];
  };
  progress: number;
}

export default function ColorPaletteVisualizer({
  colorScheme,
  progress,
}: ColorPaletteVisualizerProps) {
  // Extract colors from descriptions
  const extractColors = (description: string) => {
    // For the demo, we'll manually extract blue and purple from the sample
    if (description.includes("Blue and purple")) {
      return ["#4F46E5", "#7C3AED", "#8B5CF6", "#3B82F6"];
    }

    // Default colors if we can't extract
    return ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];
  };

  const primaryColors = extractColors(colorScheme.primaryColors.join(", "));
  const accentColors = colorScheme.accentColors.includes("White")
    ? ["#FFFFFF", "#F9FAFB", "#F3F4F6"]
    : ["#F97316", "#FBBF24", "#34D399"];

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const gradientVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1 },
    },
  };

  // Only show elements based on the progress
  const shouldShowPrimary = progress > 20;
  const shouldShowAccent = progress > 50;
  const shouldShowGradient = progress > 70;

  return (
    <div className="w-full">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Palette className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Crafting your color palette
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Designing with beautiful blue and purple gradients that will give your
          SaaS website a modern and professional look.
        </p>
      </motion.div>

      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Primary Color Palette */}
        {shouldShowPrimary && (
          <motion.div className="space-y-2" variants={itemVariants}>
            <h3 className="text-sm font-medium text-gray-300">
              Primary Colors
            </h3>
            <div className="flex space-x-3 justify-center">
              {primaryColors.map((color, index) => (
                <motion.div
                  key={`primary-${index}`}
                  className="w-16 h-16 rounded-md shadow-lg flex items-end justify-center p-2"
                  style={{ backgroundColor: color }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <span className="text-xs font-mono bg-black/30 px-1 rounded text-white">
                    {color}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Accent Color Palette */}
        {shouldShowAccent && (
          <motion.div className="space-y-2" variants={itemVariants}>
            <h3 className="text-sm font-medium text-gray-300">Accent Colors</h3>
            <div className="flex space-x-3 justify-center">
              {accentColors.map((color, index) => (
                <motion.div
                  key={`accent-${index}`}
                  className="w-16 h-16 rounded-md shadow-lg flex items-end justify-center p-2"
                  style={{ backgroundColor: color }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <span className="text-xs font-mono bg-black/30 px-1 rounded text-black">
                    {color}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gradient Preview */}
        {shouldShowGradient && (
          <motion.div className="space-y-2" variants={itemVariants}>
            <h3 className="text-sm font-medium text-gray-300">
              Gradient Examples
            </h3>
            <div className="flex space-x-4 justify-center">
              <motion.div
                className="w-40 h-16 rounded-md"
                style={{
                  background: `linear-gradient(to right, ${primaryColors[0]}, ${primaryColors[2]})`,
                }}
                variants={gradientVariants}
              />
              <motion.div
                className="w-40 h-16 rounded-md"
                style={{
                  background: `linear-gradient(135deg, ${primaryColors[1]}, ${primaryColors[3]})`,
                }}
                variants={gradientVariants}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
