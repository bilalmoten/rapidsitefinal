"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Workflow,
  Clock,
  CheckSquare,
  Share2,
  Layers,
  Laptop,
  Share,
} from "lucide-react";

interface FeatureVisualizerProps {
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  progress: number;
}

export default function FeatureVisualizer({
  features,
  progress,
}: FeatureVisualizerProps) {
  // Default features if none provided
  const defaultFeatures = [
    {
      title: "Easy Integration",
      description: "Seamlessly connect with your existing tools",
      icon: "share2",
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade security for your peace of mind",
      icon: "shield",
    },
    {
      title: "Lightning Fast",
      description: "Optimized performance for speed and reliability",
      icon: "zap",
    },
    {
      title: "Time-Saving",
      description: "Automate workflows and save valuable time",
      icon: "clock",
    },
  ];

  // Use provided features or default
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  // Calculate how many features to show based on progress
  const visibleFeatures = Math.ceil((progress / 100) * displayFeatures.length);

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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Function to get the icon component based on name
  const getIconComponent = (iconName: string = "") => {
    const icons: Record<string, React.ReactNode> = {
      zap: <Zap className="w-full h-full" />,
      shield: <Shield className="w-full h-full" />,
      workflow: <Workflow className="w-full h-full" />,
      clock: <Clock className="w-full h-full" />,
      check: <CheckSquare className="w-full h-full" />,
      share2: <Share2 className="w-full h-full" />,
      layers: <Layers className="w-full h-full" />,
      laptop: <Laptop className="w-full h-full" />,
      share: <Share className="w-full h-full" />,
    };

    return icons[iconName.toLowerCase()] || <Zap className="w-full h-full" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CheckSquare className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Creating your feature showcase
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Highlighting the key benefits and features that will resonate with
          your target audience
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {displayFeatures.map((feature, index) => {
          const isVisible = index < visibleFeatures;

          return (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              initial={isVisible ? undefined : "hidden"}
              animate={isVisible ? "visible" : "hidden"}
              className={`rounded-lg border p-6 ${
                isVisible
                  ? "border-blue-500/30 bg-blue-500/5"
                  : "border-gray-700 bg-gray-800/30"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full p-2.5 ${
                    isVisible
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-700/50 text-gray-500"
                  }`}
                >
                  {getIconComponent(feature.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-medium truncate ${isVisible ? "text-white" : "text-gray-500"}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${isVisible ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {feature.description}
                  </p>

                  {isVisible && (
                    <div className="mt-3 w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="text-center mt-8 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          Features Configured: {visibleFeatures} of {displayFeatures.length}
        </p>
      </motion.div>
    </div>
  );
}
