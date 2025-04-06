"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { OnboardingOverlay } from "./OnboardingOverlay";

interface TutorialButtonProps {
  className?: string;
}

export const TutorialButton: React.FC<TutorialButtonProps> = ({
  className,
}) => {
  const [showTutorial, setShowTutorial] = useState(false);

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleComplete = () => {
    setShowTutorial(false);
  };

  const handleSkip = () => {
    setShowTutorial(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 ${className}`}
        onClick={handleShowTutorial}
      >
        <HelpCircle className="h-4 w-4" />
        <span>Tutorial</span>
      </Button>

      {showTutorial && (
        <OnboardingOverlay
          isOpen={showTutorial}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      )}
    </>
  );
};

export default TutorialButton;
