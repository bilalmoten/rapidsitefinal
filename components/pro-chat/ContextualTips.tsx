"use client";

import React, { useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PCChatState } from "@/hooks/useProChatStore";
import { AnimatePresence, motion } from "framer-motion";

interface ContextualTipsProps {
  chatState: PCChatState["chatState"];
  className?: string;
}

// Tips based on chat state
const tipsByState: Record<
  PCChatState["chatState"],
  { title: string; tips: string[] }
> = {
  INTRODUCTION: {
    title: "Getting Started",
    tips: [
      "Tell the AI about your business or project's purpose",
      "Specify your target audience",
      "Mention any specific features you need",
    ],
  },
  GATHERING_PURPOSE: {
    title: "Defining Your Website's Purpose",
    tips: [
      "Be specific about what your website needs to achieve",
      "Describe your products or services in detail",
      "Explain what actions you want visitors to take",
    ],
  },
  DEFINING_STYLE: {
    title: "Design Style Tips",
    tips: [
      "Share examples of websites you like",
      "Describe your brand personality (professional, playful, luxury, etc.)",
      "Mention specific colors that reflect your brand",
    ],
  },
  CONTENT_PLANNING: {
    title: "Content Planning Tips",
    tips: [
      "Upload your logo and brand images",
      "Share links to existing content or websites for reference",
      "Describe what pages you need (Home, About, Services, etc.)",
    ],
  },
  REFINEMENT: {
    title: "Refinement Tips",
    tips: [
      "Provide feedback on specific aspects you'd like to change",
      "Be clear about what you like and dislike",
      "Ask for alternatives if you're unsure",
    ],
  },
  CONFIRMATION: {
    title: "Before Generating",
    tips: [
      "Review your brief in the sidebar",
      "Check that all required assets are uploaded",
      "Make any final adjustments to the design preferences",
    ],
  },
  GENERATING: {
    title: "During Generation",
    tips: [
      "Generation may take a few minutes",
      "You'll receive an email when your website is ready",
      "You can leave this page and come back later",
    ],
  },
  COMPLETE: {
    title: "Next Steps",
    tips: [
      "Explore your new website",
      "Edit content directly in the editor",
      "Add more pages or sections as needed",
    ],
  },
};

export const ContextualTips: React.FC<ContextualTipsProps> = ({
  chatState,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const currentTips = tipsByState[chatState];

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`bg-muted/50 border rounded-lg p-4 ${className}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h4 className="font-medium">{currentTips.title}</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-1 pl-6 text-sm list-disc">
            {currentTips.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualTips;
