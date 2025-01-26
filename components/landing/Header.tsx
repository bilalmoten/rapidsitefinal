"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Menu } from "lucide-react";
import Link from "next/link";
import ShinyButton from "@/components/ui/shiny-button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#showcase", label: "Showcase" },
    // { href: "#gallery", label: "Gallery" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ];

  // const handleGetStarted = () => {
  //   router.push("/dashboard");
  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div className="container mx-auto px-4 relative">
        <nav className="flex items-center justify-between h-16 max-w-5xl mx-auto">
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
              RapidSite AI Website Builder
            </motion.span>
          </Link>

          <div className="hidden md:flex justify-center mx-4">
            <div className="bg-muted/50 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4">
              {menuItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          {/* <div className="hidden md:block shrink-0">
            <ShinyButton onClick={handleGetStarted}>Get Started</ShinyButton> */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <ShinyButton onClick={handleLogin} className="bg-background">
              Login
            </ShinyButton>
            <ShinyButton onClick={handleSignup}>Sign Up</ShinyButton>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg bg-muted/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </motion.button>
        </nav>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-md z-30 p-4 border-b border-border md:hidden"
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
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {/* <div className="flex items-center justify-between pt-4 border-t border-border">
                <ShinyButton onClick={handleGetStarted}>
                  Get Started */}
              <div className="flex items-center justify-between pt-4 border-t border-border gap-4">
                <ShinyButton onClick={handleLogin} className="bg-background">
                  Login
                </ShinyButton>
                <ShinyButton onClick={handleSignup}>Sign Up</ShinyButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
