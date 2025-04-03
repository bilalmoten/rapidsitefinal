// components/advanced-chat/interactions/FontPairSelector.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check, Type, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  FontPairSelectorProps,
  FontPairingOption,
} from "@/types/advanced-chat";

// Popular Google Fonts for headings and body
const POPULAR_HEADING_FONTS = [
  "Roboto",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Oswald",
  "Raleway",
  "Lora",
  "Merriweather",
  "Abril Fatface",
  "Bebas Neue",
  "Inter",
  "Lato",
  "Work Sans",
  "Archivo Black",
  "Josefin Sans",
  "Rubik",
];

const POPULAR_BODY_FONTS = [
  "Open Sans",
  "Roboto",
  "Lato",
  "Source Sans Pro",
  "Nunito",
  "Noto Sans",
  "PT Sans",
  "Raleway",
  "Montserrat",
  "Work Sans",
  "Inter",
  "Karla",
  "Mulish",
  "Quicksand",
];

// Load fonts for preview
const loadFonts = (fontFamilies: string[]) => {
  const filteredFonts = fontFamilies.filter(Boolean);
  const uniqueFonts = Array.from(new Set(filteredFonts));

  uniqueFonts.forEach((font) => {
    try {
      // Only load the font if it's not already loaded
      if (!document.querySelector(`link[href*="${font.replace(/ /g, "+")}"]`)) {
        const fontLink = document.createElement("link");
        fontLink.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
        console.log("Loaded font in selector:", font);
      }
    } catch (error) {
      console.error("Error loading font:", font, error);
    }
  });
};

const FontPairSelector = ({
  options,
  currentFontId,
  onSubmit,
  readOnly = false,
}: FontPairSelectorProps): JSX.Element => {
  const [selectedId, setSelectedId] = useState<string>(
    currentFontId || options[0]?.id
  );
  const [selectedOption, setSelectedOption] =
    useState<FontPairingOption | null>(
      options.find((opt) => opt.id === selectedId) || null
    );

  // For custom font selection
  const [customHeadingFont, setCustomHeadingFont] =
    useState<string>("Montserrat");
  const [customBodyFont, setCustomBodyFont] = useState<string>("Open Sans");
  const [useCustomFonts, setUseCustomFonts] = useState<boolean>(
    currentFontId === "custom"
  );

  // Initialize with custom font data if already selected
  useEffect(() => {
    if (currentFontId === "custom") {
      setUseCustomFonts(true);

      // Find custom font info from options
      const customOption = options.find((opt) => opt.id === "custom");
      if (customOption) {
        setCustomHeadingFont(customOption.headingFont || "Montserrat");
        setCustomBodyFont(customOption.bodyFont || "Open Sans");
      }
    }
  }, [currentFontId, options]);

  // Apply the selected font class
  const headingPreviewRef = useRef<HTMLDivElement>(null);
  const bodyPreviewRef = useRef<HTMLDivElement>(null);

  // Preload all popular fonts eagerly
  useEffect(() => {
    // Force immediate loading of all popular fonts
    loadFonts([...POPULAR_HEADING_FONTS, ...POPULAR_BODY_FONTS]);

    // Also load any fonts from the predefined options
    const optionFonts = options.flatMap((opt) => [
      opt.headingFont,
      opt.bodyFont,
    ]);
    loadFonts(optionFonts);
  }, [options]);

  // Force reload of custom fonts whenever they change
  useEffect(() => {
    if (useCustomFonts) {
      // Load custom fonts with high priority
      loadFonts([customHeadingFont, customBodyFont]);
    }
  }, [useCustomFonts, customHeadingFont, customBodyFont]);

  // Update the selected option when selectedId changes
  useEffect(() => {
    const option = options.find((opt) => opt.id === selectedId);
    if (option) {
      setSelectedOption(option);
      setUseCustomFonts(false);
    }
  }, [selectedId, options]);

  // Force load fonts immediately if in read-only mode
  useEffect(() => {
    if (readOnly) {
      let fontsToLoad: string[] = [];

      // Get fonts to load based on current selection
      if (currentFontId === "custom") {
        // Find custom font info from options
        const customOption = options.find((opt) => opt.id === "custom");
        if (customOption) {
          fontsToLoad = [
            customOption.headingFont,
            customOption.bodyFont,
          ].filter(Boolean) as string[];
        }
      } else {
        // Regular pre-defined font pair
        const option =
          options.find((opt) => opt.id === currentFontId) || options[0];
        if (option) {
          fontsToLoad = [option.headingFont, option.bodyFont].filter(
            Boolean
          ) as string[];
        }
      }

      if (fontsToLoad.length) {
        console.log(
          "FontPairSelector (read-only): Loading fonts with high priority:",
          fontsToLoad
        );

        // Force immediate loading with high priority
        fontsToLoad.forEach((font) => {
          if (!font) return;

          // Create a fresh link element
          const link = document.createElement("link");
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
          link.rel = "stylesheet";
          link.setAttribute("data-priority", "high");
          document.head.appendChild(link);

          // Also create a style element with !important to force the font
          const style = document.createElement("style");
          style.textContent = `
            [data-font="${font}"] {
              font-family: "${font}", sans-serif !important;
            }
          `;
          document.head.appendChild(style);

          console.log(
            "FontPairSelector: Loaded font with !important override:",
            font
          );
        });
      }
    }
  }, [readOnly, currentFontId, options]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setUseCustomFonts(false);
  };

  const handleCustomFontSelect = () => {
    setUseCustomFonts(true);
    setSelectedId("custom");
  };

  const handleSubmit = () => {
    console.log("FontPair - Submitting fontId:", selectedId);

    if (useCustomFonts) {
      // Create a custom font pairing
      const customPairing = {
        id: "custom",
        name: "Custom Font Pairing",
        headingFont: customHeadingFont || "Montserrat",
        bodyFont: customBodyFont || "Open Sans",
      };

      // Submit the custom font pairing (matching the expected interface)
      onSubmit({
        fontId: "custom",
        customPairing,
      });
    } else {
      // Submit just the fontId (matching the expected interface)
      onSubmit({ fontId: selectedId });
    }
  };

  // If in readOnly mode, just display the selected font
  if (readOnly) {
    // Handle custom font case specially
    if (currentFontId === "custom") {
      // Find the custom font info from options or use defaults
      const customOption = options.find((opt) => opt.id === "custom");

      const headingFont = customOption?.headingFont || "Custom Heading";
      const bodyFont = customOption?.bodyFont || "Custom Body";

      return (
        <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Type className="h-4 w-4" /> Custom Font
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium">Custom Font Pairing</h4>
                  <Check className="h-4 w-4 text-primary" />
                </div>

                {/* Font preview */}
                <div className="space-y-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Heading Font:
                    </p>
                    <p
                      data-font={headingFont}
                      className="text-base font-medium truncate"
                      style={{
                        fontFamily: `"${headingFont}", sans-serif !important`,
                        fontWeight: "bold",
                      }}
                    >
                      {headingFont}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Body Font:
                    </p>
                    <p
                      data-font={bodyFont}
                      className="text-sm truncate"
                      style={{
                        fontFamily: `"${bodyFont}", sans-serif !important`,
                      }}
                    >
                      The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Regular pre-defined font pair
    const option =
      options.find((opt) => opt.id === currentFontId) || options[0];

    return (
      <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Type className="h-4 w-4" /> Font Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">{option.name}</h4>
                <Check className="h-4 w-4 text-primary" />
              </div>

              {/* Font preview */}
              <div className="space-y-2 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Heading:</p>
                  <p
                    className="text-base font-medium truncate"
                    style={{
                      fontFamily: `"${option.headingFont}", sans-serif`,
                    }}
                  >
                    {option.headingFont}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Body:</p>
                  <p
                    className="text-sm truncate"
                    style={{ fontFamily: `"${option.bodyFont}", sans-serif` }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Type className="h-4 w-4" /> Font Selection
        </CardTitle>
        <CardDescription className="text-xs">
          Choose a font pairing that matches your site's style or customize your
          own.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sample text display */}
          <div className="p-3 bg-muted/20 rounded-lg text-center mb-4">
            <p className="text-sm">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          {/* Pre-defined font options */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin mb-4">
            {options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "border rounded-lg p-3 cursor-pointer transition-all",
                  selectedId === option.id && !useCustomFonts
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium">{option.name}</h4>
                  {selectedId === option.id && !useCustomFonts && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>

                {/* Font preview */}
                <div className="space-y-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Heading:
                    </p>
                    <p
                      className="text-base font-medium truncate"
                      style={{
                        fontFamily: `"${option.headingFont}", sans-serif`,
                      }}
                    >
                      {option.headingFont}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Body:</p>
                    <p
                      className="text-sm truncate"
                      style={{ fontFamily: `"${option.bodyFont}", sans-serif` }}
                    >
                      The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom font selection */}
          <div
            className={cn(
              "border rounded-lg p-3 cursor-pointer transition-all",
              useCustomFonts
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            )}
            onClick={handleCustomFontSelect}
          >
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium">Custom Font Selection</h4>
              {useCustomFonts && <Check className="h-4 w-4 text-primary" />}
            </div>

            {useCustomFonts && (
              <div className="space-y-4 mt-3">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Heading Font:
                  </label>
                  <Select
                    value={customHeadingFont}
                    onValueChange={(value) => setCustomHeadingFont(value)}
                  >
                    <SelectTrigger className="w-full bg-card border-muted">
                      <SelectValue placeholder="Select a heading font" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[var(--radix-select-content-available-height)] overflow-y-auto">
                      {POPULAR_HEADING_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: `"${font}", sans-serif` }}>
                            {font}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div
                    ref={headingPreviewRef}
                    className="mt-2 text-base font-medium p-2 bg-muted/30 rounded"
                    style={{
                      fontFamily: customHeadingFont
                        ? `"${customHeadingFont}", sans-serif`
                        : "inherit",
                    }}
                  >
                    This is how headings will look
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Body Font:
                  </label>
                  <Select
                    value={customBodyFont}
                    onValueChange={(value) => setCustomBodyFont(value)}
                  >
                    <SelectTrigger className="w-full bg-card border-muted">
                      <SelectValue placeholder="Select a body font" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[var(--radix-select-content-available-height)] overflow-y-auto">
                      {POPULAR_BODY_FONTS.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: `"${font}", sans-serif` }}>
                            {font}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div
                    ref={bodyPreviewRef}
                    className="mt-2 text-sm p-2 bg-muted/30 rounded"
                    style={{
                      fontFamily: customBodyFont
                        ? `"${customBodyFont}", sans-serif`
                        : "inherit",
                    }}
                  >
                    This is how paragraph text will appear on your website. The
                    body text should be highly readable at different sizes.
                  </div>
                </div>
              </div>
            )}

            {!useCustomFonts && (
              <p className="text-sm text-muted-foreground mt-2">
                Choose your own heading and body fonts
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full text-xs mt-4 bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={!selectedId && !useCustomFonts}
        >
          <Check className="h-3 w-3 mr-1" /> Confirm Font Selection
        </Button>
      </CardContent>
    </Card>
  );
};

export default FontPairSelector;
