"use client";

import React, { useEffect } from "react";
import { useAdvancedChatStore } from "@/hooks/useAdvancedChatStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, RefreshCw } from "lucide-react";

/**
 * Debug component to help diagnose issues with fonts and structure
 */
const DebugInfo = () => {
  const { projectBrief } = useAdvancedChatStore();

  // Debug logging
  useEffect(() => {
    console.log("DEBUG - Font pairing in store:", projectBrief.fontPairing);

    // Create a hidden element with the font to test if it's loading
    if (
      projectBrief.fontPairing.headingFont ||
      projectBrief.fontPairing.bodyFont
    ) {
      try {
        // Force load fonts again to ensure they're in the DOM
        const fontsToLoad = [
          projectBrief.fontPairing.headingFont,
          projectBrief.fontPairing.bodyFont,
        ].filter(Boolean) as string[];

        console.log("DEBUG - Attempting to force load fonts:", fontsToLoad);

        fontsToLoad.forEach((font) => {
          const fontLink = document.createElement("link");
          fontLink.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
          fontLink.rel = "stylesheet";
          document.head.appendChild(fontLink);
          console.log("DEBUG - Forced loaded font:", font);

          // Create a test span
          const testSpan = document.createElement("span");
          testSpan.style.fontFamily = `"${font}", sans-serif`;
          testSpan.style.visibility = "hidden";
          testSpan.textContent = "Font Test";
          document.body.appendChild(testSpan);

          // Check if font is applied
          const computedStyle = window.getComputedStyle(testSpan);
          console.log(
            `DEBUG - Font ${font} computed style:`,
            computedStyle.fontFamily
          );

          // Clean up
          document.body.removeChild(testSpan);
        });
      } catch (error) {
        console.error("DEBUG - Error loading fonts:", error);
      }
    }
  }, [projectBrief.fontPairing]);

  // Debug structure data
  useEffect(() => {
    console.log("DEBUG - Structure in store:", projectBrief.structure);
    if (projectBrief.structure && projectBrief.structure.length) {
      console.log("DEBUG - Structure count:", projectBrief.structure.length);
      console.log("DEBUG - First node:", projectBrief.structure[0]);
    } else {
      console.log("DEBUG - Structure is empty or undefined");
    }
  }, [projectBrief.structure]);

  // Force a refresh of fonts
  const forceRefreshFonts = () => {
    if (
      projectBrief.fontPairing.headingFont ||
      projectBrief.fontPairing.bodyFont
    ) {
      const fontsToLoad = [
        projectBrief.fontPairing.headingFont,
        projectBrief.fontPairing.bodyFont,
      ].filter(Boolean) as string[];

      // Clear existing font links for these fonts
      document
        .querySelectorAll(
          'link[rel="stylesheet"][href*="fonts.googleapis.com"]'
        )
        .forEach((link) => {
          const href = link.getAttribute("href") || "";
          fontsToLoad.forEach((font) => {
            if (href.includes(font.replace(/ /g, "+"))) {
              link.remove();
              console.log("DEBUG - Removed font link for:", font);
            }
          });
        });

      // Add new links
      fontsToLoad.forEach((font) => {
        const fontLink = document.createElement("link");
        fontLink.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
        console.log("DEBUG - Re-loaded font:", font);
      });

      // Force browser repaint
      document.body.style.opacity = "0.99";
      setTimeout(() => {
        document.body.style.opacity = "1";
      }, 100);
    }
  };

  return (
    <Card className="my-4 border-amber-300 bg-amber-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Bug size={16} /> Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs">
          <div>
            <h3 className="font-medium mb-1">Font Information:</h3>
            <div className="space-y-1 pl-2">
              <p>
                Heading Font: {projectBrief.fontPairing.headingFont || "None"}
              </p>
              <p>Body Font: {projectBrief.fontPairing.bodyFont || "None"}</p>
              <p>Font ID: {projectBrief.fontPairing.id || "None"}</p>

              {/* Test elements with the fonts */}
              <div className="mt-2 p-2 border rounded">
                <p className="mb-1">Heading Font Test:</p>
                <p
                  style={{
                    fontFamily: projectBrief.fontPairing.headingFont
                      ? `"${projectBrief.fontPairing.headingFont}", sans-serif`
                      : "inherit",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>

                <p className="mb-1 mt-2">Body Font Test:</p>
                <p
                  style={{
                    fontFamily: projectBrief.fontPairing.bodyFont
                      ? `"${projectBrief.fontPairing.bodyFont}", sans-serif`
                      : "inherit",
                    fontSize: "14px",
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-1">Structure Information:</h3>
            <div className="space-y-1 pl-2">
              <p>Structure Count: {projectBrief.structure?.length || 0}</p>
              {projectBrief.structure && projectBrief.structure.length > 0 ? (
                <div className="mt-1">
                  <p>
                    First Page: {projectBrief.structure[0]?.name || "Untitled"}
                  </p>
                  <p>
                    Child Sections:{" "}
                    {projectBrief.structure[0]?.children?.length || 0}
                  </p>
                </div>
              ) : (
                <p className="text-red-500">No structure defined in store</p>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2"
            onClick={forceRefreshFonts}
          >
            <RefreshCw size={12} className="mr-1" /> Force Refresh Fonts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
