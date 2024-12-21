"use client";

import React from "react";
import { motion } from "framer-motion";

interface WelcomeSectionProps {
  user: any;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  return (
    <section className="mb-8">
      <motion.div
        className="bg-card text-card-foreground rounded-lg p-6 border shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user.email}!</h2>
        <p className="text-muted-foreground">
          Ready to create your next stunning website? Let's get started!
        </p>
      </motion.div>
    </section>
  );
};

export default WelcomeSection;
