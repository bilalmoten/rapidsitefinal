"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OnboardingOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  title: string;
  description: React.ReactNode;
  image?: string;
}

export function OnboardingOverlay({
  isOpen,
  onComplete,
  onSkip,
}: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      title: "Welcome to Pro Chat",
      description: (
        <div className="space-y-2">
          <p>
            Pro Chat is your personal website design consultant that guides you
            through creating a high-quality, custom website.
          </p>
          <p>
            Unlike Express Mode, Pro Chat focuses on quality and detail -
            creating websites that perfectly match your vision and business
            needs.
          </p>
        </div>
      ),
    },
    {
      title: "How to Get the Best Results",
      description: (
        <div className="space-y-2">
          <p>
            <strong>Be detailed</strong> - The more information you provide
            about your business and goals, the better your website will be.
          </p>
          <p>
            <strong>Answer questions thoughtfully</strong> - Pro Chat will ask
            strategic questions to understand your needs better.
          </p>
          <p>
            <strong>Share references</strong> - You can upload images or share
            links to websites you like for inspiration.
          </p>
        </div>
      ),
    },
    {
      title: "The Quality Journey",
      description: (
        <div className="space-y-2">
          <p>
            Pro Chat uses Claude 3.7 Sonnet, our most advanced AI model, to
            generate your website. This leads to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>More sophisticated designs</li>
            <li>Better understanding of your business needs</li>
            <li>More accurate implementation of your vision</li>
            <li>Higher quality animations and visual elements</li>
          </ul>
          <p className="text-sm italic mt-2">
            Pro websites take a bit longer to generate, but the results are
            worth it!
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onSkip()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-right text-sm">
            Step {currentStep + 1} of {steps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {steps[currentStep].description}

          {steps[currentStep].image && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img
                src={steps[currentStep].image}
                alt={`${steps[currentStep].title} illustration`}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? "Next" : "Get Started"}
            </Button>
          </div>
          <Button variant="ghost" onClick={onSkip} className="text-sm">
            Skip Tutorial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
