"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

// Particle animation component
const Particle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-purple-500/50"
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [1, 2, 0],
      opacity: [1, 0.5, 0],
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

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

  const handleGetStarted = () => {
    redirect("/dashboard");
  };

  const handleWatchDemo = () => {
    // Scroll to Showcase section
    const showcaseSection = document.getElementById("showcase");
    showcaseSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/10" />
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} delay={i * 0.1} />
        ))}
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto px-4 relative"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Stop Compromising.
            <br />
            Start Building Your Vision.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl mb-12 text-white/90"
          >
            Join thousands of creators building websites that truly stand out.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGetStarted}
                className="bg-white text-purple-500 hover:bg-gray-100 text-lg px-8 py-6 rounded-full w-full sm:w-auto"
              >
                <span>Get Started Free</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleWatchDemo}
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full w-full sm:w-auto"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-white/80 text-sm"
          >
            No credit card required • Free plan available • Cancel anytime
          </motion.p>

          {/* Floating elements */}
          <motion.div
            className="absolute -left-12 top-1/2 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-50 blur-xl"
            animate={{
              y: [0, 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -right-12 bottom-1/4 w-32 h-32 bg-gradient-to-br from-pink-400 to-red-400 rounded-full opacity-50 blur-xl"
            animate={{
              y: [0, -30, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
