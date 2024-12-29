"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import AnimatedPrompts from "@/components/ui/animated-prompts";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
});

export default function Hero() {
  const router = useRouter();

  const handleBuildNow = (e: React.FormEvent) => {
    e.preventDefault();
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
    <section className="relative py-20 md:py-32 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#0F1729]/20 to-[#0F1729]/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-700"
          >
            Create Your Perfect Website with AI
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 dark:text-gray-300 mb-12"
          >
            Get a custom made, fully functional, multi-page website, Edit with
            powerful AI or refine yourself—no code needed.
          </motion.p>

          <motion.div variants={itemVariants} className="max-w-xl mx-auto">
            <form onSubmit={handleBuildNow} className="space-y-4">
              <div className="text-left space-y-1">
                <label className="text-sm text-gray-400 block ml-4">
                  Tell us about your dream website
                </label>
                <div className="relative flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Input className="w-full bg-white/5 border-cyan-500/20 focus:border-cyan-500 text-gray-200 rounded-full pl-4 pr-4 py-6" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <AnimatedPrompts />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-violet-700 hover:from-cyan-600 hover:to-violet-800 text-white rounded-full px-8 py-6 sm:w-auto w-full"
                  >
                    Build Now
                  </Button>
                </div>
              </div>
            </form>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center mt-2"
            >
              <span className={`${caveat.className} text-lg text-cyan-400`}>
                No credit card required
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
