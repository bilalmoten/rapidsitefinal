"use client";

import React, { useEffect, useState } from "react";
import { Zap, Sparkles } from "lucide-react";

interface HoverPillProps {
  onSelectMode: (mode: "quick" | "quality") => void;
  position: { x: number; y: number };
  hoveredElement: Element | null;
}

const HoverPill: React.FC<HoverPillProps> = ({
  onSelectMode,
  position,
  hoveredElement,
}) => {
  const [pillPosition, setPillPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (hoveredElement) {
      const rect = hoveredElement.getBoundingClientRect();

      // Calculate if pill would overflow the element
      const pillWidth = 120; // Approximate width of pill
      const pillHeight = 32; // Approximate height of pill

      // Position pill inside the element's boundaries
      const top = Math.min(
        Math.max(rect.top, position.y),
        rect.bottom - pillHeight
      );

      const left = Math.min(
        Math.max(rect.left, position.x - pillWidth / 2),
        rect.right - pillWidth
      );

      setPillPosition({ top, left });
    }
  }, [position, hoveredElement]);

  return (
    <div
      className="fixed z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex gap-2 px-3 py-1.5 border border-gray-200"
      style={{
        top: pillPosition.top,
        left: pillPosition.left,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelectMode("quick");
        }}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        title="Quick Edit"
      >
        <Zap className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelectMode("quality");
        }}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        title="Quality Edit"
      >
        <Sparkles className="w-4 h-4" />
      </button>
    </div>
  );
};

export default HoverPill;
