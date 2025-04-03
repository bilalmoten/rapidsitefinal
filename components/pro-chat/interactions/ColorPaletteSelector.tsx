import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

interface ColorPaletteSelectorProps {
  palettes: ColorPalette[];
  onSelect: (paletteId: string) => void;
  selectedPaletteId?: string;
}

export function ColorPaletteSelector({
  palettes,
  onSelect,
  selectedPaletteId,
}: ColorPaletteSelectorProps) {
  return (
    <div className="space-y-4 my-4">
      <h3 className="text-sm font-medium">Select a color palette:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {palettes.map((palette) => (
          <Button
            key={palette.id}
            variant="outline"
            className={cn(
              "h-auto p-3 flex flex-col items-stretch justify-start gap-2 transition-all group relative",
              selectedPaletteId === palette.id && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(palette.id)}
          >
            {selectedPaletteId === palette.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                <Check className="h-3 w-3" />
              </div>
            )}
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{palette.name}</div>
            </div>
            <div className="flex justify-start gap-1 w-full">
              {palette.colors.map((color) => (
                <div
                  key={color}
                  className="h-8 flex-1 rounded shadow-sm border border-border group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-1 mt-1 flex-wrap">
              {palette.colors.map((color) => (
                <div
                  key={color}
                  className="text-xs font-mono bg-muted px-1 rounded"
                >
                  {color}
                </div>
              ))}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
