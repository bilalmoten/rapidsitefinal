"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface AnimatedLoginContentProps {
  searchParams: { message?: string };
}

export default function AnimatedLoginContent({
  searchParams,
}: AnimatedLoginContentProps) {
  const message = searchParams?.message;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-xl mb-8">We're excited to see you again.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-64 h-64 relative"
      >
        <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 bg-white opacity-20 rounded-full animate-pulse animation-delay-500"></div>
        <div className="absolute inset-8 bg-white opacity-20 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-24 h-24" />
        </div>
      </motion.div>
    </>
  );
}
