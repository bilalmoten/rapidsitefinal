// components/pro-chat/DesignStudio.tsx
"use client";

import React, { FC } from "react"; // Import FC for functional component type
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PaletteIcon,
  TextIcon as TypographyIcon, // Renamed import remains
  LayoutIcon,
  SparklesIcon,
  EyeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have this utility typed
import { motion } from "framer-motion";

// --- Type Definitions ---

export interface ColorPalette2 {
  id: string;
  name: string;
  colors: string[];
}

export interface FontPairing2 {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  headingClass: string; // e.g., 'font-serif'
  bodyClass: string; // e.g., 'font-sans'
}

export interface LayoutOption2 {
  id: string;
  name: string;
  description: string;
  sections?: string[]; // Optional if not directly used in this component
}

export interface DesignStyle2 {
  id: string;
  name: string;
  description: string;
  icon: string; // Or potentially a Lucide Icon component type
  keyElements?: string[]; // Optional if not directly used
}

// Interface for the main project information state
export interface ProjectInfo2 {
  purpose: string;
  targetAudience: string;
  designPreferences: string; // Corresponds to DesignStyle2 id
  colorScheme: string[];
  colorSchemeId?: string; // Optional: Track the selected palette ID if needed elsewhere
  inspirationImages: string[];
  typography: string; // Corresponds to FontPairing2 id
  layout: string; // Corresponds to LayoutOption2 id
}

// Props for the main DesignStudio component
interface DesignStudioProps {
  ProjectInfo2: ProjectInfo2;
  availablePalettes: ColorPalette2[];
  availableFontPairing2s: FontPairing2[];
  availableLayoutOption2s: LayoutOption2[];
  availableDesignStyle2s: DesignStyle2[];
  onPaletteChange: (palette: ColorPalette2) => void; // Expects the full palette object
  onFontChange: (fontId: string) => void; // Expects font pairing ID
  onLayoutChange: (layoutId: string) => void; // Expects layout ID
  onStyleChange: (styleId: string) => void; // Expects style ID
}

// Props for the helper preview components
interface SampleComponentProps {
  styles: ProjectInfo2;
  // Pass down the full data arrays to find the selected items inside helpers
  palettes: ColorPalette2[];
  FontPairing2s: FontPairing2[];
}
interface LayoutThumbnailProps {
  layoutId: string;
}

// --- Helper Preview Components (Typed) ---

const SampleButton: FC<SampleComponentProps> = ({ styles, palettes }) => {
  // Ensure fallbacks are type-compatible
  const fallbackPalette: ColorPalette2 = {
    id: "fallback",
    name: "Fallback",
    colors: ["#FFFFFF", "#F0F0F0", "#333333", "#666666", "#007BFF"],
  };
  const selectedPalette =
    palettes.find((p) => p.id === styles.colorSchemeId) || fallbackPalette;
  const primaryColor = selectedPalette.colors[3] ?? fallbackPalette.colors[4]; // Use ?? for nullish coalescing
  const textColor = selectedPalette.colors[0] ?? fallbackPalette.colors[0];

  const styleClasses: { [key: string]: string } = {
    minimalist: "rounded-md",
    corporate: "rounded-sm",
    creative: "rounded-full",
    playful: "rounded-lg shadow-md",
    modern: "rounded-md",
    classic: "rounded-sm border",
  };
  const borderRadiusClass =
    styleClasses[styles.designPreferences] || "rounded-md";

  return (
    <Button
      style={{ backgroundColor: primaryColor, color: textColor }}
      className={cn("transition-all", borderRadiusClass)}
    >
      Sample Button
    </Button>
  );
};

const SampleCard: FC<SampleComponentProps> = ({ styles, palettes }) => {
  const fallbackPalette: ColorPalette2 = {
    id: "fallback",
    name: "Fallback",
    colors: ["#FFFFFF", "#F0F0F0", "#333333", "#666666", "#007BFF"],
  };
  const selectedPalette =
    palettes.find((p) => p.id === styles.colorSchemeId) || fallbackPalette;
  const cardBg = selectedPalette.colors[1] ?? fallbackPalette.colors[1];
  const borderColor = selectedPalette.colors[3] ?? "transparent";

  const styleClasses: { [key: string]: string } = {
    minimalist: "rounded-lg shadow-sm border-transparent",
    corporate: "rounded-md shadow border",
    creative: "rounded-xl shadow-lg border-2",
    playful: "rounded-2xl shadow-md border",
    modern: "rounded-lg shadow-md",
    classic: "rounded-md border-2",
  };
  const cardStyleClass =
    styleClasses[styles.designPreferences] || "rounded-lg shadow-sm";

  return (
    <div
      className={cn("p-4 border transition-all", cardStyleClass)}
      style={{ backgroundColor: cardBg, borderColor: borderColor }}
    >
      <h4 className="font-semibold text-sm mb-1">Sample Card</h4>
      <p className="text-xs text-muted-foreground">This shows card styling.</p>
    </div>
  );
};

const SampleText: FC<SampleComponentProps> = ({
  styles,
  palettes,
  FontPairing2s,
}) => {
  const fallbackFontPair: FontPairing2 = {
    id: "fallback",
    name: "Fallback",
    headingFont: "System",
    bodyFont: "System",
    headingClass: "font-sans",
    bodyClass: "font-sans",
  };
  const fallbackPalette: ColorPalette2 = {
    id: "fallback",
    name: "Fallback",
    colors: ["#FFFFFF", "#F0F0F0", "#333333", "#666666", "#007BFF"],
  };

  const selectedFontPair =
    FontPairing2s.find((f) => f.id === styles.typography) || fallbackFontPair;
  const selectedPalette =
    palettes.find((p) => p.id === styles.colorSchemeId) || fallbackPalette;
  const headingColor = selectedPalette.colors[2] ?? fallbackPalette.colors[2];
  const bodyColor = selectedPalette.colors[3] ?? fallbackPalette.colors[3];

  return (
    <div>
      <h3
        className={cn("text-lg font-bold mb-1", selectedFontPair.headingClass)}
        style={{ color: headingColor }}
      >
        Sample Heading Text ({selectedFontPair.headingFont})
      </h3>
      <p
        className={cn("text-sm", selectedFontPair.bodyClass)}
        style={{ color: bodyColor }}
      >
        This is a paragraph demonstrating the body font (
        {selectedFontPair.bodyFont}). It should give a good feel for the
        typography selection.
      </p>
    </div>
  );
};

// Layout Thumbnail Component (Typed Props)
const LayoutThumbnail: FC<LayoutThumbnailProps> = ({ layoutId }) => {
  // Basic visual representation - enhance with more detail
  return (
    <div className="w-full h-16 border rounded bg-muted/30 flex flex-col items-center justify-center p-1 gap-1">
      <div className="w-full h-2 bg-muted rounded-sm"></div> {/* Header */}
      {layoutId === "classic" ? (
        <div className="flex w-full gap-1 flex-grow">
          <div className="w-2/3 h-full bg-muted rounded-sm"></div> {/* Main */}
          <div className="w-1/3 h-full bg-muted/50 rounded-sm"></div>{" "}
          {/* Sidebar */}
        </div>
      ) : layoutId === "grid" ? (
        <div className="grid grid-cols-3 gap-1 w-full flex-grow">
          <div className="bg-muted rounded-sm"></div>
          <div className="bg-muted rounded-sm"></div>
          <div className="bg-muted rounded-sm"></div>
          <div className="bg-muted rounded-sm"></div>
          <div className="bg-muted rounded-sm"></div>
          <div className="bg-muted rounded-sm"></div>
        </div>
      ) : (
        <div className="w-full h-full bg-muted rounded-sm flex-grow"></div> // Full Width Content
      )}
      <div className="w-full h-1 bg-muted rounded-sm mt-auto"></div>{" "}
      {/* Footer */}
    </div>
  );
};

// --- Main Design Studio Component (Typed) ---

const DesignStudio: FC<DesignStudioProps> = ({
  ProjectInfo2,
  availablePalettes,
  availableFontPairing2s,
  availableLayoutOption2s,
  availableDesignStyle2s,
  onPaletteChange,
  onFontChange,
  onLayoutChange,
  onStyleChange,
}) => {
  // Find the full objects for current selections, providing fallbacks
  const fallbackPalette: ColorPalette2 = availablePalettes[0] ?? {
    id: "default-fallback",
    name: "Default",
    colors: ["#FFFFFF", "#F0F0F0", "#333333", "#666666", "#007BFF"],
  };
  const fallbackFontPair: FontPairing2 = availableFontPairing2s[0] ?? {
    id: "default-fallback",
    name: "Default",
    headingFont: "System",
    bodyFont: "System",
    headingClass: "font-sans",
    bodyClass: "font-sans",
  };
  const fallbackLayout: LayoutOption2 = availableLayoutOption2s[0] ?? {
    id: "default-fallback",
    name: "Default",
    description: "Default Layout",
  };
  const fallbackStyle: DesignStyle2 = availableDesignStyle2s[0] ?? {
    id: "default-fallback",
    name: "Default",
    description: "Default Style",
    icon: "?",
  };

  // Try finding by matching color array content - more robust than ID if ID isn't stored
  const currentPalette =
    availablePalettes.find(
      (p) =>
        p.colors.length === ProjectInfo2.colorScheme.length &&
        p.colors.every(
          (color, index) => color === ProjectInfo2.colorScheme[index]
        )
    ) || fallbackPalette;

  const currentFontPair =
    availableFontPairing2s.find((f) => f.id === ProjectInfo2.typography) ||
    fallbackFontPair;
  const currentLayout =
    availableLayoutOption2s.find((l) => l.id === ProjectInfo2.layout) ||
    fallbackLayout;
  const currentStyle =
    availableDesignStyle2s.find(
      (s) => s.id === ProjectInfo2.designPreferences
    ) || fallbackStyle;

  // Shuffle Handlers (Types inferred correctly here)
  const handleShufflePalette = () => {
    const randomIndex = Math.floor(Math.random() * availablePalettes.length);
    const newPalette = availablePalettes[randomIndex];
    if (newPalette) {
      onPaletteChange(newPalette); // Pass the whole palette object
    }
  };

  const handleShuffleFonts = () => {
    const randomIndex = Math.floor(
      Math.random() * availableFontPairing2s.length
    );
    const newFontPair = availableFontPairing2s[randomIndex];
    if (newFontPair) {
      onFontChange(newFontPair.id);
    }
  };

  const handleShuffleStyle = () => {
    const randomIndex = Math.floor(
      Math.random() * availableDesignStyle2s.length
    );
    const newStyle = availableDesignStyle2s[randomIndex];
    if (newStyle) {
      onStyleChange(newStyle.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 md:p-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Column 1: Colors & Typography --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Color Palette Section */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PaletteIcon className="h-5 w-5 text-primary" />
                Color Palette
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShufflePalette}
                className="flex items-center gap-1"
              >
                <SparklesIcon className="h-3 w-3" /> Shuffle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Select a base palette for your site.
              </CardDescription>
              {/* Current Palette Display */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Current: {currentPalette.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentPalette.colors.map((color, index) => (
                    <div
                      key={`current-${index}-${color}`}
                      className="flex flex-col items-center text-xs text-muted-foreground"
                    >
                      <div
                        className="w-10 h-10 rounded-md border shadow-sm"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Palette Options */}
              <div>
                <p className="text-sm font-medium mb-2 mt-4">Choose Palette:</p>
                <div className="grid grid-cols-2 gap-3">
                  {availablePalettes.map((palette) => (
                    <button
                      key={palette.id}
                      onClick={() => onPaletteChange(palette)}
                      className={cn(
                        "p-2 border rounded-lg text-left hover:border-primary transition-colors",
                        currentPalette.id === palette.id
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-muted"
                      )}
                    >
                      <p className="text-xs font-semibold mb-1">
                        {palette.name}
                      </p>
                      <div className="flex gap-1">
                        {palette.colors.slice(0, 5).map(
                          (
                            color,
                            idx // Show first 5 colors
                          ) => (
                            <div
                              key={`${palette.id}-${idx}-${color}`}
                              className="w-4 h-4 rounded-sm"
                              style={{ backgroundColor: color }}
                            ></div>
                          )
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography Section */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TypographyIcon className="h-5 w-5 text-primary" />
                Typography
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShuffleFonts}
                className="flex items-center gap-1"
              >
                <SparklesIcon className="h-3 w-3" /> Shuffle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Choose fonts for headings and body text.
              </CardDescription>
              {/* Current Typography Preview */}
              <div className="border rounded-lg p-4 bg-background">
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    currentFontPair.headingClass
                  )}
                >
                  Aa - {currentFontPair.headingFont}
                </h3>
                <p className={cn("text-sm", currentFontPair.bodyClass)}>
                  The quick brown fox jumps over the lazy dog. (
                  {currentFontPair.bodyFont})
                </p>
              </div>
              {/* Font Pairing Options */}
              <div>
                <p className="text-sm font-medium mb-2 mt-4">
                  Choose Font Pairing:
                </p>
                <div className="space-y-2">
                  {availableFontPairing2s.map((pairing) => (
                    <Button
                      key={pairing.id}
                      variant={
                        currentFontPair.id === pairing.id
                          ? "secondary"
                          : "outline"
                      }
                      className="w-full justify-start h-auto py-2"
                      onClick={() => onFontChange(pairing.id)}
                    >
                      <div>
                        <p className="font-semibold text-sm">{pairing.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {pairing.headingFont} / {pairing.bodyFont}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Column 2: Style & Layout --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Design Style Section */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <LayoutIcon className="h-5 w-5 text-primary rotate-90" />{" "}
                {/* Using LayoutIcon creatively */}
                Visual Style
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleShuffleStyle}
                className="flex items-center gap-1"
              >
                <SparklesIcon className="h-3 w-3" /> Shuffle
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>Select the overall aesthetic.</CardDescription>
              <div className="grid grid-cols-2 gap-3">
                {availableDesignStyle2s.map((style) => (
                  <Button
                    key={style.id}
                    variant={
                      currentStyle.id === style.id ? "default" : "outline"
                    }
                    className="h-auto py-3 flex flex-col items-center justify-center gap-2 text-center"
                    onClick={() => onStyleChange(style.id)}
                  >
                    <span className="text-2xl">{style.icon}</span>
                    <span className="text-xs font-medium">{style.name}</span>
                  </Button>
                ))}
              </div>
              {/* Display current style description */}
              <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
                <span className="font-medium">{currentStyle.name}:</span>{" "}
                {currentStyle.description}
              </div>
            </CardContent>
          </Card>

          {/* Layout Structure Section */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <LayoutIcon className="h-5 w-5 text-primary" />
                Layout Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>Choose the main page structure.</CardDescription>
              <div className="space-y-3">
                {availableLayoutOption2s.map((layout) => (
                  <button
                    key={layout.id}
                    className={cn(
                      "w-full p-3 border rounded-lg text-left hover:border-primary transition-all flex items-center gap-4",
                      currentLayout.id === layout.id
                        ? "border-primary ring-2 ring-primary/50 bg-secondary"
                        : "border-muted bg-background hover:bg-muted/50"
                    )}
                    onClick={() => onLayoutChange(layout.id)}
                  >
                    <div className="w-20 flex-shrink-0">
                      <LayoutThumbnail layoutId={layout.id} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{layout.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {layout.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Column 3: Component Preview --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <EyeIcon className="h-5 w-5 text-primary" />
                Component Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 bg-muted/30 p-4 rounded-b-lg">
              <SampleText
                styles={ProjectInfo2}
                palettes={availablePalettes}
                FontPairing2s={availableFontPairing2s}
              />
              <SampleButton
                styles={ProjectInfo2}
                palettes={availablePalettes}
                FontPairing2s={availableFontPairing2s}
              />
              <SampleCard
                styles={ProjectInfo2}
                palettes={availablePalettes}
                FontPairing2s={availableFontPairing2s}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignStudio;
