"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showProjectSettingToast } from "@/components/notifications/ProjectToast";

interface LayoutSelectorProps {
  currentLayout: string;
  onLayoutChange: (layout: string) => void;
  onMessageSend: (message: string) => void;
}

// Define layout options with simple visual representations
const layoutOptions = [
  {
    name: "Classic",
    value: "classic",
    description: "Header, sidebar, main content",
    icon: (
      <div className="grid grid-cols-3 gap-0.5 h-full w-full">
        <div className="col-span-3 bg-primary/30 h-3 rounded-sm"></div>
        <div className="col-span-1 bg-primary/20 h-10 rounded-sm"></div>
        <div className="col-span-2 bg-primary/10 h-10 rounded-sm"></div>
      </div>
    ),
  },
  {
    name: "Modern",
    value: "modern",
    description: "Full-width sections, minimal",
    icon: (
      <div className="flex flex-col gap-0.5 h-full w-full">
        <div className="bg-primary/30 h-3 rounded-sm"></div>
        <div className="bg-primary/10 h-5 rounded-sm"></div>
        <div className="bg-primary/20 h-5 rounded-sm"></div>
      </div>
    ),
  },
  {
    name: "Grid",
    value: "grid",
    description: "Card-based layout for portfolios",
    icon: (
      <div className="grid grid-cols-2 gap-0.5 h-full w-full">
        <div className="col-span-2 bg-primary/30 h-3 rounded-sm"></div>
        <div className="bg-primary/20 h-4 rounded-sm"></div>
        <div className="bg-primary/10 h-4 rounded-sm"></div>
        <div className="bg-primary/10 h-4 rounded-sm"></div>
        <div className="bg-primary/20 h-4 rounded-sm"></div>
      </div>
    ),
  },
  {
    name: "Blog",
    value: "blog",
    description: "Content-focused with sidebar",
    icon: (
      <div className="grid grid-cols-4 gap-0.5 h-full w-full">
        <div className="col-span-4 bg-primary/30 h-3 rounded-sm"></div>
        <div className="col-span-3 bg-primary/10 h-10 rounded-sm"></div>
        <div className="col-span-1 bg-primary/20 h-10 rounded-sm"></div>
      </div>
    ),
  },
  {
    name: "Landing",
    value: "landing",
    description: "Full-screen sections, high impact",
    icon: (
      <div className="flex flex-col gap-0.5 h-full w-full">
        <div className="bg-primary/30 h-3 rounded-sm"></div>
        <div className="bg-primary/10 h-10 rounded-sm"></div>
      </div>
    ),
  },
  {
    name: "Shop",
    value: "shop",
    description: "Product grid with filters",
    icon: (
      <div className="grid grid-cols-4 gap-0.5 h-full w-full">
        <div className="col-span-4 bg-primary/30 h-3 rounded-sm"></div>
        <div className="col-span-1 bg-primary/20 h-10 rounded-sm"></div>
        <div className="bg-primary/10 h-4 rounded-sm"></div>
        <div className="bg-primary/10 h-4 rounded-sm"></div>
        <div className="bg-primary/10 h-4 rounded-sm"></div>
        <div className="hidden sm:block bg-primary/10 h-4 rounded-sm"></div>
        <div className="hidden sm:block bg-primary/10 h-4 rounded-sm"></div>
      </div>
    ),
  },
];

export function LayoutSelector({
  currentLayout,
  onLayoutChange,
  onMessageSend,
}: LayoutSelectorProps) {
  // Handle layout selection
  const handleSelectLayout = (layout: string, layoutName: string) => {
    const oldLayout = currentLayout;

    // Call the change handler
    onLayoutChange(layout);

    // Show toast notification
    showProjectSettingToast({
      settingType: "layout",
      settingName: "Layout",
      settingValue: layoutName,
      settingDescription: oldLayout
        ? `Updated from ${getLayoutNameByValue(oldLayout)}`
        : "Layout selected",
      onUndo: () => {
        onLayoutChange(oldLayout);
      },
    });

    // Send a message to the chat
    onMessageSend(
      `I'd like to use a ${layoutName.toLowerCase()} layout for my website.`
    );
  };

  // Helper to get layout name by value
  const getLayoutNameByValue = (value: string): string => {
    const layout = layoutOptions.find((l) => l.value === value);
    return layout ? layout.name : "Default";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {layoutOptions.map((layout) => (
          <Button
            key={layout.value}
            variant={currentLayout === layout.value ? "default" : "outline"}
            className="h-auto py-3 px-3 flex flex-col gap-3"
            onClick={() => handleSelectLayout(layout.value, layout.name)}
          >
            <div className="aspect-video w-full flex items-center justify-center p-2 rounded bg-background/50">
              {layout.icon}
            </div>
            <div className="space-y-1 text-center">
              <div className="font-medium text-xs">{layout.name}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                {layout.description}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Selected: </span>
          <span>{getLayoutNameByValue(currentLayout)}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-8 gap-1"
          onClick={() =>
            onMessageSend(
              `Tell me more about the ${getLayoutNameByValue(currentLayout)} layout option.`
            )
          }
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}
