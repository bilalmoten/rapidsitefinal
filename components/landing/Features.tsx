"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Globe,
  Sparkles,
  MessageSquare,
  PenTool,
  Bot,
  Settings,
  Star,
  Zap,
  ShoppingCart,
  Code,
  Upload,
  Cpu,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Chat",
    description: "Describe your website and let our AI do the rest",
    color: "cyan",
  },
  {
    icon: PenTool,
    title: "Easy Customization",
    description: "Edit any part of your website with simple instructions",
    color: "blue",
  },
  {
    icon: Code,
    title: "Code Export",
    description: "Download your website's code for further customization",
    color: "violet",
  },
  {
    icon: Upload,
    title: "One-Click Publish",
    description: "Publish your website to a free subdomain instantly",
    color: "cyan",
  },
  {
    icon: Globe,
    title: "Multi-Page Intelligence",
    description:
      "Create complex, interconnected websites that maintain consistency.",
    color: "blue",
  },
  {
    icon: Sparkles,
    title: "Smart Layout Engine",
    description:
      "AI automatically optimizes layouts for different devices and content types.",
    color: "violet",
  },
  {
    icon: PenTool,
    title: "AI Brand Designer",
    description:
      "Generate logos, color palettes, and typography that match your vision perfectly.",
    color: "cyan",
    comingSoon: true,
  },
  {
    icon: Bot,
    title: "Voice-Based AI Editing",
    description:
      "Edit your website using natural voice commands for a seamless experience.",
    color: "blue",
    comingSoon: true,
  },
  {
    icon: Settings,
    title: "AI Conversion Optimization",
    description:
      "Get real-time suggestions to improve engagement and conversion rates.",
    color: "violet",
    comingSoon: true,
  },
  {
    icon: Star,
    title: "AI-Powered SEO",
    description: "Automatically optimize your content for search engines.",
    color: "cyan",
    comingSoon: true,
  },
  {
    icon: Zap,
    title: "Instant Translation",
    description: "Create multilingual websites with a single click.",
    color: "blue",
    comingSoon: true,
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Integration",
    description: "Set up and manage your online store effortlessly.",
    color: "violet",
    comingSoon: true,
  },
];

const colorVariants = {
  cyan: "from-cyan-500/10 to-cyan-500/20 text-cyan-500",
  blue: "from-blue-600/10 to-blue-600/20 text-blue-600",
  violet: "from-violet-700/10 to-violet-700/20 text-violet-700",
};

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const FeatureCard = ({
    feature,
    index,
  }: {
    feature: (typeof features)[0];
    index: number;
  }) => {
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="relative group"
      >
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg relative backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="mb-4">
              <feature.icon
                className={`w-8 h-8 ${colorVariants[
                  feature.color as keyof typeof colorVariants
                ]
                  .split(" ")
                  .pop()}`}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              {feature.title}
              {feature.comingSoon && (
                <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>

          <motion.span
            style={{
              mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
              maskComposite: "exclude",
            }}
            initial={{ "--x": "100%", opacity: 0 } as any}
            whileHover={
              {
                "--x": "-100%",
                opacity: 1,
                transition: {
                  "--x": {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              } as any
            }
            className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,transparent_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),transparent_calc(var(--x)+100%))] p-px"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <section
      id="features"
      className="py-20 bg-gray-50 dark:bg-[#0F1729] relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Innovation That{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Puts You in Control
          </span>
        </motion.h2>

        <div className="relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>

          <div
            className="absolute -bottom-32 left-0 right-0 h-[400px] pointer-events-none"
            style={{
              background: `radial-gradient(
                circle at 50% 0%,
                transparent 0%,
                rgba(15, 23, 41, 0.3) 60%,
                rgba(15, 23, 41, 0.7) 80%,
                #0F1729 100%
              )`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
