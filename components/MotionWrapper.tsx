"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

interface MotionWrapperProps extends PropsWithChildren {
  className?: string;
}

export default function MotionWrapper({
  children,
  className,
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
