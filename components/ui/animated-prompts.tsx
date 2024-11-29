"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const prompts = [
  "A modern portfolio for a photographer...",
  "An e-commerce site for handmade jewelry...",
  "A sleek landing page for a SaaS product...",
  "A professional blog for tech tutorials...",
  "A booking website for a restaurant...",
];

export default function AnimatedPrompts() {
  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 relative w-full">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentPrompt}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute text-gray-400/50 dark:text-gray-500/50 whitespace-nowrap"
        >
          {prompts[currentPrompt]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
