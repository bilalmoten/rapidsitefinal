"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";

const industries = [
  {
    id: "charity",
    label: "Charity",
    description: "Non-profit and cause-focused websites",
    mode: "pro",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    description: "Food service and dining establishments",
    mode: "pro",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Creative professionals and artists",
    mode: "pro",
  },
  {
    id: "saas",
    label: "SaaS",
    description: "Software and tech companies",
    mode: "pro",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    description: "Online stores and marketplaces",
    mode: "express",
  },
  {
    id: "agency",
    label: "Agency",
    description: "Service-based businesses",
    mode: "express",
  },
  {
    id: "blog",
    label: "Blog",
    description: "Personal or news-based websites",
    mode: "express",
  },
];

const websites = {
  charity: {
    title: "Brighter Tomorrow Alliance",
    image: "https://picsum.photos/seed/charity/800/2000",
    prompt:
      "Create a modern charity website with a hero section showing community impact. Include statistics about volunteers and donations. Use warm, inviting colors with purple accents. Add sections for current projects, success stories, and a prominent donation button. The design should be emotionally engaging but professional.",
    url: "https://demo1.rapidai.website",
  },
  restaurant: {
    title: "Bistro Nouveau",
    image: "https://picsum.photos/seed/restaurant/1200/3000",
    prompt:
      "Design an elegant restaurant website with a full-width hero featuring signature dishes. Include an online reservation system, menu showcase with beautiful typography, and chef's special section. Use dark theme with gold accents. Add Instagram feed integration and customer testimonials.",
    url: "https://demo2.rapidai.website",
  },
  portfolio: {
    title: "Creative Vision Studio",
    image: "https://picsum.photos/seed/portfolio/1200/3000",
    prompt:
      "Build a minimal portfolio website for a photographer with a masonry grid gallery. Include smooth transitions between images, category filtering, and full-screen preview mode. Use a dark theme with subtle animations. Add client testimonials and a contact form with booking functionality.",
    url: "https://demo3.rapidai.website",
  },
  saas: {
    title: "DataFlow Analytics",
    image: "https://picsum.photos/seed/saas/1200/3000",
    prompt:
      "Create a modern SaaS website with a gradient hero section and floating 3D elements. Include feature highlights with icons, pricing tables, and integration logos. Use a professional color scheme with blue and purple gradients. Add customer testimonials and a live demo section.",
    url: "https://demo4.rapidai.website",
  },
  ecommerce: {
    title: "Artisan Market",
    image: "https://picsum.photos/seed/ecommerce/1200/3000",
    prompt:
      "Design a clean e-commerce website for handmade products. Include a hero with featured products, collection grid with hover effects, and quick view functionality. Use a light theme with pastel accents. Add wishlist feature, size guide, and customer reviews section.",
    url: "https://demo5.rapidai.website",
  },
  agency: {
    title: "Digital Pulse Agency",
    image: "https://picsum.photos/seed/agency/1200/3000",
    prompt:
      "Build a bold agency website with full-screen video background. Include case studies grid, team showcase, and service offerings. Use dark theme with neon accents. Add animated statistics, client logos, and a dynamic contact section with office locations.",
    url: "https://demo6.rapidai.website",
  },
  blog: {
    title: "Tech Insights Blog",
    image: "https://picsum.photos/seed/blog/1200/3000",
    prompt:
      "Create a blog website with a masonry grid of posts. Include a search bar, category filters, and a detailed post view with comments.",
    url: "https://demo7.rapidai.website",
  },
};

export default function Showcase() {
  const [selectedIndustry, setSelectedIndustry] = useState("charity");
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <section id="gallery" className="py-20 bg-[#0F1729]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Websites for Every{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-700">
            Industry
          </span>
        </motion.h2>

        <div className="flex gap-8">
          {/* Industry Selectors */}
          <div className="w-64 space-y-2">
            {industries.map((industry) => (
              <motion.button
                key={industry.id}
                onClick={() => {
                  setSelectedIndustry(industry.id);
                  setShowPrompt(false);
                }}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all duration-300",
                  selectedIndustry === industry.id
                    ? "bg-cyan-500/20 border border-cyan-500/40"
                    : "bg-white/5 border border-transparent hover:border-cyan-500/20"
                )}
                whileHover={{ x: 5 }}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-200">{industry.label}</p>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      industry.mode === "pro"
                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    )}
                  >
                    {industry.mode === "pro" ? "Pro" : "Express"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{industry.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Website Preview Frame */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndustry}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative h-[600px] rounded-xl overflow-hidden border border-cyan-500/20 bg-black/20"
              >
                {/* Frame Header */}
                <div className="h-8 bg-black/40 border-b border-cyan-500/20 flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />

                  {/* Add site title and mode badge */}
                  <div className="flex-1 flex justify-center items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {
                        websites[selectedIndustry as keyof typeof websites]
                          .title
                      }
                    </span>

                    {industries.find((i) => i.id === selectedIndustry)?.mode ===
                    "pro" ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                        Pro Mode
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Express Mode
                      </span>
                    )}
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="relative h-[calc(100%-2rem)] overflow-hidden">
                  <div className="absolute inset-0 group">
                    <Image
                      src={
                        websites[selectedIndustry as keyof typeof websites]
                          .image
                      }
                      alt={
                        websites[selectedIndustry as keyof typeof websites]
                          .title
                      }
                      fill
                      style={{ objectFit: "cover", transitionDuration: "30s" }}
                      className="transition-transform ease-linear group-hover:translate-y-[-66%]"
                    />
                  </div>

                  {/* Prompt Button */}
                  <motion.button
                    className="absolute top-4 right-4 p-2 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-500 z-50"
                    onClick={() => setShowPrompt(!showPrompt)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {showPrompt ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </motion.button>

                  {/* Prompt Overlay */}
                  <AnimatePresence>
                    {showPrompt && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0F1729]/90 backdrop-blur-sm p-4 z-40"
                      >
                        <h4 className="text-lg font-bold text-cyan-500 mb-2">
                          AI Prompt Used:
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {
                            websites[selectedIndustry as keyof typeof websites]
                              .prompt
                          }
                        </p>

                        {/* Add mode indicator */}
                        <div className="mt-4">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              industries.find((i) => i.id === selectedIndustry)
                                ?.mode === "pro"
                                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            )}
                          >
                            {industries.find((i) => i.id === selectedIndustry)
                              ?.mode === "pro"
                              ? "Built with Pro Mode"
                              : "Built with Express Mode"}
                          </span>

                          {industries.find((i) => i.id === selectedIndustry)
                            ?.mode === "pro" && (
                            <p className="text-xs text-gray-400 mt-2">
                              This website was created using our Pro Mode with
                              additional conversation to refine details and
                              design choices.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
