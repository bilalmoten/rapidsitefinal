"use client";

import { motion } from "framer-motion";
import { Layout, Type, MousePointerClick } from "lucide-react";

interface HeroVisualizerProps {
  hero: any; // Section containing hero content
  progress: number;
}

export default function HeroVisualizer({
  hero,
  progress,
}: HeroVisualizerProps) {
  // Default hero content if none provided
  const defaultHeroContent = {
    headline: "Revolutionize Your Workflow with Our SaaS Product",
    subheadline:
      "Experience seamless solutions designed for modern businesses.",
    callToAction: {
      text: "Start Your Free Trial",
      link: "#signup",
    },
    callToAction2: {
      text: "Request a Demo",
      link: "#demo",
    },
  };

  // Use either provided hero content or default
  const heroContent = hero?.content || defaultHeroContent;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Elements to show based on progress
  const showHeadline = progress >= 20;
  const showSubheadline = progress >= 40;
  const showButtons = progress >= 60;
  const showGradient = progress >= 80;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Type className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Crafting your hero section
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Creating an impactful first impression with a compelling hero section
          that drives conversions.
        </p>
      </motion.div>

      <motion.div
        className="relative overflow-hidden rounded-md bg-gray-900 border border-gray-700 p-8"
        initial={{ height: 150 }}
        animate={{ height: 320 }}
        transition={{ duration: 1.5 }}
      >
        {/* Background gradient animation */}
        {showGradient && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            style={{
              background:
                "radial-gradient(circle at top right, rgba(79, 70, 229, 0.4) 0%, rgba(124, 58, 237, 0.4) 50%, transparent 70%)",
            }}
          />
        )}

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo placeholder */}
          <motion.div
            className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center mb-6"
            variants={itemVariants}
          >
            <span className="font-bold text-xl text-white">S</span>
          </motion.div>

          {/* Headline */}
          {showHeadline && (
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white text-center mb-4 w-3/4"
              variants={itemVariants}
            >
              {heroContent.headline}
            </motion.h1>
          )}

          {/* Subheadline */}
          {showSubheadline && (
            <motion.p
              className="text-lg text-gray-300 text-center mb-8 w-3/4"
              variants={itemVariants}
            >
              {heroContent.subheadline}
            </motion.p>
          )}

          {/* Call to action buttons */}
          {showButtons && (
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              variants={itemVariants}
            >
              <motion.button
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {heroContent.callToAction.text}
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-transparent border border-gray-500 text-white rounded-md font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {heroContent.callToAction2?.text || "Learn More"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Interactive elements indicator */}
      <motion.div
        className="mt-6 flex items-center justify-center text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <MousePointerClick className="w-4 h-4 mr-2 text-blue-400" />
        <span>Interactive elements added for user engagement</span>
      </motion.div>

      {/* Design components indicator */}
      <motion.div
        className="mt-4 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: showGradient ? 1 : 0 }}
      >
        {[
          "Gradient Background",
          "Bold Typography",
          "Call-to-Action Buttons",
          "Contrasting Colors",
        ].map((item, index) => (
          <motion.div
            key={item}
            className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-xs text-gray-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.2 }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
