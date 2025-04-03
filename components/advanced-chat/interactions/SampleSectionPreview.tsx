// components/advanced-chat/interactions/SampleSectionPreview.tsx
"use client";

import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
// Corrected imports based on revised types file
import type {
  SampleSectionPreviewProps,
  ProjectBrief,
  ColorPaletteOption,
  FontPairingOption,
} from "@/types/advanced-chat";

const SampleSectionPreview: FC<SampleSectionPreviewProps> = ({
  projectBrief,
  availablePalettes, // Pass these down or define fallback here
  availableFontPairings, // Pass these down or define fallback here
}) => {
  // --- Get resolved styles (provide robust fallbacks) ---
  const fallbackPalette: ColorPaletteOption = {
    id: "fallback-p",
    name: "Fallback",
    colors: ["#FFFFFF", "#F8F9FA", "#343A40", "#6C757D", "#0D6EFD"],
  };
  const fallbackFontPair: FontPairingOption = {
    id: "fallback-f",
    name: "Fallback",
    headingFont: "Inter",
    bodyFont: "Roboto",
    headingClass: "font-sans",
    bodyClass: "font-sans",
  };

  // Use the actual brief data, providing structured fallbacks
  const palette = projectBrief.colorPalette ?? fallbackPalette;
  const fontInfo = projectBrief.fontPairing; // This now contains id, fonts, and classes

  // Find the full font pair object using the ID stored in the brief.
  // This assumes availableFontPairings contains the options used to populate the brief.
  const fontPair =
    availableFontPairings?.find((f) => f.id === fontInfo?.id) ??
    fallbackFontPair;

  // Define colors based on palette structure (adjust indices as needed)
  const colors = palette.colors ?? fallbackPalette.colors;
  const bgColor = colors[0] ?? fallbackPalette.colors[0]; // Lightest for background
  const textColor = colors[3] ?? fallbackPalette.colors[3]; // Darker for text
  const headingColor = colors[4] ?? fallbackPalette.colors[4]; // Accent or darkest for heading
  const accentColor = colors[4] ?? fallbackPalette.colors[4]; // Accent for button/details

  // Style mapping (Simplified, expand as needed)
  const styleClasses: { [key: string]: { container: string; button: string } } =
    {
      minimalist: {
        container: "py-12 px-6",
        button: "rounded-md bg-opacity-90 hover:bg-opacity-100",
      },
      corporate: { container: "py-10 px-8", button: "rounded-sm" },
      creative: {
        container: "py-16 px-6 skew-y-1",
        button: "rounded-full px-6 shadow-lg",
      }, // Example skew
      playful: {
        container: "py-10 px-6 border-4 rounded-2xl",
        button: "rounded-lg shadow-md",
      },
      modern: { container: "py-12 px-6", button: "rounded-md" },
      classic: {
        container: "py-10 px-10 border-t border-b",
        button: "rounded-sm border",
      },
    };
  const selectedStyle =
    styleClasses[projectBrief.designStyle] ?? styleClasses.modern;

  return (
    <Card className="w-full max-w-lg mx-auto my-2 shadow-sm border bg-card overflow-hidden">
      <CardHeader className="pb-2 bg-muted/50">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Eye className="h-4 w-4" /> Style Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Simulated Section */}
        <div
          className={cn("transition-all", selectedStyle.container)}
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <h2
            // Use the headingClass from the resolved fontPair object
            className={cn(
              "text-2xl md:text-3xl font-bold mb-3 text-center",
              fontPair.headingClass
            )}
            style={{ color: headingColor }}
          >
            Example Section Headline ({fontPair.headingFont})
          </h2>
          <p
            // Use the bodyClass from the resolved fontPair object
            className={cn(
              "text-sm md:text-base text-center max-w-md mx-auto mb-6 opacity-80",
              fontPair.bodyClass
            )}
          >
            This is a sample paragraph showing how your text (
            {fontPair.bodyFont}) might look with the selected fonts and colors
            in a typical section layout.
          </p>
          <div className="text-center">
            <button
              className={cn(
                "inline-block text-sm font-medium py-2 px-5 transition-all transform hover:scale-105",
                selectedStyle.button // Apply style-specific button classes
              )}
              style={{
                backgroundColor: accentColor,
                color: bgColor, // Button text often contrasts with accent
                borderColor: accentColor, // Needed for outline/border styles
              }}
            >
              Call to Action
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SampleSectionPreview;
