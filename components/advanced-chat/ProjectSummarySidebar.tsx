// components/advanced-chat/ProjectSummarySidebar.tsx
"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  RocketIcon,
  Check,
  Info,
  Loader2,
  FileText,
  LayoutGrid,
} from "lucide-react";
import ProgressTracker from "./ProgressTracker"; // Import the progress tracker
import type { ProjectBrief } from "@/types/advanced-chat";
import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable content

interface ProjectSummarySidebarProps {
  brief: ProjectBrief;
  chatState: string; // Use the specific enum/type if defined globally
  onGenerate: () => void; // Function to trigger generation API call
  onClose?: () => void; // Optional: For mobile closing
}

// Add this function to load fonts
const loadFonts = (fontFamilies: string[]) => {
  const filteredFonts = fontFamilies.filter(Boolean);
  const uniqueFonts = Array.from(new Set(filteredFonts));

  uniqueFonts.forEach((font) => {
    try {
      const fontLink = document.createElement("link");
      fontLink.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
      console.log("Loaded font in sidebar:", font);
    } catch (error) {
      console.error("Error loading font:", font, error);
    }
  });
};

const ProjectSummarySidebar = ({
  brief,
  chatState,
  onGenerate,
  onClose,
}: ProjectSummarySidebarProps): JSX.Element => {
  console.log("ProjectSummarySidebar rendering with brief:", brief);
  console.log("ProjectSummarySidebar structure:", brief.structure);

  const isGenerating = chatState === "GENERATING";
  const isConfirmation = chatState === "CONFIRMATION";
  const canGenerate = isConfirmation || isGenerating; // Button active in confirmation/generating state

  // Load fonts for the sidebar
  useEffect(() => {
    if (brief.fontPairing?.headingFont || brief.fontPairing?.bodyFont) {
      const fontsToLoad = [
        brief.fontPairing.headingFont,
        brief.fontPairing.bodyFont,
      ].filter(Boolean) as string[];

      console.log("ProjectSummarySidebar: Loading fonts:", fontsToLoad);

      if (fontsToLoad.length === 0) {
        console.log(
          "ProjectSummarySidebar: No fonts specified in brief.fontPairing"
        );
        return;
      }

      // Immediately force load fonts with high priority
      fontsToLoad.forEach((font) => {
        // Remove any existing link elements for this font to avoid duplicates
        document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
          const href = link.getAttribute("href") || "";
          if (
            href.includes(`family=${font.replace(/ /g, "+")}`) ||
            href.includes(`family=${encodeURIComponent(font)}`)
          ) {
            link.remove();
            console.log("Removed existing font link for:", font);
          }
        });

        // Create a new link element with high priority
        const fontLink = document.createElement("link");
        fontLink.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
        fontLink.rel = "stylesheet";
        fontLink.setAttribute("data-priority", "high");
        document.head.appendChild(fontLink);
        console.log(
          "ProjectSummarySidebar: Loaded font with high priority:",
          font
        );

        // Also create a style element with !important to force the font
        const style = document.createElement("style");
        style.textContent = `
          [data-font="${font}"] {
            font-family: "${font}", sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      });
    } else {
      console.log(
        "ProjectSummarySidebar: No fonts specified in brief.fontPairing",
        brief.fontPairing
      );
    }
    // Add brief.fontPairing as a dependency to re-run when the object itself changes
  }, [brief.fontPairing]);

  // Monitor structure changes
  useEffect(() => {
    console.log(
      "SIDEBAR: Structure changed, now has",
      brief.structure?.length || 0,
      "top-level nodes"
    );

    // If structure exists, log its contents
    if (brief.structure && brief.structure.length > 0) {
      console.log(
        "SIDEBAR: Structure details:",
        `${brief.structure.length} pages:`,
        brief.structure
          .map(
            (page) => `${page.name} (${page.children?.length || 0} sections)`
          )
          .join(", ")
      );
    }
  }, [brief.structure]);

  // Helper to display list items gracefully
  const renderList = (items: string[], emptyText: string = "Not specified") => {
    if (!items || items.length === 0) {
      return (
        <span className="text-muted-foreground italic text-xs">
          {emptyText}
        </span>
      );
    }
    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-xs">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  // Helper to display sections/pages structure (improved hierarchical version)
  const renderStructure = (
    nodes: ProjectBrief["structure"],
    level: number = 0
  ) => {
    console.log(
      "SIDEBAR: Rendering structure with",
      nodes?.length || 0,
      "nodes at level",
      level
    );

    // Check if structure exists
    if (!nodes || nodes.length === 0 || nodes.some((node) => !node)) {
      console.warn("SIDEBAR: Structure invalid or empty:", nodes);
      return (
        <span className="text-muted-foreground italic text-xs">
          Structure not defined or empty
        </span>
      );
    }

    // Debug: Log the entire structure at the top level
    if (level === 0) {
      console.log(
        "SIDEBAR: Full structure for rendering:",
        JSON.stringify(nodes, null, 2)
      );
    }

    try {
      // Recursive rendering for a proper hierarchical display
      return (
        <ul
          className={`list-none space-y-0.5 ${level > 0 ? "pl-3 border-l border-muted ml-1" : ""}`}
        >
          {nodes.map((node) => (
            <li key={node.id} className="text-xs py-0.5">
              <div className="flex items-center gap-1">
                {/* Visual connector for nested items */}
                {level > 0 && <span className="text-muted-foreground">└─</span>}

                {/* Icon based on node type */}
                {node.type === "page" ? (
                  <FileText className="h-3 w-3 text-primary/70 mr-1" />
                ) : (
                  <LayoutGrid className="h-3 w-3 text-muted-foreground mr-1" />
                )}

                {/* Node name with appropriate styling */}
                <span
                  className={`${node.type === "page" ? "font-medium" : ""} truncate max-w-[150px]`}
                  title={node.name}
                >
                  {node.name ||
                    (node.type === "page"
                      ? "Untitled Page"
                      : "Untitled Section")}
                </span>

                {/* Type indicator */}
                <span className="text-[10px] text-muted-foreground">
                  ({node.type})
                </span>
              </div>

              {/* Render children recursively with proper indentation */}
              {node.children && node.children.length > 0 && (
                <div className="mt-1">
                  {renderStructure(node.children, level + 1)}
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    } catch (err) {
      console.error("SIDEBAR: Error rendering structure:", err);
      return (
        <span className="text-muted-foreground italic text-xs">
          Error rendering structure
        </span>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b sticky top-0 bg-card z-10">
        <h2 className="font-semibold text-base md:text-lg">Project Brief</h2>
        {onClose && ( // Show close button only if onClose handler is provided (for mobile)
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 md:h-8 md:w-8"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-3 md:p-4 space-y-5">
          {/* Progress Tracker */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Project Phase</h3>
            <ProgressTracker currentState={chatState} />
            {/* Contextual Info based on state */}
            <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-1">
              <Info size={12} />
              {chatState === "INTRODUCTION" && "Starting our conversation..."}
              {chatState === "GATHERING_PURPOSE" &&
                "Let's define the core purpose."}
              {chatState === "DEFINING_STYLE" &&
                "Focusing on the look and feel."}
              {chatState === "STRUCTURE_CONTENT" &&
                "Planning the pages and sections."}
              {chatState === "REFINEMENT" && "Adding details and content."}
              {chatState === "CONFIRMATION" &&
                "Please review the details below and confirm generation."}
              {chatState === "GENERATING" &&
                "Website generation is in progress..."}
              {chatState === "ERROR" && "An error occurred."}
            </p>
          </div>

          {/* Key Details */}
          <SummarySection title="Site Name">
            {brief.siteName || (
              <span className="text-muted-foreground italic text-xs">
                Untitled
              </span>
            )}
          </SummarySection>

          <SummarySection title="Purpose">
            {brief.purpose || (
              <span className="text-muted-foreground italic text-xs">
                Not specified
              </span>
            )}
          </SummarySection>

          <SummarySection title="Target Audience">
            {brief.targetAudience || (
              <span className="text-muted-foreground italic text-xs">
                Not specified
              </span>
            )}
          </SummarySection>

          <SummarySection title="Design Style">
            <span className="capitalize">
              {brief.designStyle || (
                <span className="text-muted-foreground italic text-xs">
                  Not specified
                </span>
              )}
            </span>
          </SummarySection>

          <SummarySection title="Color Palette">
            {brief.colorPalette.colors.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {brief.colorPalette.colors.map((color, index) => (
                  <div
                    key={`${color}-${index}`}
                    className="w-5 h-5 rounded border shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground italic text-xs">
                Not selected
              </span>
            )}
            {brief.colorPalette.name && (
              <p className="text-xs text-muted-foreground mt-1">
                {brief.colorPalette.name}
              </p>
            )}
          </SummarySection>

          <SummarySection title="Typography">
            {brief.fontPairing.id &&
            (brief.fontPairing.headingFont || brief.fontPairing.bodyFont) ? (
              <div className="space-y-1.5">
                <div>
                  <p className="text-xs flex items-center justify-between">
                    <strong>Heading:</strong>
                    <span
                      data-font={brief.fontPairing.headingFont}
                      className="font-medium"
                      style={{
                        fontFamily: brief.fontPairing.headingFont
                          ? `"${brief.fontPairing.headingFont}", sans-serif !important`
                          : "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      {brief.fontPairing.headingFont || "Not set"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs flex items-center justify-between">
                    <strong>Body:</strong>
                    <span
                      data-font={brief.fontPairing.bodyFont}
                      style={{
                        fontFamily: brief.fontPairing.bodyFont
                          ? `"${brief.fontPairing.bodyFont}", sans-serif !important`
                          : "inherit",
                      }}
                    >
                      {brief.fontPairing.bodyFont || "Not set"}
                    </span>
                  </p>
                </div>
                {!brief.fontPairing.headingFont &&
                  !brief.fontPairing.bodyFont && (
                    <p className="text-xs text-amber-500 italic">
                      Font details incomplete
                    </p>
                  )}
                {brief.fontPairing.id === "custom" && (
                  <p className="text-xs text-primary italic mt-1">
                    Custom Font Pairing
                  </p>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground italic text-xs">
                Not selected
              </span>
            )}
          </SummarySection>

          <SummarySection title="Site Structure">
            {renderStructure(brief.structure)}
          </SummarySection>

          {/* Optional: Snippets, Inspiration */}
          {/*
            <SummarySection title="Key Content Snippets">
                // Display snippets...
            </SummarySection>
             <SummarySection title="Inspiration">
                 {renderList(brief.inspirationUrls, "No URLs added")}
                {renderList(brief.inspirationImages.map(img => img.name), "No Images added")}
            </SummarySection>
           */}
        </div>
      </ScrollArea>

      {/* Footer - Generate Button */}
      <div className="p-3 md:p-4 border-t sticky bottom-0 bg-card z-10">
        <Button
          className="w-full"
          size="lg"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating} // Disable if not in confirmation state or already generating/loading
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <RocketIcon className="mr-2 h-4 w-4" /> Confirm & Generate Website
            </>
          )}
        </Button>
        {!canGenerate && (
          <p className="text-xs text-muted-foreground mt-2 text-center italic">
            Complete the chat to enable generation.
          </p>
        )}
      </div>
    </div>
  );
};

// Helper component for consistent section styling
const SummarySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element => (
  <div>
    <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">
      {title}
    </h3>
    <div className="text-sm bg-muted/40 rounded px-2 py-1.5 min-h-[28px]">
      {children}
    </div>
  </div>
);

export default ProjectSummarySidebar;
