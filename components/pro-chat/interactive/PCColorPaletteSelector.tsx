"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, PaletteIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PCColorPalette } from "@/hooks/useProChatStore";

interface PCColorPaletteSelectorProps {
  options: PCColorPalette[];
  messageId: string;
  promptKey: string;
  isReadOnly?: boolean;
  onSubmit: (data: PCColorPalette) => void;
}

export const PCColorPaletteSelector: React.FC<PCColorPaletteSelectorProps> = ({
  options,
  messageId,
  promptKey,
  isReadOnly = false,
  onSubmit,
}) => {
  const [selectedPaletteId, setSelectedPaletteId] = useState<string | null>(
    null
  );

  const handleSelect = (palette: PCColorPalette) => {
    if (isReadOnly) return;
    setSelectedPaletteId(palette.id);
  };

  const handleSubmit = () => {
    if (isReadOnly || !selectedPaletteId) return;

    const selectedPalette = options.find((p) => p.id === selectedPaletteId);
    if (selectedPalette) {
      onSubmit(selectedPalette);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <PaletteIcon className="h-4 w-4 text-primary" />
          Color Palette Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((palette) => (
            <div
              key={palette.id}
              onClick={() => handleSelect(palette)}
              className={`
                relative rounded-md p-3 border border-input bg-background 
                ${selectedPaletteId === palette.id ? "ring-2 ring-primary" : ""} 
                ${isReadOnly ? "opacity-80 pointer-events-none" : "cursor-pointer hover:bg-accent hover:text-accent-foreground"}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{palette.name}</span>
                {selectedPaletteId === palette.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex space-x-1">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <AnimatePresence>
          {selectedPaletteId && !isReadOnly && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Button size="sm" onClick={handleSubmit}>
                Apply Palette
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
};
