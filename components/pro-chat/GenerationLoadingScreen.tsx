"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

interface GenerationLoadingScreenProps {
  websiteName: string;
  onClose?: () => void;
}

export function GenerationLoadingScreen({
  websiteName,
  onClose,
}: GenerationLoadingScreenProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Initializing Claude 3.7 Sonnet...",
    "Analyzing your requirements...",
    "Designing website structure...",
    "Creating responsive layouts...",
    "Implementing animations and interactions...",
    "Applying styling and visual elements...",
    "Generating semantic HTML and CSS...",
    "Finalizing your website...",
    "Generation complete! You'll be notified by email when ready.",
  ];

  // Simulate progress for visual feedback
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // Progress capped at 90% as the real completion will be handled by email
        const newProgress = Math.min(oldProgress + 1, 90);

        // Update step based on progress
        if (newProgress % (90 / (steps.length - 1)) < 1) {
          setCurrentStep((oldStep) => Math.min(oldStep + 1, steps.length - 1));
        }

        // After reaching 90%, stop the timer
        if (newProgress >= 90) {
          clearInterval(timer);
        }

        return newProgress;
      });
    }, 450); // Speed of progress animation

    // Show final message after 15 seconds
    const finalMessageTimer = setTimeout(() => {
      setCurrentStep(steps.length - 1);
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(finalMessageTimer);
    };
  }, [steps.length]);

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Generating Your Website
        </h2>

        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Starting</span>
            <span>In Progress...</span>
            <span>Email Notification</span>
          </div>
        </div>

        <div className="mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            {currentStep === steps.length - 1 ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            )}
            <p className="font-medium">{steps[currentStep]}</p>
          </div>

          <p className="text-sm text-gray-500 ml-8">
            {currentStep === steps.length - 1
              ? "Website generation is running in the background. You'll receive an email notification when your website is ready."
              : "Claude 3.7 Sonnet is crafting a high-quality website based on your requirements. This may take 5-10 minutes."}
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
            Important Note
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Pro website generation with Claude 3.7 Sonnet takes 5-10 minutes to
            complete. You will receive an email notification when your website
            is ready. You can safely navigate away from this page.
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={goToDashboard} className="px-6">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
