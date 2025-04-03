import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  icon: string; // Simple emoji icon
  keyElements: string[];
}

interface DesignStyleSelectorProps {
  styles: DesignStyle[];
  onSelect: (styleId: string) => void;
  selectedStyleId?: string;
}

export function DesignStyleSelector({
  styles,
  onSelect,
  selectedStyleId,
}: DesignStyleSelectorProps) {
  return (
    <div className="space-y-4 my-4">
      <h3 className="text-sm font-medium">Choose a design style:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map((style) => (
          <Button
            key={style.id}
            variant="outline"
            className={cn(
              "h-auto py-3 flex flex-col items-center gap-2 transition-all group relative",
              selectedStyleId === style.id && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(style.id)}
          >
            {selectedStyleId === style.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                <Check className="h-3 w-3" />
              </div>
            )}
            <div className="text-3xl group-hover:scale-110 transition-transform">
              {style.icon}
            </div>
            <div className="font-medium text-sm">{style.name}</div>
            <div className="text-xs text-muted-foreground text-center line-clamp-2">
              {style.description}
            </div>
          </Button>
        ))}
      </div>

      {selectedStyleId && (
        <div className="bg-muted/50 rounded-md p-3 mt-4">
          <h4 className="text-sm font-medium mb-2">Key Elements:</h4>
          <ul className="space-y-1">
            {styles
              .find((style) => style.id === selectedStyleId)
              ?.keyElements.map((element, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <span className="h-1 w-1 rounded-full bg-primary"></span>
                  {element}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
