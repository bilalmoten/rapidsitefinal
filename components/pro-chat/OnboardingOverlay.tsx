"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Image,
  PaintBucket,
  Sparkles,
  ChevronRight,
  XCircle,
} from "lucide-react";

// Type definitions
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  tips?: string[];
}

interface OnboardingOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
}

// Onboarding steps
const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Pro Website Designer",
    description:
      "Your AI-powered design partner for creating professional websites. Let's walk through the key features to help you get the most out of your experience.",
    icon: <Sparkles className="h-12 w-12 text-primary" />,
    image: "/onboarding/welcome.svg",
    tips: [
      "Pro Chat helps you create a higher quality website with more customization options",
      "The AI will guide you through a conversation to understand your requirements",
      "You'll be able to provide detailed input about design, content, and structure",
    ],
  },
  {
    id: "chat",
    title: "Interactive Chat Experience",
    description:
      "Chat with our AI to describe your website needs in detail. The more information you provide, the better your website will be!",
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    image: "/onboarding/chat.svg",
    tips: [
      "Be specific about your business purpose and target audience",
      "Use the suggested responses or type your own questions",
      "The AI will adapt and ask follow-up questions based on your input",
    ],
  },
  {
    id: "assets",
    title: "Upload Images & References",
    description:
      "Add your own images and website references to incorporate into your design. This helps our AI understand your visual preferences.",
    icon: <Image className="h-12 w-12 text-primary" />,
    image: "/onboarding/assets.svg",
    tips: [
      "Upload logos, product photos, team images, or any visual content",
      "Add labels and descriptions to help the AI position images properly",
      "Share links to websites you like for style inspiration",
    ],
  },
  {
    id: "design",
    title: "Customize Your Design",
    description:
      "Select color schemes, fonts, and design styles that match your brand. The AI will recommend options, but you have the final say.",
    icon: <PaintBucket className="h-12 w-12 text-primary" />,
    image: "/onboarding/design.svg",
    tips: [
      "Choose from curated color palettes or create your own",
      "Select font pairings that complement your brand personality",
      "Pick a design style that resonates with your target audience",
    ],
  },
];

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentStep = onboardingSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Save to localStorage that onboarding is complete
      localStorage.setItem("prochat_onboarding_complete", "true");
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  };

  const handleSkip = () => {
    // Save to localStorage that onboarding is complete even if skipped
    localStorage.setItem("prochat_onboarding_complete", "true");
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card w-full max-w-3xl h-1/2 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Pro Website Designer</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSkip}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row h-[500px] md:h-[450px]">
              {/* Left side (step content) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    {currentStep.icon}
                    <h3 className="text-2xl font-bold">{currentStep.title}</h3>
                  </div>
                  <p className="text-lg mb-6">{currentStep.description}</p>

                  {currentStep.tips && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-md mb-2">Pro Tips:</h4>
                      <ul className="space-y-2">
                        {currentStep.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm flex-1">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-1">
                    {onboardingSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-6 rounded-full ${
                          index === currentStepIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSkip}>
                      Skip tutorial
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex items-center gap-1"
                    >
                      {currentStepIndex === onboardingSteps.length - 1
                        ? "Get started"
                        : "Next"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right side (illustration) */}
              <div className="hidden md:block w-1/2 bg-muted p-8 flex items-center justify-center">
                {currentStep.image ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={currentStep.image}
                      alt={currentStep.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                    {currentStep.icon}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
