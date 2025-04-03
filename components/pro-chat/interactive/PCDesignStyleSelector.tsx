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
import { Check, Paintbrush } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PCDesignStyle } from "@/hooks/useProChatStore";

interface PCDesignStyleSelectorProps {
  options: PCDesignStyle[];
  messageId: string;
  promptKey: string;
  isReadOnly?: boolean;
  onSubmit: (data: PCDesignStyle) => void;
}

export const PCDesignStyleSelector: React.FC<PCDesignStyleSelectorProps> = ({
  options,
  messageId,
  promptKey,
  isReadOnly = false,
  onSubmit,
}) => {
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);

  const handleSelect = (style: PCDesignStyle) => {
    if (isReadOnly) return;
    setSelectedStyleId(style.id);
  };

  const handleSubmit = () => {
    if (isReadOnly || !selectedStyleId) return;
    const selectedStyle = options.find((s) => s.id === selectedStyleId);
    if (selectedStyle) {
      onSubmit(selectedStyle);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Paintbrush className="h-4 w-4 text-primary" />
          Design Style Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((style) => (
            <div
              key={style.id}
              onClick={() => handleSelect(style)}
              className={`
                relative rounded-md p-3 border border-input bg-background 
                ${selectedStyleId === style.id ? "ring-2 ring-primary" : ""} 
                ${isReadOnly ? "opacity-80 pointer-events-none" : "cursor-pointer hover:bg-accent hover:text-accent-foreground"}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm flex items-center gap-1">
                  <span className="text-lg">{style.icon}</span> {style.name}
                </span>
                {selectedStyleId === style.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  {style.description}
                </div>
                <div className="pt-1">
                  <div className="text-xs font-medium">Key elements:</div>
                  <ul className="mt-1 list-disc ml-4 text-xs text-muted-foreground space-y-0.5">
                    {(style.keyElements || []).map((element, i) => (
                      <li key={i}>{element}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <AnimatePresence>
          {selectedStyleId && !isReadOnly && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Button size="sm" onClick={handleSubmit}>
                Apply Style
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
};
