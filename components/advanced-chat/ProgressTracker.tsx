// components/advanced-chat/ProgressTracker.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentState: string; // Use specific enum/type from store if defined
}

const STEPS = [
  { id: "INTRODUCTION", label: "Start" },
  { id: "GATHERING_PURPOSE", label: "Purpose" },
  { id: "DEFINING_STYLE", label: "Style" },
  { id: "STRUCTURE_CONTENT", label: "Structure" },
  { id: "REFINEMENT", label: "Details" },
  { id: "CONFIRMATION", label: "Confirm" },
  { id: "GENERATING", label: "Generate" },
];

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentState }) => {
  const currentIndex = STEPS.findIndex((step) => step.id === currentState);
  // Treat ERROR as staying at the last non-generating step for visual purposes
  const displayIndex =
    currentState === "ERROR"
      ? Math.max(
          0,
          STEPS.findIndex((s) => s.id === "CONFIRMATION")
        )
      : currentIndex;

  return (
    <div className="w-full">
      <ol className="flex items-center w-full">
        {STEPS.map((step, index) => {
          const isCompleted = displayIndex > index;
          const isCurrent = displayIndex === index;
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                "flex w-full items-center",
                !isLast &&
                  "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-muted after:inline-block",
                !isLast && isCompleted && "after:border-primary" // Line color for completed steps
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold shrink-0",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                  isCurrent &&
                    "bg-primary/80 text-primary-foreground ring-2 ring-primary/30", // Highlight current slightly differently
                  currentState === "ERROR" &&
                    isCurrent &&
                    "bg-destructive text-destructive-foreground ring-2 ring-destructive/30" // Error highlight
                )}
              >
                {/* Use checkmark for completed, number for current/future */}
                {/* {isCompleted ? <Check size={10} /> : index + 1} */}
                {index + 1}
              </span>
              {/* Optional: Add Step Label Below */}
              {/* <span className={cn("absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs", isCurrent ? "font-semibold text-primary" : "text-muted-foreground")}>{step.label}</span> */}
            </li>
          );
        })}
      </ol>
      {/* Display labels below (alternative) */}
      <div className="mt-1.5 grid grid-cols-7 text-center text-[10px] text-muted-foreground px-1">
        {STEPS.map((step, index) => (
          <span
            key={`label-${step.id}`}
            className={cn(
              displayIndex >= index && "font-medium text-foreground",
              displayIndex === index && "text-primary",
              currentState === "ERROR" &&
                displayIndex === index &&
                "text-destructive"
            )}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
