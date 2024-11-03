"use client";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function MotionWrapper({
  children,
  className,
}: MotionWrapperProps) {
  return <MotionDiv className={className}>{children}</MotionDiv>;
}
