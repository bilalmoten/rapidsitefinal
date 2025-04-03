import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface FontPairing {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  headingClass: string;
  bodyClass: string;
}

interface FontPairingSelectorProps {
  fontPairings: FontPairing[];
  onSelect: (fontPairingId: string) => void;
  selectedPairingId?: string;
}

export function FontPairingSelector({
  fontPairings,
  onSelect,
  selectedPairingId,
}: FontPairingSelectorProps) {
  return (
    <div className="space-y-4 my-4">
      <h3 className="text-sm font-medium">Select a font pairing:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fontPairings.map((pairing) => (
          <Button
            key={pairing.id}
            variant="outline"
            className={cn(
              "h-auto p-4 flex flex-col items-stretch text-left gap-2 transition-all relative",
              selectedPairingId === pairing.id && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(pairing.id)}
          >
            {selectedPairingId === pairing.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                <Check className="h-3 w-3" />
              </div>
            )}
            <div className="font-medium text-sm mb-1">{pairing.name}</div>
            <div className="space-y-3">
              <div>
                <h4 className={cn("text-lg", pairing.headingClass)}>
                  Heading Font
                </h4>
                <p className="text-xs text-muted-foreground">
                  {pairing.headingFont}
                </p>
              </div>
              <div>
                <p className={cn("text-sm", pairing.bodyClass)}>
                  This is how paragraph text will appear on your website. The
                  body text should be highly readable at different sizes.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pairing.bodyFont}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
