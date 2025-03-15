"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, Layers } from "lucide-react";

interface SiteStructureVisualizerProps {
  structure: Array<{
    name: string;
    sections: Array<{
      sectionName: string;
      contentType: string;
    }>;
  }>;
  progress: number;
}

export default function SiteStructureVisualizer({
  structure,
  progress,
}: SiteStructureVisualizerProps) {
  // Calculate how many sections to show based on progress
  const totalSections = structure.reduce(
    (acc, page) => acc + page.sections.length,
    0
  );
  const visibleSections = Math.ceil((progress / 100) * totalSections);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Color mapping for different section types
  const sectionColors: Record<string, string> = {
    hero: "bg-blue-500/20 border-blue-500/50",
    features: "bg-green-500/20 border-green-500/50",
    pricing: "bg-purple-500/20 border-purple-500/50",
    testimonials: "bg-yellow-500/20 border-yellow-500/50",
    footer: "bg-gray-500/20 border-gray-500/50",
    contact: "bg-pink-500/20 border-pink-500/50",
    about: "bg-cyan-500/20 border-cyan-500/50",
    navbar: "bg-indigo-500/20 border-indigo-500/50",
    content: "bg-red-500/20 border-red-500/50",
  };

  // Helper function to get section color
  const getSectionColor = (contentType: string) => {
    return (
      sectionColors[contentType.toLowerCase()] ||
      "bg-gray-700/20 border-gray-700/50"
    );
  };

  // Count sections rendered so far
  let sectionCount = 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LayoutTemplate className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Building your site structure
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Creating the optimal layout and information architecture for your
          website
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Website frame */}
        <motion.div
          className="border border-gray-700 rounded-md p-4 mb-6 bg-gray-900"
          variants={itemVariants}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-2 border-b border-gray-700 pb-3 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 bg-gray-800 rounded-md py-1 px-2 text-xs text-gray-400 text-center">
              yourwebsite.com
            </div>
          </div>

          {/* Pages */}
          <div className="space-y-5">
            {structure.map((page, pageIndex) => (
              <motion.div
                key={pageIndex}
                variants={itemVariants}
                className="space-y-2"
              >
                <h3 className="text-sm font-medium text-gray-300">
                  {page.name} Page
                </h3>

                {/* Sections */}
                <div className="space-y-2">
                  {page.sections.map((section, sectionIndex) => {
                    sectionCount++;
                    const isVisible = sectionCount <= visibleSections;

                    return (
                      <motion.div
                        key={sectionIndex}
                        variants={itemVariants}
                        initial={isVisible ? undefined : "hidden"}
                        animate={isVisible ? "visible" : "hidden"}
                        className={`border rounded-sm p-2 text-xs ${
                          isVisible
                            ? getSectionColor(section.contentType)
                            : "bg-gray-800/30 border-gray-800"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{section.sectionName}</span>
                          {isVisible && (
                            <span className="text-[10px] opacity-70">
                              {section.contentType}
                            </span>
                          )}
                        </div>

                        {/* Placeholder for section content */}
                        <div className={`mt-1 ${isVisible ? "" : "invisible"}`}>
                          <div
                            className={`
                            h-${section.contentType === "hero" ? "6" : section.contentType === "features" ? "10" : "4"} 
                            w-full rounded-sm 
                            ${isVisible ? "bg-gray-700/40" : "bg-transparent"}
                            flex items-center justify-center
                          `}
                          >
                            {isVisible &&
                              section.contentType === "features" && (
                                <div className="grid grid-cols-2 gap-1 w-full p-1">
                                  <div className="bg-gray-600/30 h-3 rounded-sm"></div>
                                  <div className="bg-gray-600/30 h-3 rounded-sm"></div>
                                  <div className="bg-gray-600/30 h-3 rounded-sm"></div>
                                  <div className="bg-gray-600/30 h-3 rounded-sm"></div>
                                </div>
                              )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="mb-4 flex flex-wrap gap-2 justify-center"
          variants={itemVariants}
        >
          {Object.entries(sectionColors)
            .slice(0, 6)
            .map(([type, color], index) => (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <div
                  className={`w-3 h-3 rounded-sm ${color.split(" ")[0]}`}
                ></div>
                <span className="text-gray-400 capitalize">{type}</span>
              </div>
            ))}
        </motion.div>

        {/* Metrics */}
        <motion.div
          className="flex justify-center gap-6 text-sm text-gray-400"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Pages: {structure.length}</span>
          </div>
          <div>
            <span>
              Sections: {visibleSections}/{totalSections}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
