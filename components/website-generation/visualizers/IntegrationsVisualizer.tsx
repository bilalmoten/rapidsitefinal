"use client";

import { motion } from "framer-motion";
import {
  Link2,
  Github,
  Slack,
  Database,
  CloudUpload,
  FileText,
  Layout,
} from "lucide-react";

interface IntegrationsVisualizerProps {
  integrations: Array<{
    name: string;
    icon?: string;
  }>;
  progress: number;
}

export default function IntegrationsVisualizer({
  integrations,
  progress,
}: IntegrationsVisualizerProps) {
  // Default integrations if none provided
  const defaultIntegrations = [
    { name: "Slack", icon: "slack" },
    { name: "GitHub", icon: "github" },
    { name: "Dropbox", icon: "cloud" },
    { name: "Google Drive", icon: "drive" },
    { name: "Notion", icon: "file-text" },
    { name: "Trello", icon: "layout" },
  ];

  // Logo mapping
  const logoComponents: Record<string, React.ReactNode> = {
    slack: <Slack className="w-full h-full" />,
    github: <Github className="w-full h-full" />,
    cloud: <CloudUpload className="w-full h-full" />,
    drive: <Database className="w-full h-full" />,
    "file-text": <FileText className="w-full h-full" />,
    layout: <Layout className="w-full h-full" />,
  };

  // Use provided integrations or default
  const displayIntegrations =
    integrations.length > 0 ? integrations : defaultIntegrations;

  // Calculate how many integrations to show based on progress
  const visibleIntegrations = Math.ceil(
    (progress / 100) * displayIntegrations.length
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  // Function to render connections between integrations
  const ConnectionLines = () => {
    // Only show connections if we have 2+ visible integrations
    if (visibleIntegrations < 2) return null;

    return (
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: visibleIntegrations }).map((_, i) => {
          if (i === 0) return null; // Skip first one

          return (
            <motion.line
              key={`line-${i}`}
              x1="50%"
              y1="50%"
              x2={`${50 + 45 * Math.cos((2 * Math.PI * i) / displayIntegrations.length)}%`}
              y2={`${50 + 45 * Math.sin((2 * Math.PI * i) / displayIntegrations.length)}%`}
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Setting up your integrations
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Connecting your SaaS platform with the tools your users already love
        </p>
      </motion.div>

      <motion.div
        className="relative h-[300px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ConnectionLines />

        {/* Central hub representing the SaaS platform */}
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10
            w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/50 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-blue-400 font-semibold">Your SaaS</div>
            <div className="text-xs text-blue-300 mt-1">Integration Hub</div>
          </div>
        </motion.div>

        {/* Integration icons arranged in a circle */}
        {displayIntegrations.map((integration, index) => {
          const isVisible = index < visibleIntegrations;
          const angle = (2 * Math.PI * index) / displayIntegrations.length;
          const x = 50 + 45 * Math.cos(angle);
          const y = 50 + 45 * Math.sin(angle);

          return (
            <motion.div
              key={integration.name}
              className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 ${
                isVisible ? "" : "opacity-20"
              }`}
              variants={itemVariants}
              initial={isVisible ? undefined : "hidden"}
              animate={isVisible ? "visible" : "hidden"}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <div
                className={`
                w-14 h-14 rounded-full flex items-center justify-center
                ${isVisible ? "bg-blue-500/20 border-2 border-blue-500/50" : "bg-gray-700/30 border-gray-700"}
              `}
              >
                <div
                  className={`w-8 h-8 ${isVisible ? "text-blue-400" : "text-gray-600"}`}
                >
                  {(integration.icon &&
                    logoComponents[integration.icon.toLowerCase()]) || (
                    <div className="text-xl font-bold">
                      {integration.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              {isVisible && (
                <motion.div
                  className="mt-2 text-center text-sm text-gray-300 bg-gray-800/70 px-2 py-1 rounded whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {integration.name}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="text-center mt-4 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          Integrations Set Up: {visibleIntegrations} of{" "}
          {displayIntegrations.length}
        </p>
      </motion.div>
    </div>
  );
}
