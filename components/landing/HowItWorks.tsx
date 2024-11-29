"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Globe, ArrowRight } from "lucide-react";

const steps = [
  {
    id: "input",
    title: "Describe Your Vision",
    description: "Tell us what you want in plain English",
    icon: Bot,
  },
  {
    id: "generate",
    title: "AI Creates Your Site",
    description: "Watch your website come to life in real-time",
    icon: Sparkles,
  },
  {
    id: "edit",
    title: "Refine with AI",
    description: "Fine-tune every detail with AI assistance",
    icon: ArrowRight,
  },
  {
    id: "launch",
    title: "Launch Instantly",
    description: "Go live with one click on your custom domain",
    icon: Globe,
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), {
    stiffness: 100,
    damping: 30,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-32 min-h-screen relative bg-[#0F1729] overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-violet-700/10" />

      <motion.div
        style={{ opacity }}
        className="container mx-auto px-4 relative"
      >
        <motion.div style={{ scale }} className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-center mb-24"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-700">
              Four Simple Steps
            </span>
            <br />
            to Your Perfect Website
          </motion.h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-blue-600 to-violet-700" />

            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex items-center gap-8 mb-32 ${
                  index % 2 ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20"
                  >
                    <step.icon className="w-8 h-8 text-cyan-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-4 text-cyan-500">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                </div>

                <div className="w-px h-32 bg-gradient-to-b from-cyan-500 to-violet-700" />

                <motion.div className="flex-1 perspective-1000" style={{ y }}>
                  {step.id === "input" && (
                    <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/20">
                      <Input
                        className="mb-4 bg-transparent border-cyan-500/20"
                        placeholder="Describe your dream website..."
                      />
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-violet-700">
                        Generate Website
                      </Button>
                    </div>
                  )}

                  {step.id === "generate" && (
                    <div className="relative h-64 bg-black/20 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-700/20 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-cyan-500 animate-spin" />
                      </div>
                    </div>
                  )}

                  {step.id === "edit" && (
                    <div className="bg-black/20 backdrop-blur-xl p-4 rounded-2xl border border-cyan-500/20">
                      <div className="flex gap-4 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-cyan-500/20 rounded animate-pulse" />
                        <div className="h-4 bg-cyan-500/20 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-cyan-500/20 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  )}

                  {step.id === "launch" && (
                    <div className="relative h-64 bg-black/20 backdrop-blur-xl rounded-2xl border border-cyan-500/20 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-12 h-12 text-cyan-500" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-center text-cyan-500">
                          yourdomain.com
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
