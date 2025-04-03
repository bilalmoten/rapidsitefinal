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
import { Check, Type } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PCFontPairing } from "@/hooks/useProChatStore";

interface PCFontPairingSelectorProps {
  options: PCFontPairing[];
  currentFontId?: string;
  messageId: string;
  promptKey: string;
  isReadOnly?: boolean;
  onSubmit: (data: PCFontPairing) => void;
}

export const PCFontPairingSelector: React.FC<PCFontPairingSelectorProps> = ({
  options,
  currentFontId,
  messageId,
  promptKey,
  isReadOnly = false,
  onSubmit,
}) => {
  const [selectedFontId, setSelectedFontId] = useState<string>(
    currentFontId || options[0]?.id || ""
  );

  const handleSelect = (fontId: string) => {
    if (isReadOnly) return;
    setSelectedFontId(fontId);
  };

  const handleSubmit = () => {
    if (isReadOnly) return;
    const selectedFont = options.find((f) => f.id === selectedFontId);
    if (selectedFont) {
      onSubmit(selectedFont);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          Typography Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-1 gap-3">
          {options.map((font) => {
            const isSelected = selectedFontId === font.id;

            return (
              <div
                key={font.id}
                onClick={() => handleSelect(font.id)}
                className={`
                  relative rounded-md p-3 border border-input bg-background 
                  ${isSelected ? "ring-2 ring-primary" : ""} 
                  ${isReadOnly ? "opacity-80 pointer-events-none" : "cursor-pointer hover:bg-accent hover:text-accent-foreground"}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{font.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div className="space-y-2">
                  <div
                    className={font.headingClass || "font-sans"}
                    style={{ fontFamily: font.headingFont }}
                  >
                    <div className="text-lg font-bold">
                      Heading Font: {font.headingFont}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      The quick brown fox jumps over the lazy dog
                    </div>
                  </div>
                  <div
                    className={font.bodyClass || "font-sans"}
                    style={{ fontFamily: font.bodyFont }}
                  >
                    <div className="text-xs font-medium">
                      Body Font: {font.bodyFont}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam euismod vestibulum justo, vel aliquet nunc varius
                      id.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <AnimatePresence>
          {!isReadOnly && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Button size="sm" onClick={handleSubmit}>
                Apply Typography
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
};
