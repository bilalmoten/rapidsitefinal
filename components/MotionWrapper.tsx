"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function MotionWrapper({ children }: PropsWithChildren) {
  return <motion.div>{children}</motion.div>;
}
