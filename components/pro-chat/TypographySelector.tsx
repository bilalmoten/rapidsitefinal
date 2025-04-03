"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showProjectSettingToast } from "@/components/notifications/ProjectToast";

interface TypographySelectorProps {
  currentFont: string;
  onFontChange: (font: string) => void;
  onMessageSend: (message: string) => void;
}

// Define available font options
const fontOptions = [
  {
    name: "Sans Serif",
    value: "sans",
    sample: "Aa",
    description: "Clean, modern look",
  },
  {
    name: "Serif",
    value: "serif",
    sample: "Aa",
    description: "Traditional, authoritative",
  },
  {
    name: "Mono",
    value: "mono",
    sample: "Aa",
    description: "Technical, precise",
  },
  {
    name: "Display",
    value: "display",
    sample: "Aa",
    description: "Creative, unique",
  },
  {
    name: "Rounded",
    value: "rounded",
    sample: "Aa",
    description: "Friendly, approachable",
  },
  {
    name: "Handwritten",
    value: "handwritten",
    sample: "Aa",
    description: "Personal, casual",
  },
];

export function TypographySelector({
  currentFont,
  onFontChange,
  onMessageSend,
}: TypographySelectorProps) {
  const handleSelectFont = (font: string, fontName: string) => {
    const oldFont = currentFont;

    // Call the change handler
    onFontChange(font);

    // Show toast notification
    showProjectSettingToast({
      settingType: "font",
      settingName: "Typography",
      settingValue: fontName,
      settingDescription: oldFont
        ? `Updated from ${getFontNameByValue(oldFont)}`
        : "Font style set",
      onUndo: () => {
        onFontChange(oldFont);
      },
    });

    // Send a message to the chat
    onMessageSend(
      `I'd like to use ${fontName.toLowerCase()} typography for my website.`
    );
  };

  // Helper to get font name by value
  const getFontNameByValue = (value: string): string => {
    const font = fontOptions.find((f) => f.value === value);
    return font ? font.name : "Default";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fontOptions.map((font) => (
          <Button
            key={font.value}
            variant={currentFont === font.value ? "default" : "outline"}
            className={cn(
              "h-auto py-4 px-3 flex flex-col items-center justify-center gap-2 group",
              font.value === "sans" && "font-sans",
              font.value === "serif" && "font-serif",
              font.value === "mono" && "font-mono",
              font.value === "display" && "font-heading",
              font.value === "rounded" && "font-rounded",
              font.value === "handwritten" && "font-handwritten"
            )}
            onClick={() => handleSelectFont(font.value, font.name)}
          >
            <span
              className={cn(
                "text-3xl transition-all group-hover:scale-110",
                currentFont === font.value
                  ? "text-primary-foreground"
                  : "text-foreground"
              )}
            >
              {font.sample}
            </span>
            <span className="text-xs font-medium">{font.name}</span>
            <span
              className={cn(
                "text-[10px] text-center",
                currentFont === font.value
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              {font.description}
            </span>
          </Button>
        ))}
      </div>

      <div className="bg-muted/50 p-3 rounded-md">
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            currentFont === "sans" && "font-sans",
            currentFont === "serif" && "font-serif",
            currentFont === "mono" && "font-mono",
            currentFont === "display" && "font-heading",
            currentFont === "rounded" && "font-rounded",
            currentFont === "handwritten" && "font-handwritten"
          )}
        >
          <h4>Sample Text</h4>
          <p>
            This is how your text will appear using the{" "}
            {getFontNameByValue(currentFont)} font family.
          </p>
        </div>
      </div>
    </div>
  );
}
