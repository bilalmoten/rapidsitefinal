"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
}

export default function Layout({
  children,
  darkMode,
  toggleDarkMode,
  user,
}: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode ? "dark bg-gray-950 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 to-indigo-950"
              : "bg-gradient-to-br from-indigo-50 to-purple-50"
          }`}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={
                  darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
                }
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* <FluidGradient darkMode={darkMode} /> */}
      </div>
      <div className="relative z-10">
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? (darkMode ? "bg-gray-900/80" : "bg-white/80") +
                " backdrop-blur-md shadow-md"
              : ""
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.h1
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI Website Builder
            </motion.h1>
            <nav className="flex items-center space-x-6">
              <Link
                href="#features"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                Blog
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Login
                  </Button>
                </Link>
              )}
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </nav>
          </div>
        </header>

        {children}

        <Footer />
      </div>
    </div>
  );
}
