"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Longer, more detailed prompts to encourage quality input
const prompts = [
  "I need a portfolio website for my luxury interior design firm with project galleries, testimonials, and a contact form with appointment scheduling...",
  "Create a sleek e-commerce site for my boutique watch brand with product customization, detailed specifications, and a loyalty program for collectors...",
  "Design a modern SaaS dashboard for my AI-driven financial analytics platform with interactive data visualization and personalized insights...",
  "Build an elegant restaurant website with online reservations, seasonal menu showcase, chef profiles, and an immersive virtual tour of our dining spaces...",
  "Develop a professional coaching practice website with service tiers, client success stories, integrated booking system, and a resources library...",
];

export default function AnimatedPrompts() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const charIndex = useRef(0);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset when changing prompts
    charIndex.current = 0;
    setDisplayText("");
    setIsTyping(true);

    if (pauseTimeout.current) {
      clearTimeout(pauseTimeout.current);
    }

    // Type out the current prompt
    const typeInterval = setInterval(() => {
      if (isTyping) {
        if (charIndex.current < prompts[currentPrompt].length) {
          setDisplayText(
            prompts[currentPrompt].slice(0, charIndex.current + 1)
          );
          charIndex.current += 1;
        } else {
          setIsTyping(false);
          pauseTimeout.current = setTimeout(() => {
            setIsTyping(true);
            charIndex.current = prompts[currentPrompt].length;
            // Start erasing
            const eraseInterval = setInterval(() => {
              if (charIndex.current > 0) {
                charIndex.current -= 1;
                setDisplayText(
                  prompts[currentPrompt].slice(0, charIndex.current)
                );
              } else {
                clearInterval(eraseInterval);
                setCurrentPrompt((prev) => (prev + 1) % prompts.length);
              }
            }, 20); // Faster erasing for better flow
            return () => clearInterval(eraseInterval);
          }, 2500); // Longer pause at the end of typing for readability
        }
      }
    }, 45); // Slightly faster typing speed for professionalism

    return () => {
      clearInterval(typeInterval);
      if (pauseTimeout.current) {
        clearTimeout(pauseTimeout.current);
      }
    };
  }, [currentPrompt, isTyping]);

  return (
    <div className="h-full w-full relative">
      <div className="text-gray-400 whitespace-pre-wrap">
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1 h-5 ml-0.5 bg-cyan-500"
        />
      </div>
    </div>
  );
}
