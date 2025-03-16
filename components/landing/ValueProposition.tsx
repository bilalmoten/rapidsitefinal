"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

const comparisonData = {
  typical: [
    {
      title: "Generic templates with limited customization",
      description:
        "Stuck with rigid templates that all look the same. Limited options for customization mean your site looks like everyone else's.",
    },
    {
      title: "One-size-fits-all approach",
      description:
        "Same features forced on every website regardless of your unique needs. No flexibility to adapt to your specific requirements.",
    },
    {
      title: "Limited control over design decisions",
      description:
        "No way to fine-tune the details that matter. You're stuck with what the AI decides, even if it doesn't match your vision.",
    },
    {
      title: "Built by AI with minimal user input",
      description:
        "AI makes assumptions without understanding your needs. Results in generic sites that miss your brand's unique personality.",
    },
    {
      title: "Requires coding experience for deep customization",
      description:
        "Need to code to make meaningful changes. Technical barriers prevent you from achieving your perfect design.",
    },
  ],
  ours: [
    {
      title: "True AI understanding of your unique vision",
      description:
        "Our AI learns and adapts to your specific needs. Every suggestion is tailored to your brand and goals.",
    },
    {
      title: "Fine-grained control over every element",
      description:
        "Customize every detail exactly how you want. From colors to layouts, you have complete control over your design.",
    },
    {
      title: "Multiple unique styles from the same prompt",
      description:
        "Generate different designs until you find the perfect one. Our AI provides varied options while maintaining your core requirements.",
    },
    {
      title: "Built with AI, guided by your detailed input",
      description:
        "AI follows your vision while adding intelligent suggestions. Perfect balance of automation and personalization.",
    },
    {
      title: "No coding required, even for advanced customization",
      description:
        "Make complex changes through simple interactions. Advanced features accessible to everyone, regardless of technical skills.",
    },
  ],
};

export default function ValueProposition() {
  const [hoveredItem, setHoveredItem] = useState<{
    side: "typical" | "ours";
    index: number;
  } | null>(null);

  return (
    <section className="py-20 bg-[#0F1729]/95">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          <div className="flex flex-col items-center gap-2">
            <span>The Only AI Website Builder</span>
            <span>
              That Delivers{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-700">
                Your Vision
              </span>
              , Not Its Own
            </span>
          </div>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Typical RapidSite AI Website Builders */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-8 text-red-500/80">
              Typical AI Website Builders
            </h3>
            {comparisonData.typical.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
                onMouseEnter={() => setHoveredItem({ side: "typical", index })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.div
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center mt-1">
                      <X className="w-3 h-3 text-red-500/70" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{item.title}</p>
                      <AnimatePresence>
                        {hoveredItem?.side === "typical" &&
                          hoveredItem.index === index && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-gray-400 mt-2"
                            >
                              {item.description}
                            </motion.p>
                          )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Our RapidSite AI Website Builder */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-8 text-cyan-500/80">
              RapidSite
            </h3>
            {comparisonData.ours.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
                onMouseEnter={() => setHoveredItem({ side: "ours", index })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.div
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center mt-1">
                      <CheckCircle className="w-3 h-3 text-cyan-500/70" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{item.title}</p>
                      <AnimatePresence>
                        {hoveredItem?.side === "ours" &&
                          hoveredItem.index === index && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-gray-400 mt-2"
                            >
                              {item.description}
                            </motion.p>
                          )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
