import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Build Your Dream Website with AI
        </motion.h2>
        {/* Rest of the hero section content */}
      </div>
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="AI Website Builder"
          width={600}
          height={400}
          className="rounded-lg shadow-2xl"
        />
      </motion.div>
    </section>
  );
}
