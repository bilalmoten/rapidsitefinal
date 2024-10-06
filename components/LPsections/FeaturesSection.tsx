import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Layout,
  PenTool,
  Code,
  Upload,
  Cpu,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "AI-Powered Chat",
      description: "Describe your website and let our AI do the rest",
    },
    {
      icon: <Layout className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "Stunning Designs",
      description: "Choose from a variety of beautiful, customizable templates",
    },
    {
      icon: <PenTool className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "Easy Customization",
      description: "Edit any part of your website with simple instructions",
    },
    {
      icon: <Code className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "Code Export",
      description: "Download your website's code for further customization",
    },
    {
      icon: <Upload className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "One-Click Publish",
      description: "Publish your website to a free subdomain instantly",
    },
    {
      icon: <Cpu className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "AI-Driven Optimization",
      description: "Automatically optimize your site for performance and SEO",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        Powerful Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
