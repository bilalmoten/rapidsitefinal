import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Layout, PenTool, Upload } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Describe Your Vision",
      description:
        "Chat with our AI and describe the website you want to create",
      icon: <MessageSquare className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "AI Generates Design",
      description:
        "Our AI creates a stunning design based on your requirements",
      icon: <Layout className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "Customize and Refine",
      description:
        "Easily modify any part of your website with simple instructions",
      icon: <PenTool className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "Publish and Share",
      description:
        "Publish your website to a free subdomain or export the code",
      icon: <Upload className="w-8 h-8 text-indigo-500" />,
    },
  ];

  return (
    <section id="how-it-works" className="container mx-auto px-4 py-20 m-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        How It Works
      </h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-indigo-800"></div>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`flex items-center mb-12 last:mb-0 ${
              index % 2 === 0 ? "flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div
              className={`w-1/2 ${index % 2 === 0 ? "pl-8" : "pr-8"} flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-indigo-100 dark:bg-indigo-900 rounded-full p-2">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-900 z-10 flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
