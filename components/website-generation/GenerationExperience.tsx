"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Sparkles } from "lucide-react";
import { SaaSWebsiteData } from "@/types/website-generation";
import ColorPaletteVisualizer from "./visualizers/ColorPaletteVisualizer";
import SiteStructureVisualizer from "./visualizers/SiteStructureVisualizer";
import FeatureVisualizer from "./visualizers/FeatureVisualizer";
import TestimonialVisualizer from "./visualizers/TestimonialVisualizer";
import IntegrationsVisualizer from "./visualizers/IntegrationsVisualizer";
import HeroVisualizer from "./visualizers/HeroVisualizer";

interface GenerationExperienceProps {
  websiteData: SaaSWebsiteData;
}

export function GenerationExperience({
  websiteData,
}: GenerationExperienceProps) {
  // Define the stages of the experience
  const stages = [
    "intro",
    "color-palette",
    "site-structure",
    "features",
    "testimonials",
    "integrations",
    "hero",
    "finalizing",
  ];

  // State for current stage and progress
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  // Auto-advance through stages
  useEffect(() => {
    const stageTime = 25000; // 25 seconds per stage
    const interval = 100; // Update progress every 100ms

    // Progress within current stage
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / (stageTime / interval);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, interval);

    // Move to next stage when progress reaches 100%
    const stageInterval = setTimeout(() => {
      if (currentStageIndex < stages.length - 1) {
        setCurrentStageIndex((prevIndex) => prevIndex + 1);
        setProgress(0);
      }
    }, stageTime);

    // Calculate overall progress
    const overallInterval = setInterval(() => {
      const stageContribution = 1 / stages.length;
      const currentStageProgress =
        currentStageIndex * stageContribution +
        stageContribution * (progress / 100);
      setOverallProgress(currentStageProgress * 100);
    }, interval);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageInterval);
      clearInterval(overallInterval);
    };
  }, [currentStageIndex, stages.length]);

  // Determine current stage
  const currentStage = stages[currentStageIndex];

  // Render appropriate visualizer based on stage
  const renderVisualizer = () => {
    switch (currentStage) {
      case "intro":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Code className="w-20 h-20 text-blue-500" />
                <motion.div
                  className="absolute -top-2 -right-2 text-yellow-400"
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Building Your {websiteData.websiteName || "Website"}
            </h2>
            <p className="text-lg text-gray-300 max-w-lg mx-auto mb-8">
              We're crafting your custom website with all the features you
              specified. This will take just a few moments...
            </p>
            <motion.div
              className="flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, staggerChildren: 0.2 }}
            >
              {[
                "Analyzing Requirements",
                "Planning Structure",
                "Designing Interface",
                "Creating Content",
                "Testing Features",
              ].map((step, i) => (
                <motion.div
                  key={step}
                  className={`px-3 py-1 rounded-full text-sm ${
                    i <= Math.floor(progress / 20)
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                >
                  {step}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case "color-palette":
        return (
          <ColorPaletteVisualizer
            colorScheme={
              websiteData.designPreferences?.colorScheme || {
                primaryColors: ["#3B82F6", "#10B981", "#6366F1"],
                accentColors: ["#F9FAFB", "#F3F4F6", "#E5E7EB"],
              }
            }
            progress={progress}
          />
        );

      case "site-structure":
        return (
          <SiteStructureVisualizer
            structure={websiteData.websiteStructure?.pages || []}
            progress={progress}
          />
        );

      case "features":
        return (
          <FeatureVisualizer
            features={websiteData.contentRequirements?.features || []}
            progress={progress}
          />
        );

      case "testimonials":
        return (
          <TestimonialVisualizer
            testimonials={websiteData.contentRequirements?.testimonials || []}
            progress={progress}
          />
        );

      case "integrations":
        return (
          <IntegrationsVisualizer
            integrations={websiteData.contentRequirements?.integrations || []}
            progress={progress}
          />
        );

      case "hero":
        return (
          <HeroVisualizer
            hero={websiteData.websiteStructure?.pages?.[0]?.sections?.find(
              (s: { contentType: string }) => s.contentType === "hero"
            )}
            progress={progress}
          />
        );

      case "finalizing":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Sparkles className="w-20 h-20 text-yellow-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Finalizing Your {websiteData.websiteName || "Website"}
            </h2>
            <p className="text-lg text-gray-300 max-w-lg mx-auto mb-8">
              We're putting the finishing touches on your website. Almost ready
              for you to explore and customize!
            </p>
            <motion.div className="w-full max-w-md mx-auto h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            <p className="mt-2 text-sm text-gray-400">
              {Math.round(progress)}% complete
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Starting</span>
          <span>Designing</span>
          <span>Building</span>
          <span>Finalizing</span>
        </div>
      </div>

      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {renderVisualizer()}
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
          Current Stage
        </h3>
        <p className="text-lg font-semibold text-white capitalize">
          {currentStage.replace("-", " ")}
        </p>
      </div>
    </div>
  );
}
