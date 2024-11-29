"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white transition-colors duration-300 bg-[#0F1729]/90">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-700 z-50"
        style={{ scaleX }}
      />
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
