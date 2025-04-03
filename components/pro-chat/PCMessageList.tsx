"use client";

import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MessageSquare,
  Bot,
  User,
  RefreshCcw,
  Palette,
  Type,
  Paintbrush,
  LayoutGrid,
  Check,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PCMessage,
  PCColorPalette,
  PCFontPairing,
  PCDesignStyle,
} from "@/hooks/useProChatStore";
import {
  PCColorPaletteSelector,
  PCFontPairingSelector,
  PCDesignStyleSelector,
  PCWebStructureSelector,
} from "./interactive";
import { PCMarkdownRenderer } from "./PCMarkdownRenderer";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PCMessageListProps {
  messages: PCMessage[];
  onSendMessage: (content: string) => void;
  onProcessInteractive: (messageId: string, data: any) => void;
  chatState: string;
  className?: string;
}

export const PCMessageList: React.FC<PCMessageListProps> = ({
  messages,
  onSendMessage,
  onProcessInteractive,
  chatState,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // When new messages come in, scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Add a function to copy chat to clipboard
  const copyChat = () => {
    // Create formatted text for copying
    const chatText = messages
      .filter((msg) => !msg.hidden && msg.role !== "system")
      .map((msg) => {
        const role = msg.role === "assistant" ? "AI" : "You";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    // Copy to clipboard
    navigator.clipboard.writeText(chatText).then(
      () => {
        toast({
          title: "Chat copied to clipboard",
          description:
            "The chat conversation has been copied to your clipboard.",
        });
      },
      (err) => {
        console.error("Could not copy chat: ", err);
        toast({
          title: "Failed to copy",
          description: "There was an error copying the chat to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  // Check if message contains a selection response
  const getSelectionType = (content: string) => {
    if (content.includes("color palette")) return "colorPalette";
    if (content.includes("font pairing") || content.includes("typography"))
      return "fontPairing";
    if (content.includes("design style")) return "designStyle";
    if (
      content.includes("website structure") ||
      content.includes("site structure") ||
      content.includes("structure with") ||
      content.includes("pages")
    )
      return "webStructure";
    return null;
  };

  // Extract selection data from message content
  const extractSelectionData = (content: string, type: string) => {
    // This is a simple extraction - in a real app, you'd use more robust pattern matching
    switch (type) {
      case "colorPalette":
        if (content.includes("colors:")) {
          const name =
            content.match(/selected the "([^"]+)"/)?.[1] ||
            content.match(/selected the ([^"]+) color/i)?.[1] ||
            "Selected Palette";
          return {
            name,
            colors: ["#FFFFFF", "#F0F4F8", "#90AFC5", "#336B87", "#2A3132"],
          };
        }
        break;
      case "fontPairing":
        if (content.includes("font") || content.includes("typography")) {
          const name =
            content.match(/selected the "([^"]+)"/)?.[1] ||
            content.match(/selected the ([^"]+) font/i)?.[1] ||
            "Selected Fonts";
          const headingMatch =
            content.match(/Heading: ([^,\n]+)/) ||
            content.match(/headings and ([^,\n]+) for body/i);
          const bodyMatch = content.match(/Body: ([^,\n]+)/);

          const bodyTextMatch = content.match(/for body text/i);
          const andBodyMatch = content.match(/and ([^,\n]+) for body/i);

          const bodyFontName = bodyMatch
            ? bodyMatch[1]
            : bodyTextMatch && andBodyMatch
              ? andBodyMatch[1]
              : "Body Font";

          return {
            name,
            headingFont: headingMatch?.[1] || "Heading Font",
            bodyFont: bodyFontName,
          };
        }
        break;
      case "designStyle":
        if (content.includes("style") || content.includes("design")) {
          const name =
            content.match(/selected the "([^"]+)"/)?.[1] ||
            content.match(/selected the ([^"]+) design/i)?.[1] ||
            "Selected Style";
          return {
            name,
            description:
              content.match(/description: ([^,\n]+)/)?.[1] ||
              content.match(/style - ([^,\n]+)/)?.[1] ||
              "A modern design style",
          };
        }
        break;
      case "webStructure":
        if (content.includes("structure") || content.includes("pages")) {
          const name =
            content.match(/selected the "([^"]+)"/)?.[1] ||
            content.match(/selected the ([^"]+) website structure/i)?.[1] ||
            content.match(/selected the ([^"]+) structure/i)?.[1] ||
            "Selected Structure";
          const pagesMatch = content.match(/with (\d+) pages/);
          const numPages = pagesMatch ? parseInt(pagesMatch[1]) : 3;

          // Return more detailed structure for display
          return {
            name,
            pages: numPages,
            pageNames: ["Home", "About", "Projects", "Contact"].slice(
              0,
              numPages
            ),
          };
        }
        break;
      default:
        return null;
    }
    return null;
  };

  // Render visual representation of selections
  const renderSelectionVisual = (message: PCMessage) => {
    const type = getSelectionType(message.content);
    if (!type) return null;

    const data = extractSelectionData(message.content, type);
    if (!data) return null;

    switch (type) {
      case "colorPalette":
        return (
          <div className="mt-3 p-3 bg-background border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{data.name} Selected</span>
            </div>
            <div className="flex space-x-1">
              {data.colors?.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        );
      case "fontPairing":
        return (
          <div className="mt-3 p-3 bg-background border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Type className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{data.name} Selected</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs">
                <span className="font-medium">Heading:</span> {data.headingFont}
              </p>
              <p className="text-xs">
                <span className="font-medium">Body:</span> {data.bodyFont}
              </p>
            </div>
          </div>
        );
      case "designStyle":
        return (
          <div className="mt-3 p-3 bg-background border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Paintbrush className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">
                {data.name} Style Selected
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{data.description}</p>
          </div>
        );
      case "webStructure":
        return (
          <div className="mt-3 p-3 bg-background border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">
                {data.name} Structure Selected
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Contains {data.pages || 0} pages with multiple sections
              </p>
              <div className="flex flex-wrap items-center gap-1 text-xs mt-1">
                {(data.pageNames || []).map((pageName, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-primary/10 rounded-full"
                  >
                    {pageName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render the interactive component based on type
  const renderInteractiveComponent = (message: PCMessage) => {
    if (!message.interactiveComponent || message.interactionProcessed)
      return null;

    const { promptKey } = message.interactiveComponent;

    switch (promptKey) {
      case "colorPalette":
        return (
          <PCColorPaletteSelector
            options={message.interactiveComponent?.props?.options || []}
            messageId={message.id}
            promptKey={promptKey}
            isReadOnly={false}
            onSubmit={(data) => {
              onProcessInteractive(message.id, { colorPalette: data });
            }}
          />
        );
      case "fontPairing":
        return (
          <PCFontPairingSelector
            options={message.interactiveComponent?.props?.options || []}
            messageId={message.id}
            promptKey={promptKey}
            isReadOnly={false}
            currentFontId={message.interactiveComponent?.props?.currentFontId}
            onSubmit={(data) => {
              onProcessInteractive(message.id, { fontPairing: data });
            }}
          />
        );
      case "designStyle":
        return (
          <PCDesignStyleSelector
            options={message.interactiveComponent?.props?.options || []}
            messageId={message.id}
            promptKey={promptKey}
            isReadOnly={false}
            onSubmit={(data) => {
              onProcessInteractive(message.id, { designStyle: data });
            }}
          />
        );
      case "webStructure":
        return (
          <PCWebStructureSelector
            options={message.interactiveComponent?.props?.options || []}
            messageId={message.id}
            promptKey={promptKey}
            isReadOnly={false}
            onSubmit={(data) => {
              onProcessInteractive(message.id, { webStructure: data });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className={cn(
        "flex flex-col gap-4 overflow-y-auto p-4 h-full relative",
        className
      )}
    >
      {/* Copy Chat Button */}
      {messages.length > 1 && (
        <div className="absolute top-4 right-4 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={copyChat}
                >
                  <Copy size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground h-full flex items-center justify-center">
          <p>No messages yet. Start chatting to begin building your website.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-3 items-start",
                message.role === "user" ? "justify-end ml-12" : "mr-12"
              )}
            >
              {message.role !== "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    {message.role === "assistant" ? (
                      <Bot size={16} />
                    ) : (
                      <MessageSquare size={16} />
                    )}
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={cn(
                  "p-3 relative break-words min-w-[120px]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "system"
                      ? "bg-muted text-muted-foreground"
                      : "bg-card"
                )}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2 p-2">
                    <RefreshCcw size={16} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <>
                    {/* Render message content with our custom markdown renderer */}
                    <PCMarkdownRenderer content={message.content} />

                    {/* Render visual selection data if present */}
                    {message.role === "user" && renderSelectionVisual(message)}

                    {/* Show quick reply options if available */}
                    {message.options && message.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.options.map((option, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="secondary"
                            className="text-xs flex items-center gap-1"
                            onClick={() =>
                              onSendMessage(
                                typeof option === "string"
                                  ? option
                                  : option.value
                              )
                            }
                          >
                            <span>
                              {typeof option === "string"
                                ? option
                                : option.text}
                            </span>
                            <ChevronRight size={14} />
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Render interactive components */}
                    {renderInteractiveComponent(message)}
                  </>
                )}
              </Card>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
