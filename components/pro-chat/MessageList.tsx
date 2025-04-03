import React, { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import {
  User,
  Bot,
  Sparkles,
  MoreHorizontal,
  Check,
  ImageIcon,
  PaletteIcon,
  LayoutIcon,
  Type,
  Expand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { InteractiveMessage, InteractiveComponentProps } from "./interactions";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  options?: {
    text: string;
    value: string;
    isMultiSelect?: boolean;
  }[];
  imageUrl?: string | null;
  interactiveComponent?: InteractiveComponentProps;
  hidden?: boolean;
};

interface MessageListProps {
  messages: Message[];
  onOptionSelect?: (value: string, isMultiSelect?: boolean) => void;
  selectedOptions?: string[];
  projectInfo?: {
    purpose: string;
    targetAudience: string;
    designPreferences: string;
    colorScheme: string[];
    inspirationImages: string[];
  };
  onInteractionSubmit?: (
    messageId: string,
    type: string,
    value: string
  ) => void;
}

export function MessageList({
  messages,
  onOptionSelect,
  selectedOptions = [],
  projectInfo,
  onInteractionSubmit,
}: MessageListProps) {
  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Sparkles className="h-12 w-12 text-primary/20 mb-4" />
        <p className="text-lg text-center font-medium mb-2">
          Start Your Creative Journey
        </p>
        <p className="text-muted-foreground text-center max-w-md">
          Share your vision and preferences to create your perfect website
        </p>
      </div>
    );
  }

  // Helper to check if the message content contains specific text related to image uploads
  const hasImageUploadText = (content: string) => {
    return (
      content.toLowerCase().includes("uploaded an image") ||
      content.toLowerCase().includes("image for reference") ||
      content.toLowerCase().includes("i'd like to use this image")
    );
  };

  return (
    <div className="space-y-6">
      {messages
        .filter((message) => !message.hidden)
        .map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {message.isTyping ? (
              <TypingIndicator />
            ) : (
              <div
                className={cn(
                  "group relative",
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                <div
                  className={cn(
                    "flex items-start gap-3 max-w-3xl",
                    message.role === "user" ? "ml-auto" : ""
                  )}
                >
                  {message.role !== "user" && (
                    <Avatar className="h-9 w-9 border bg-primary/10 mt-0.5">
                      <AvatarFallback className="text-primary bg-primary/10">
                        <Bot size={18} />
                      </AvatarFallback>
                      <AvatarImage src="/avatars/bot.png" alt="AI" />
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "flex-1",
                      message.role === "user" ? "text-right" : ""
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {message.role === "user" ? "You" : "RapidSite AI"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "relative",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border",
                        "px-4 py-3 rounded-xl shadow-sm overflow-hidden"
                      )}
                    >
                      <MessageContent
                        content={message.content}
                        isTyping={message.isTyping}
                        imageUrl={message.imageUrl}
                      />
                    </div>

                    {/* Render interactive components if present */}
                    {message.interactiveComponent && onInteractionSubmit && (
                      <div className="mt-4">
                        <InteractiveMessage
                          component={message.interactiveComponent}
                          onSubmit={(type, value) =>
                            onInteractionSubmit(message.id, type, value)
                          }
                        />
                      </div>
                    )}

                    {message.options &&
                      message.options.length > 0 &&
                      onOptionSelect && (
                        <div className="mt-3 flex flex-wrap gap-2 justify-start">
                          {message.options.map((option, idx) => {
                            const isSelected = selectedOptions.includes(
                              option.value
                            );
                            const isMultiSelect = !!option.isMultiSelect;

                            return (
                              <Button
                                key={idx}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "rounded-full border-muted-foreground/20 transition-colors",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted/50 hover:bg-primary/10 hover:text-primary"
                                )}
                                onClick={() =>
                                  onOptionSelect(option.value, isMultiSelect)
                                }
                              >
                                {isMultiSelect && (
                                  <span
                                    className={cn(
                                      "mr-1.5 flex h-4 w-4 items-center justify-center rounded-full border",
                                      isSelected
                                        ? "bg-primary-foreground border-primary-foreground"
                                        : "border-muted-foreground/30"
                                    )}
                                  >
                                    {isSelected && (
                                      <Check className="h-2.5 w-2.5 text-primary" />
                                    )}
                                  </span>
                                )}
                                {option.text}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-9 w-9 border bg-muted mt-0.5">
                      <AvatarFallback className="bg-muted text-foreground">
                        <User size={18} />
                      </AvatarFallback>
                      <AvatarImage src="/avatars/user.png" alt="User" />
                    </Avatar>
                  )}
                </div>

                {message.role === "user" &&
                  index > 0 &&
                  projectInfo &&
                  shouldShowProjectUpdate(message.content, projectInfo) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 max-w-sm mr-4 ml-auto"
                    >
                      <Card className="bg-muted/30 border-muted-foreground/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Sparkles className="h-3 w-3" />
                            <span>Project Detail Updated</span>
                          </div>
                          <p className="text-sm font-medium">
                            {getProjectUpdateMessage(
                              message.content,
                              projectInfo
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
              </div>
            )}
          </motion.div>
        ))}
    </div>
  );
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-3xl animate-pulse">
      <Avatar className="h-9 w-9 border bg-primary/10 mt-0.5">
        <AvatarFallback className="text-primary bg-primary/10">
          <Bot size={18} />
        </AvatarFallback>
      </Avatar>

      <div className="py-3 px-4 rounded-xl bg-card border shadow-sm">
        <div className="flex items-center space-x-2">
          <div
            className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
            style={{ animationDelay: "600ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Helper to check if a project update notification should be shown
function shouldShowProjectUpdate(message: string, projectInfo: any): boolean {
  const lowercaseMessage = message.toLowerCase();

  // Check for purpose updates
  if (
    projectInfo.purpose &&
    (lowercaseMessage.includes("business") ||
      lowercaseMessage.includes("portfolio") ||
      lowercaseMessage.includes("ecommerce") ||
      lowercaseMessage.includes("store"))
  ) {
    return true;
  }

  // Check for color updates
  if (
    projectInfo.colorScheme.length > 0 &&
    (lowercaseMessage.includes("color") ||
      lowercaseMessage.includes("blue") ||
      lowercaseMessage.includes("red") ||
      lowercaseMessage.includes("green") ||
      lowercaseMessage.includes("purple") ||
      lowercaseMessage.includes("yellow"))
  ) {
    return true;
  }

  // Check for design style updates
  if (
    projectInfo.designPreferences &&
    (lowercaseMessage.includes("minimalist") ||
      lowercaseMessage.includes("creative") ||
      lowercaseMessage.includes("corporate") ||
      lowercaseMessage.includes("bold") ||
      lowercaseMessage.includes("style"))
  ) {
    return true;
  }

  return false;
}

// Get the appropriate update message
function getProjectUpdateMessage(message: string, projectInfo: any): string {
  const lowercaseMessage = message.toLowerCase();

  if (
    projectInfo.purpose &&
    (lowercaseMessage.includes("business") ||
      lowercaseMessage.includes("portfolio") ||
      lowercaseMessage.includes("store"))
  ) {
    return `Website purpose set to: ${projectInfo.purpose}`;
  }

  if (
    projectInfo.designPreferences &&
    lowercaseMessage.includes(projectInfo.designPreferences.toLowerCase())
  ) {
    return `Design style set to: ${projectInfo.designPreferences}`;
  }

  if (
    projectInfo.colorScheme.length > 0 &&
    (lowercaseMessage.includes("color") ||
      lowercaseMessage.includes("blue") ||
      lowercaseMessage.includes("red"))
  ) {
    return `Color palette updated`;
  }

  if (
    lowercaseMessage.includes("image") ||
    lowercaseMessage.includes("inspiration")
  ) {
    return "Inspiration image added to your project";
  }

  return "Project details updated";
}

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

// Add this new helper component for inline color visualization
const ColorSwatch = ({ color }: { color: string }) => {
  return (
    <span className="inline-flex items-center gap-1 mx-0.5 font-mono text-xs">
      <span
        className="inline-block w-3 h-3 rounded-sm border border-border"
        style={{ backgroundColor: color }}
      />
      {color}
    </span>
  );
};

// Add this function to parse the structured formats
const parseStructuredContent = (content: string) => {
  const result = {
    plainText: content,
    colorPalette: null as Record<string, string> | null,
    typography: null as any | null,
    layout: null as any | null,
    designStyle: null as any | null,
  };

  // Extract color palette using regex without 's' flag
  const colorPaletteMatch = content.match(/COLOR_PALETTE:\s*\{([\s\S]*?)\}/);
  if (colorPaletteMatch) {
    try {
      const paletteStr = `{${colorPaletteMatch[1]}}`;
      const palette = JSON.parse(
        paletteStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
      );
      result.colorPalette = palette;
      // Remove the structured format from the plain text
      result.plainText = result.plainText.replace(
        /COLOR_PALETTE:\s*\{([\s\S]*?)\}/,
        ""
      );
    } catch (e) {
      console.error("Failed to parse color palette:", e);
    }
  }

  // Extract typography using regex without 's' flag
  const typographyMatch = content.match(/TYPOGRAPHY:\s*\{([\s\S]*?)\}/);
  if (typographyMatch) {
    try {
      const typographyStr = `{${typographyMatch[1]}}`;
      const typography = JSON.parse(
        typographyStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
      );
      result.typography = typography;
      // Remove the structured format from the plain text
      result.plainText = result.plainText.replace(
        /TYPOGRAPHY:\s*\{([\s\S]*?)\}/,
        ""
      );
    } catch (e) {
      console.error("Failed to parse typography:", e);
    }
  }

  // Extract layout using regex without 's' flag
  const layoutMatch = content.match(/LAYOUT:\s*\{([\s\S]*?)\}/);
  if (layoutMatch) {
    try {
      const layoutStr = `{${layoutMatch[1]}}`;
      const layout = JSON.parse(
        layoutStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
      );
      result.layout = layout;
      // Remove the structured format from the plain text
      result.plainText = result.plainText.replace(
        /LAYOUT:\s*\{([\s\S]*?)\}/,
        ""
      );
    } catch (e) {
      console.error("Failed to parse layout:", e);
    }
  }

  // Extract design style using regex without 's' flag
  const designStyleMatch = content.match(/DESIGN_STYLE:\s*\{([\s\S]*?)\}/);
  if (designStyleMatch) {
    try {
      const designStyleStr = `{${designStyleMatch[1]}}`;
      const designStyle = JSON.parse(
        designStyleStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
      );
      result.designStyle = designStyle;
      // Remove the structured format from the plain text
      result.plainText = result.plainText.replace(
        /DESIGN_STYLE:\s*\{([\s\S]*?)\}/,
        ""
      );
    } catch (e) {
      console.error("Failed to parse design style:", e);
    }
  }

  return result;
};

// Modify the renderMessageContent function to fix type issues
const renderMessageContent = (content: string) => {
  // Parse any structured content
  const parsedContent = parseStructuredContent(content);

  // Clean up text content - replace markdown style formatting with proper formatting
  let cleanText = parsedContent.plainText;

  // Remove markdown-style formatting and replace with HTML
  // Remove ** for bold
  cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, "$1");

  // Remove * for italic
  cleanText = cleanText.replace(/\*(.*?)\*/g, "$1");

  // Clean up extra quotes from JSON-like structures that might remain
  cleanText = cleanText.replace(/\"\"(.*?)\"\"/g, '"$1"');

  // Replace hex color codes with color swatches
  const colorCodeRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;

  // Split by color codes and create an array of text and color elements
  const parts = cleanText.split(colorCodeRegex);
  const colorMatches = cleanText.match(colorCodeRegex) || [];

  const renderedContent: ReactNode[] = [];

  // Interleave text and color elements
  parts.forEach((part, index) => {
    if (part) {
      renderedContent.push(<span key={`text-${index}`}>{part}</span>);
    }
    if (index < colorMatches.length) {
      renderedContent.push(
        <ColorSwatch key={`color-${index}`} color={colorMatches[index]} />
      );
    }
  });

  // Render structured content visualizations
  return (
    <>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {renderedContent}
      </div>

      {/* Render color palette if available */}
      {parsedContent.colorPalette && (
        <Card className="mt-4 overflow-hidden border-primary/10">
          <CardHeader className="p-3 bg-muted/50">
            <CardTitle className="text-sm flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" />
              Suggested Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(parsedContent.colorPalette).map(
                ([key, color]) => (
                  <div key={key} className="flex flex-col items-center">
                    <div className="relative group">
                      <div
                        className="w-14 h-14 rounded-md shadow-sm ring-1 ring-inset ring-border cursor-pointer transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color as string }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <input
                            type="color"
                            value={color as string}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            onChange={(e) => {
                              // This would update state in a full implementation
                              console.log(
                                `Updated ${key} color:`,
                                e.target.value
                              );
                            }}
                          />
                          <div className="bg-background/70 text-foreground rounded-full p-1 backdrop-blur-sm">
                            <PaletteIcon className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium capitalize mt-2">
                      {key}
                    </span>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded mt-1">
                      {color as string}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                Click any color to customize
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Reset
                </Button>
                <Button variant="default" size="sm" className="text-xs h-7">
                  Apply Palette
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Render typography if available */}
      {parsedContent.typography && (
        <Card className="mt-4 overflow-hidden border-primary/10">
          <CardHeader className="p-3 bg-muted/50">
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-muted-foreground">
                    Heading Font:
                  </div>
                  <select
                    className="text-xs bg-muted p-1 rounded border border-border"
                    value={parsedContent.typography.headingFont}
                    onChange={(e) => {
                      // This would be hooked up to state in a full implementation
                      console.log("Heading font changed:", e.target.value);
                    }}
                  >
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Roboto Slab">Roboto Slab</option>
                    <option value="Merriweather">Merriweather</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: parsedContent.typography.headingFont }}
                >
                  {parsedContent.typography.sampleHeading}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-muted-foreground">
                    Body Font:
                  </div>
                  <select
                    className="text-xs bg-muted p-1 rounded border border-border"
                    value={parsedContent.typography.bodyFont}
                    onChange={(e) => {
                      // This would be hooked up to state in a full implementation
                      console.log("Body font changed:", e.target.value);
                    }}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Lora">Lora</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
                <div
                  className="text-sm"
                  style={{ fontFamily: parsedContent.typography.bodyFont }}
                >
                  {parsedContent.typography.sampleBody}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Reset
                </Button>
                <Button variant="default" size="sm" className="text-xs h-7">
                  Apply Typography
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Render layout if available */}
      {parsedContent.layout && (
        <Card className="mt-4 overflow-hidden border-primary/10">
          <CardHeader className="p-3 bg-muted/50">
            <CardTitle className="text-sm flex items-center gap-2">
              <LayoutIcon className="h-4 w-4" />
              Suggested Layout: {parsedContent.layout.type}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-sm mb-2">
              {parsedContent.layout.description}
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium mb-1">Sections:</div>
              <div className="grid grid-cols-1 gap-2">
                {parsedContent.layout.sections.map(
                  (section: string, idx: number) => (
                    <div key={idx} className="bg-muted/30 p-2 rounded text-xs">
                      {section}
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Render design style if available */}
      {parsedContent.designStyle && (
        <Card className="mt-4 overflow-hidden border-primary/10">
          <CardHeader className="p-3 bg-muted/50">
            <CardTitle className="text-sm flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" />
              {parsedContent.designStyle.name} Design Style
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-sm mb-3">
              {parsedContent.designStyle.description}
            </div>
            <div className="text-xs font-medium mb-1">Key Elements:</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {parsedContent.designStyle.keyElements.map(
                (element: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-muted/30 px-2 py-1 rounded-full text-xs"
                  >
                    {element}
                  </div>
                )
              )}
            </div>
            <div className="text-xs font-medium">Color Scheme:</div>
            <div className="text-sm">
              {parsedContent.designStyle.colorScheme}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

// Update the MessageContent component to use renderMessageContent
const MessageContent = ({
  content,
  isTyping,
  imageUrl,
}: {
  content: string;
  isTyping?: boolean;
  imageUrl?: string | null;
}) => {
  if (isTyping) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
        <div
          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Render content with enhanced formatting */}
      {renderMessageContent(content)}

      {/* Display image if present */}
      {imageUrl && (
        <div className="mt-2 relative">
          <div className="rounded-md overflow-hidden border border-border">
            <img
              src={imageUrl}
              alt="User uploaded image"
              className="max-w-full max-h-[300px] object-contain"
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full"
              onClick={() => window.open(imageUrl, "_blank")}
            >
              <Expand className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
