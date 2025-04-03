import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

// Import all interactive components
import {
  ColorPaletteSelector,
  type ColorPalette,
} from "./ColorPaletteSelector";
import { FontPairingSelector, type FontPairing } from "./FontPairingSelector";
import {
  LayoutThumbnailPicker,
  type LayoutOption,
} from "./LayoutThumbnailPicker";
import { DesignStyleSelector, type DesignStyle } from "./DesignStyleSelector";

// Define the props for different interactive component types
export type InteractiveComponentProps =
  | { type: "colorPalette"; palettes: ColorPalette[]; selectedId?: string }
  | { type: "fontPairing"; fontPairings: FontPairing[]; selectedId?: string }
  | { type: "layout"; layouts: LayoutOption[]; selectedId?: string }
  | { type: "designStyle"; styles: DesignStyle[]; selectedId?: string };

interface InteractiveMessageProps {
  component: InteractiveComponentProps;
  onSubmit: (type: string, value: string) => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function InteractiveMessage({
  component,
  onSubmit,
  onCancel,
  showActions = true,
}: InteractiveMessageProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    // Initialize from component props if provided
    "selectedId" in component ? component.selectedId : undefined
  );
  const [expanded, setExpanded] = useState(true);

  const handleSubmit = () => {
    if (selectedValue) {
      onSubmit(component.type, selectedValue);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const renderComponent = () => {
    if (!expanded) {
      return null;
    }

    switch (component.type) {
      case "colorPalette":
        return (
          <ColorPaletteSelector
            palettes={component.palettes}
            selectedPaletteId={selectedValue}
            onSelect={(id) => setSelectedValue(id)}
          />
        );
      case "fontPairing":
        return (
          <FontPairingSelector
            fontPairings={component.fontPairings}
            selectedPairingId={selectedValue}
            onSelect={(id) => setSelectedValue(id)}
          />
        );
      case "layout":
        return (
          <LayoutThumbnailPicker
            layouts={component.layouts}
            selectedLayoutId={selectedValue}
            onSelect={(id) => setSelectedValue(id)}
          />
        );
      case "designStyle":
        return (
          <DesignStyleSelector
            styles={component.styles}
            selectedStyleId={selectedValue}
            onSelect={(id) => setSelectedValue(id)}
          />
        );
      default:
        return <div>Unknown component type</div>;
    }
  };

  const getTitle = () => {
    switch (component.type) {
      case "colorPalette":
        return "Color Palette Selection";
      case "fontPairing":
        return "Font Pairing Selection";
      case "layout":
        return "Layout Selection";
      case "designStyle":
        return "Design Style Selection";
      default:
        return "Interactive Component";
    }
  };

  return (
    <Card className="my-4 overflow-hidden">
      <div
        className="p-3 border-b bg-muted/40 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-medium flex items-center gap-2">
          {getTitle()}
          {selectedValue && (
            <span className="bg-primary/20 text-primary rounded-full text-xs px-2 py-0.5 flex items-center gap-1">
              <Check className="h-3 w-3" /> Selected
            </span>
          )}
        </h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <CardContent className="p-4">
          {renderComponent()}

          {showActions && (
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                disabled={!selectedValue}
                onClick={handleSubmit}
              >
                Confirm Selection
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
