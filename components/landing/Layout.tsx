"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
      <div className="dark min-h-screen bg-background text-foreground">
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-700 z-50"
          style={{ scaleX }}
        />
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
