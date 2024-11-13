"use client";

import { motion } from "framer-motion";

interface AnimatedLoginContentProps {
  message?: string;
}

export default function AnimatedLoginContent({}: // message,
AnimatedLoginContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4 z-10"
    >
      <h1 className="text-4xl font-bold">Welcome Back!</h1>
      <p className="text-xl">Sign in to continue your journey</p>
      {/* {message && (
        <p className="text-yellow-200 bg-red-500/20 p-2 rounded">{message}</p>
      )} */}
    </motion.div>
  );
}
