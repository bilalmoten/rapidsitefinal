"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">About Us</h1>
          <p className="text-xl text-muted-foreground">
            Building the future of website creation with AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <div className="bg-card rounded-lg p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-6">
              RapidSite is a product of Nisa Technologies, founded by Muhammad
              Bilal Moten. We're on a mission to revolutionize website creation
              by making it accessible, intuitive, and powered by cutting-edge AI
              technology.
            </p>
            <p>
              Our platform empowers creators to build their digital dreams
              without the need for coding knowledge or technical expertise. We
              believe in democratizing web development and making it accessible
              to everyone.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
            <ul className="space-y-3">
              <li>
                <strong>Legal Entity:</strong> Nisa Technologies
              </li>
              <li>
                <strong>Founded by:</strong> Muhammad Bilal Moten
              </li>
              <li>
                <strong>Location:</strong> Karachi, Pakistan
              </li>
              <li>
                <strong>Our Focus:</strong> Empowering individuals and
                businesses with AI-powered website creation tools
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
