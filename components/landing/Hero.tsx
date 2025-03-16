"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import AnimatedPrompts from "@/components/ui/animated-prompts";
import { Caveat } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Sparkles, Rocket } from "lucide-react";

const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
});

export default function Hero() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleBuildNow = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be updated later to handle anonymous auth and Express Mode generation
    router.push("/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-blue-500/5"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full bg-violet-500/5"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/3 right-[15%] w-40 h-40 rounded-full bg-cyan-500/5"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#0F1729]/20 to-[#0F1729]/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="container max-w-7xl mx-auto px-4 relative">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-violet-500/30"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">
              The Most Advanced AI Website Builder
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-700"
          >
            Your website, created as easily as chatting with a friend
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            No code. No templates. Just describe what you want in plain English.
          </motion.p>

          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <form onSubmit={handleBuildNow} className="space-y-6">
              <div className="text-left">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-base text-gray-300 block ml-4">
                    Describe your dream website in detail
                  </label>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-sm px-3 py-1 rounded-full"
                  >
                    <span className="flex items-center gap-1">
                      <Rocket className="w-3 h-3" />
                      Express Mode
                    </span>
                  </Badge>
                </div>

                <div className="relative flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="bg-white/5 border border-cyan-500/20 focus-within:ring-cyan-500/50 focus-within:border-cyan-500 focus-within:ring-2 rounded-xl transition-all duration-200 h-[140px] relative overflow-hidden shadow-inner">
                      {!inputValue && (
                        <div className="absolute inset-0 pointer-events-none p-4">
                          <AnimatedPrompts />
                        </div>
                      )}
                      <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder=""
                        className="h-full w-full bg-transparent border-none rounded-xl text-gray-200 p-4 text-base resize-none focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="lg:self-start mt-0 lg:mt-0 lg:w-auto w-full">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-500 to-violet-700 hover:from-cyan-600 hover:to-violet-800 text-white rounded-full px-8 py-7 w-full shadow-lg hover:shadow-cyan-500/20 transition-all text-lg font-medium"
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Generate Website
                    </Button>
                    <motion.div className="mt-2 text-center lg:text-left">
                      <span
                        className={`${caveat.className} text-lg text-cyan-400`}
                      >
                        See results in under 2 minutes, no signup needed
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </form>

            {/* Enhanced scroll link */}
            <motion.div variants={itemVariants} className="mt-16 text-center">
              <motion.div
                className="inline-block relative"
                whileHover={{ scale: 1.05 }}
              >
                <a
                  href="#comparison"
                  className="flex flex-col items-center justify-center gap-2 p-4 hover:text-cyan-400 transition-colors"
                >
                  <span className="text-lg font-medium">
                    Discover our full-featured{" "}
                    <span className="text-violet-400 font-semibold">
                      Pro Experience
                    </span>
                  </span>
                  <span className="text-base text-gray-400">
                    Advanced customization, bespoke designs, and expert AI
                    guidance
                  </span>
                  <motion.div
                    className="mt-3 relative"
                    animate={{
                      y: [0, 6, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      className="absolute -inset-1 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0, 0.4, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                    />
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-cyan-500"
                    >
                      <path
                        d="M12 5V19M12 19L5 12M12 19L19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
