import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

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
        <motion.p
          className="text-xl mb-8 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Create stunning, personalized websites in minutes with our AI-powered
          platform. No coding required.
        </motion.p>
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full"
            onClick={() => router.push("/login")}
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 px-8 py-3 rounded-full"
          >
            Watch Demo
          </Button>
        </motion.div>
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
