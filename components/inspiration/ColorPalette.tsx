"use client";

import React from "react";
import { ClipboardCopy } from "lucide-react";

interface ColorPaletteProps {
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    [key: string]: string | undefined;
  };
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  // Filter out undefined values
  const validColors = Object.entries(colors).filter(
    ([_, value]) => value !== undefined
  ) as [string, string][];

  if (validColors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Color Palette</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {validColors.map(([name, color]) => (
          <div
            key={name}
            className="bg-card rounded-md border border-border overflow-hidden"
          >
            <div
              className="h-16 w-full"
              style={{ backgroundColor: color }}
            ></div>
            <div className="p-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium capitalize">
                  {name.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div className="text-xs text-muted-foreground">{color}</div>
              </div>
              <button
                onClick={() => handleCopyColor(color)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title={`Copy ${color}`}
              >
                {copiedColor === color ? (
                  <span className="text-xs font-medium text-primary">
                    Copied!
                  </span>
                ) : (
                  <ClipboardCopy size={14} className="text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
