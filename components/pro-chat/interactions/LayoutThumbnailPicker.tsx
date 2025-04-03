import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

interface LayoutThumbnailPickerProps {
  layouts: LayoutOption[];
  onSelect: (layoutId: string) => void;
  selectedLayoutId?: string;
}

export function LayoutThumbnailPicker({
  layouts,
  onSelect,
  selectedLayoutId,
}: LayoutThumbnailPickerProps) {
  // Render a simple visual representation of the layout
  const renderLayoutPreview = (layout: LayoutOption) => {
    const isClassic = layout.id.includes("classic");
    const isGrid = layout.id.includes("grid");
    const isBlog = layout.id.includes("blog");
    const isSidebar = layout.id.includes("sidebar");

    if (isGrid) {
      return (
        <div className="grid grid-cols-2 gap-1 h-full w-full p-1">
          <div className="bg-primary/20 rounded aspect-video"></div>
          <div className="bg-primary/20 rounded aspect-video"></div>
          <div className="bg-primary/20 rounded aspect-video"></div>
          <div className="bg-primary/20 rounded aspect-video"></div>
        </div>
      );
    } else if (isBlog) {
      return (
        <div className="grid grid-cols-4 gap-1 h-full w-full p-1">
          <div className="col-span-3 bg-primary/20 rounded h-28"></div>
          <div className="col-span-1 bg-primary/30 rounded h-28"></div>
        </div>
      );
    } else if (isSidebar) {
      return (
        <div className="grid grid-cols-4 gap-1 h-full w-full p-1">
          <div className="col-span-1 bg-primary/30 rounded h-28"></div>
          <div className="col-span-3 bg-primary/20 rounded h-28"></div>
        </div>
      );
    } else if (isClassic) {
      return (
        <div className="flex flex-col gap-1 h-full w-full p-1">
          <div className="bg-primary/30 h-6 rounded"></div>
          <div className="bg-primary/20 h-12 rounded"></div>
          <div className="bg-primary/10 h-8 rounded"></div>
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-primary/10 rounded h-6"></div>
            <div className="bg-primary/10 rounded h-6"></div>
            <div className="bg-primary/10 rounded h-6"></div>
          </div>
        </div>
      );
    } else {
      // Default/modern layout
      return (
        <div className="flex flex-col gap-1 h-full w-full p-1">
          <div className="bg-primary/30 h-6 rounded-full"></div>
          <div className="bg-primary/20 h-12 rounded"></div>
          <div className="bg-primary/10 h-10 rounded"></div>
          <div className="bg-primary/10 h-6 rounded"></div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4 my-4">
      <h3 className="text-sm font-medium">Choose a layout structure:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {layouts.map((layout) => (
          <Button
            key={layout.id}
            variant="outline"
            className={cn(
              "h-auto p-0 flex flex-col items-stretch overflow-hidden transition-all relative",
              selectedLayoutId === layout.id && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(layout.id)}
          >
            {selectedLayoutId === layout.id && (
              <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-0.5">
                <Check className="h-3 w-3" />
              </div>
            )}
            <div className="bg-muted/30 aspect-video w-full">
              {renderLayoutPreview(layout)}
            </div>
            <div className="p-3 text-left">
              <div className="font-medium text-sm">{layout.name}</div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {layout.description}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
