"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Menu, Sun, Moon } from "lucide-react";
import Link from "next/link";
import ShinyButton from "@/components/ui/shiny-button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#showcase", label: "Showcase" },
    { href: "#gallery", label: "Gallery" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
  ];

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,41,0.3)_0%,rgba(15,23,41,0)_60%)] backdrop-blur-[1px]" />

      <div className="container mx-auto px-4 relative">
        <nav className="flex items-center justify-between h-16 max-w-5xl mx-auto">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Star className="h-8 w-8 text-cyan-500" />
            </motion.div>
            <motion.span
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-violet-700"
              whileHover={{ scale: 1.05 }}
            >
              AI Builder
            </motion.span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex justify-center mx-4">
            <div className="bg-[#0F1729]/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4">
              {menuItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="text-sm font-medium hover:text-cyan-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Desktop Get Started Button */}
          <div className="hidden md:block shrink-0">
            <ShinyButton onClick={handleGetStarted}>Get Started</ShinyButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg bg-[#0F1729]/10 dark:bg-gray-800/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </motion.button>
        </nav>
      </div>

      {/* Mobile Menu - Updated with Cyber theme */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-[#0F1729]/95 backdrop-blur-md z-30 p-4 border-b border-cyan-500/20 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="text-sm font-medium hover:text-cyan-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.button>
                <ShinyButton onClick={handleGetStarted}>
                  Get Started
                </ShinyButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
