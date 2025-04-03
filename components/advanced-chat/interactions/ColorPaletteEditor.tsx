// components/advanced-chat/interactions/ColorPaletteEditor.tsx
"use client";

import React, { useState, useEffect, FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaletteIcon, Check, Trash2, PlusCircle, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ColorPaletteEditorProps,
  ColorPaletteOption,
} from "@/types/advanced-chat";

const MAX_COLORS = 6;

const ColorPaletteEditor: FC<ColorPaletteEditorProps> = ({
  onSubmit,
  initialPalette,
  options = [],
}) => {
  // Initialize state with the initial palette or a default structure
  const [currentColors, setCurrentColors] = useState<string[]>(
    initialPalette?.colors || [
      "#FFFFFF",
      "#F0F0F0",
      "#6C757D",
      "#343A40",
      "#0D6EFD",
    ]
  );
  const [currentId, setCurrentId] = useState<string | undefined>(
    initialPalette?.id
  );
  const [currentName, setCurrentName] = useState<string | undefined>(
    initialPalette?.name
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(
    initialPalette?.id
  );
  const [customColorInput, setCustomColorInput] = useState<string>("#");
  const [inputError, setInputError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preset" | "custom">(
    options.length > 0 ? "preset" : "custom"
  );

  // Update local state if initialPalette prop changes
  useEffect(() => {
    if (initialPalette) {
      setCurrentColors(initialPalette.colors);
      setCurrentId(initialPalette.id);
      setCurrentName(initialPalette.name);
      setSelectedOptionId(initialPalette.id);
      // Switch tab if the initial palette looks custom (no matching ID in options)
      const isPreset = options.some((opt) => opt.id === initialPalette.id);
      setActiveTab(isPreset ? "preset" : "custom");
    }
  }, [initialPalette, options]);

  const handlePresetSelect = (palette: ColorPaletteOption) => {
    setCurrentColors([...palette.colors]); // Use spread to ensure new array reference
    setCurrentId(palette.id);
    setCurrentName(palette.name);
    setSelectedOptionId(palette.id);
    setActiveTab("preset"); // Ensure preset tab is active
  };

  const handleColorChange = (index: number, newColor: string) => {
    if (
      /^#[0-9A-Fa-f]{6}$/.test(newColor) ||
      /^#[0-9A-Fa-f]{3}$/.test(newColor)
    ) {
      const updatedColors = [...currentColors];
      updatedColors[index] = newColor.toUpperCase();
      setCurrentColors(updatedColors);
      setCurrentId(undefined); // Customizing removes preset ID
      setCurrentName("Custom Palette");
      setSelectedOptionId(undefined);
      setInputError(null); // Clear error on valid change
    } else {
      setInputError("Invalid HEX"); // Provide feedback
    }
  };

  const handleAddColor = () => {
    if (currentColors.length >= MAX_COLORS) {
      setInputError(`Max ${MAX_COLORS} colors allowed.`);
      return;
    }
    if (
      /^#[0-9A-Fa-f]{6}$/.test(customColorInput) ||
      /^#[0-9A-Fa-f]{3}$/.test(customColorInput)
    ) {
      setCurrentColors([...currentColors, customColorInput.toUpperCase()]);
      setCustomColorInput("#"); // Reset input
      setCurrentId(undefined);
      setCurrentName("Custom Palette");
      setSelectedOptionId(undefined);
      setInputError(null);
    } else {
      setInputError("Invalid HEX color format (e.g., #RRGGBB)");
    }
  };

  const handleRemoveColor = (index: number) => {
    if (currentColors.length <= 2) {
      setInputError("Minimum 2 colors required.");
      return; // Prevent removing below minimum
    }
    const updatedColors = currentColors.filter((_, i) => i !== index);
    setCurrentColors(updatedColors);
    setCurrentId(undefined);
    setCurrentName("Custom Palette");
    setSelectedOptionId(undefined);
    setInputError(null);
  };

  const handleSubmit = () => {
    if (currentColors.length < 2) {
      setInputError("Minimum 2 colors required.");
      return;
    }
    onSubmit({
      colors: currentColors,
      id: currentId,
      name: currentName || "Custom Palette",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <PaletteIcon className="h-4 w-4" /> Color Palette Selection
        </CardTitle>
        <CardDescription className="text-xs">
          Choose a preset or customize your colors. (Min 2, Max {MAX_COLORS})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "preset" | "custom")}
          className="w-full"
        >
          <TabsList
            className={cn(
              "grid w-full grid-cols-2 mb-3 h-8",
              options.length === 0 && "hidden"
            )}
          >
            <TabsTrigger value="preset" className="h-6 text-xs">
              Presets
            </TabsTrigger>
            <TabsTrigger value="custom" className="h-6 text-xs">
              Custom
            </TabsTrigger>
          </TabsList>

          {/* Preset Tab */}
          <TabsContent
            value="preset"
            className={cn("mt-0", options.length === 0 && "hidden")}
          >
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              {options.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => handlePresetSelect(palette)}
                  className={cn(
                    "p-2 border rounded-md text-left hover:border-primary transition-colors",
                    selectedOptionId === palette.id
                      ? "border-primary ring-1 ring-primary/50"
                      : "border-muted"
                  )}
                >
                  <p className="text-xs font-medium mb-1">{palette.name}</p>
                  <div className="flex gap-1">
                    {palette.colors.slice(0, 5).map((color, idx) => (
                      <div
                        key={`${palette.id}-opt-${idx}`}
                        className="w-3 h-3 rounded-sm border border-muted-foreground/20"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Custom Tab */}
          <TabsContent value="custom" className="mt-0 space-y-3">
            {/* Color Preview and Inputs */}
            <div className="flex flex-wrap gap-2 items-center border p-2 rounded-md bg-muted/30">
              {currentColors.map((color, index) => (
                <div key={`custom-${index}`} className="relative group">
                  <Input
                    type="color" // Use color picker input
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-10 h-10 p-0 border-0 cursor-pointer rounded-md shadow-sm appearance-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label={`Color ${index + 1}`}
                  />
                  {/* Remove Button */}
                  {currentColors.length > 2 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveColor(index)}
                      aria-label={`Remove color ${index + 1}`}
                    >
                      <Trash2 className="h-2 w-2" />
                    </Button>
                  )}
                </div>
              ))}
              {/* Add New Color Input */}
              {currentColors.length < MAX_COLORS && (
                <div className="flex items-center gap-1 ml-1">
                  <Input
                    type="text"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    onBlur={() => {
                      if (!customColorInput.startsWith("#"))
                        setCustomColorInput("#" + customColorInput);
                    }}
                    placeholder="#RRGGBB"
                    maxLength={7}
                    className={cn(
                      "w-20 h-8 text-xs",
                      inputError?.includes("HEX") && "border-destructive"
                    )}
                    aria-label="New HEX color"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddColor}
                    className="h-8 w-8"
                    aria-label="Add color"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {inputError && (
              <p className="text-xs text-destructive text-center">
                {inputError}
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          size="sm"
          className="w-full mt-4 text-xs h-8"
        >
          <Check className="h-3 w-3 mr-1" /> Use This Palette
        </Button>
      </CardContent>
    </Card>
  );
};

export default ColorPaletteEditor;
