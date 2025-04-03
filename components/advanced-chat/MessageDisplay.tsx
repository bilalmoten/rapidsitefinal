// components/advanced-chat/MessageDisplay.tsx
"use client";

import React, { Suspense, lazy, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BotIcon,
  UserIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  Loader2,
  Palette,
  Type,
  ListTree,
} from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (tables, etc.)
import { cn } from "@/lib/utils";
import type {
  ChatMessage,
  InteractiveComponentData,
  SiteNode,
  FontPairingOption,
} from "@/types/advanced-chat";
import { InteractionComponentsMap } from "./interactions"; // Import the map
import { SiteStructureEditor } from "./interactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MessageDisplayProps {
  message: ChatMessage;
  onInteractionSubmit: (messageId: string, data: any) => void;
}

// --- Loading Spinner for Lazy Components ---
const InteractionLoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-4 my-2 border rounded-lg bg-muted/50">
    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    <span className="ml-2 text-sm text-muted-foreground">
      Loading component...
    </span>
  </div>
);

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  message,
  onInteractionSubmit,
}) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";
  const isError = isSystem && message.content.toLowerCase().includes("error");

  // For font pairings, load the fonts when the component mounts if needed
  useEffect(() => {
    if (
      message.interactiveComponentData?.type === "fontPairSelector" &&
      message.interactionProcessed
    ) {
      const { props } = message.interactiveComponentData;
      let fontFamilies: string[] = [];

      // Get fonts from either custom pairing or selected option
      if (props?.currentFontId === "custom" && props?.customPairingDetails) {
        fontFamilies = [
          props.customPairingDetails.headingFont,
          props.customPairingDetails.bodyFont,
        ].filter(Boolean);
        console.log("Loading custom fonts:", fontFamilies);
      } else if (props?.currentFontId) {
        const fontId = props.currentFontId;
        const fontOptions: FontPairingOption[] = props?.options || [];
        const selectedFont = fontOptions.find((opt) => opt.id === fontId);

        if (selectedFont) {
          fontFamilies = [
            selectedFont.headingFont,
            selectedFont.bodyFont,
          ].filter(Boolean);
          console.log("Loading selected font:", fontFamilies);
        } else {
          console.warn("Font not found in options:", fontId);
        }
      }

      // Force load fonts immediately with high priority
      if (fontFamilies.length) {
        console.log("MessageDisplay: Force loading fonts:", fontFamilies);

        fontFamilies.forEach((font) => {
          if (!font) return;

          // First remove any existing link elements for this font to avoid duplicates
          document
            .querySelectorAll('link[rel="stylesheet"]')
            .forEach((link) => {
              const href = link.getAttribute("href") || "";
              if (
                href.includes(`family=${font.replace(/ /g, "+")}`) ||
                href.includes(`family=${encodeURIComponent(font)}`)
              ) {
                link.remove();
                console.log("Removed existing font link for:", font);
              }
            });

          // Now add a fresh link element with preload
          const link = document.createElement("link");
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;700&display=swap`;
          link.rel = "stylesheet";
          link.setAttribute("data-priority", "high");
          document.head.appendChild(link);
          console.log("MessageDisplay: Loaded font with high priority:", font);
        });
      }
    }
  }, [message.interactiveComponentData, message.interactionProcessed]);

  // --- Render Interactive Component ---
  const renderInteractiveComponent = () => {
    const data = message.interactiveComponentData;
    if (!data) {
      console.log("No interactive component data found");
      return null; // Don't render if no data
    }

    console.log(
      "Rendering interactive component:",
      data.type,
      "for role:",
      message.role,
      "processed:",
      message.interactionProcessed
    );

    // If interaction already processed, show read-only versions for user messages
    // but hide them for assistant messages (since the user message will show the selection)
    if (message.interactionProcessed) {
      // For user messages, we want to show the read-only component
      if (isUser) {
        return renderReadOnlyComponent(data);
      }
      // For assistant messages that are processed, we don't show the component anymore
      // as the selection is shown in the user's message
      else if (isAssistant) {
        return null;
      }
    }

    // Only render active components for assistant messages
    if (!isAssistant) {
      return null;
    }

    // If not processed, render the interactive component normally
    const Component = InteractionComponentsMap[data.type];
    if (!Component) {
      console.warn(
        `Interactive component type "${data.type}" not found in map.`
      );
      return (
        <div className="my-2 p-2 text-xs bg-destructive/10 text-destructive rounded">
          Error: Unknown interactive component type '{data.type}'.
        </div>
      );
    }

    return (
      <Suspense fallback={<InteractionLoadingSpinner />}>
        <div className="mt-3 border-t pt-3">
          <Component
            {...data.props} // Spread the props from AI response
            onSubmit={(submissionData: any) => {
              // Construct the expected data structure based on promptKey
              const resultData = {
                [data.promptKey]: submissionData.value ?? submissionData,
              };
              console.log(
                "MessageDisplay: Interaction submitted. Calling onInteractionSubmit from parent with:",
                message.id,
                resultData
              );
              onInteractionSubmit(message.id, resultData);
            }}
          />
        </div>
      </Suspense>
    );
  };

  // Clean message content by removing JSON data meant only for AI
  const getCleanContent = () => {
    // Remove any HTML comments containing JSON data
    return message.content.replace(/<!--.*?-->/g, "").trim();
  };

  // Render read-only version of a component after it's been processed
  const renderReadOnlyComponent = (data: InteractiveComponentData) => {
    const { type, props, promptKey } = data;
    console.log(`Rendering read-only ${type} component with props:`, props);

    if (type === "siteStructureEditor") {
      const initialStructure = props?.initialStructure || [];
      return (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs text-muted-foreground mb-2 italic">
            ✓ Final website structure:
          </p>
          <SiteStructureEditor
            initialStructure={initialStructure}
            onSubmit={() => {}} // Empty submit function
            readOnly={true}
          />
        </div>
      );
    } else if (type === "colorPaletteEditor") {
      // Display read-only color palette
      const palette = props?.initialPalette ||
        props?.options?.[0] || { colors: [] };
      const colors = Array.isArray(palette.colors) ? palette.colors : [];

      return (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs text-muted-foreground mb-2 italic">
            ✓ Selected color palette:
          </p>
          <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card bg-opacity-80">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4" /> Color Palette
                {palette.name && (
                  <span className="text-xs text-muted-foreground">
                    ({palette.name})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 py-2">
                {colors.map((color: string, i: number) => (
                  <div
                    key={`${color}-${i}`}
                    className="w-8 h-8 rounded-md shadow-sm border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {colors.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No colors selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (type === "fontPairSelector") {
      // Display read-only font pairing
      const fontId = props?.currentFontId;
      let headingFont = "Unknown";
      let bodyFont = "Unknown";
      let pairingName = "Font Pairing";

      if (fontId === "custom" && props?.customPairingDetails) {
        // Use custom details stored in props
        headingFont =
          props.customPairingDetails.headingFont || "Unknown Custom";
        bodyFont = props.customPairingDetails.bodyFont || "Unknown Custom";
        pairingName = "Custom Font";
      } else {
        // Find pre-defined font details from options
        const fontOptions: FontPairingOption[] = props?.options || [];
        const selectedFont = fontOptions.find((opt) => opt.id === fontId);
        if (selectedFont) {
          headingFont = selectedFont.headingFont;
          bodyFont = selectedFont.bodyFont;
          pairingName = selectedFont.name;
        } else {
          // Fallback if ID doesn't match any option (should be rare)
          pairingName = `Font ID: ${fontId}`;
        }
      }

      return (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs text-muted-foreground mb-2 italic">
            ✓ Selected font pairing:
          </p>
          <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card bg-opacity-80">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Type className="h-4 w-4" /> {pairingName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Heading Font:
                </p>
                <p
                  className="text-base font-medium"
                  style={{
                    fontFamily:
                      headingFont !== "Unknown" &&
                      headingFont !== "Unknown Custom"
                        ? `"${headingFont}", sans-serif`
                        : "inherit",
                  }}
                >
                  {headingFont}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Body Font:</p>
                <p
                  className="text-sm"
                  style={{
                    fontFamily:
                      bodyFont !== "Unknown" && bodyFont !== "Unknown Custom"
                        ? `"${bodyFont}", sans-serif`
                        : "inherit",
                  }}
                >
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (type === "multipleChoice") {
      // Display read-only multiple choice selection
      const question = props?.question || "Selection";
      const options = props?.options || [];
      const selectedValue =
        message.content.match(/I've selected[:\s]+"(.*?)"/) ||
        message.content.match(/I've set the .* to: "(.*?)"/);
      const selectedText = selectedValue ? selectedValue[1] : "Selection made";

      return (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs text-muted-foreground mb-2 italic">
            ✓ Selected option:
          </p>
          <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card bg-opacity-80">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold">
                {question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-1 px-2 bg-primary/10 text-primary rounded-md text-sm">
                {selectedText}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default case - generic read-only notice without trying to render component
    return (
      <div className="mt-3 border-t pt-3">
        <p className="text-xs text-muted-foreground mb-2 italic">
          ✓ Selection saved
        </p>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 md:gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar */}
      {!isUser && !isSystem && (
        <Avatar className="h-8 w-8 md:h-9 md:w-9 border">
          {/* Add actual image source if available */}
          <AvatarFallback className="bg-primary/10 text-primary">
            <BotIcon size={18} />
          </AvatarFallback>
        </Avatar>
      )}
      {/* System Message Icon */}
      {isSystem && (
        <div
          className={cn(
            "h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center flex-shrink-0",
            isError
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isError ? (
            <AlertTriangleIcon size={18} />
          ) : (
            <CheckCircleIcon size={18} />
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3 py-2 md:px-4 md:py-2.5 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
          isSystem &&
            !isError &&
            "bg-blue-50 text-blue-800 border border-blue-200 shadow-none",
          isSystem &&
            isError &&
            "bg-red-50 text-red-800 border border-red-200 shadow-none"
        )}
      >
        {/* Typing Indicator */}
        {message.isTyping ? (
          <div className="flex items-center space-x-1 py-1">
            <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce"></span>
          </div>
        ) : (
          <>
            {/* Markdown Content - Use clean content to remove JSON data */}
            <div className="prose prose-sm max-w-none text-current prose-p:my-1 prose-headings:my-2 prose-strong:text-current">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {getCleanContent()}
              </ReactMarkdown>
            </div>

            {/* Show interactive component if it exists for any message role */}
            {message.interactiveComponentData && renderInteractiveComponent()}
          </>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="h-8 w-8 md:h-9 md:w-9 border">
          <AvatarFallback className="bg-secondary/20 text-secondary-foreground">
            <UserIcon size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageDisplay;
