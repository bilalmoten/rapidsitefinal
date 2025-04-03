// components/advanced-chat/ChatInterface.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { ChatMessage } from "@/types/advanced-chat";
import { Copy, Check, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DebugInfo from "./DebugInfo";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  chatState: string; // Consider using the enum type here
  onSendMessage: (content: string, imageUrl?: string | null) => void;
  onInteractionSubmit: (messageId: string, data: any) => void; // Handles interaction result
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  error,
  chatState,
  onSendMessage,
  onInteractionSubmit,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = React.useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Function to copy chat to clipboard
  const copyChat = async () => {
    try {
      setCopying(true);

      // Format messages for copying
      const formattedChat = messages
        .map((msg) => {
          let role =
            msg.role === "user"
              ? "User"
              : msg.role === "assistant"
                ? "AI"
                : "System";

          // Clean message content (remove HTML comments)
          let content = msg.content.replace(/<!--.*?-->/g, "").trim();

          // Include metadata about interactive components if present
          if (msg.interactiveComponentData) {
            const componentType = msg.interactiveComponentData.type;
            const promptKey = msg.interactiveComponentData.promptKey;

            // For user messages with processed components, include the JSON data for completeness
            if (msg.role === "user" && msg.interactionProcessed) {
              // Extract JSON data from any hidden comments in the original content
              const jsonMatch = msg.content.match(
                /<!-- Selected (.*?) data: (.*?) -->/
              );
              if (jsonMatch && jsonMatch.length >= 3) {
                const dataType = jsonMatch[1];
                const jsonData = jsonMatch[2];
                content += `\n[Selected ${dataType}: ${jsonData}]`;
              }
            } else {
              content += `\n[Interactive Component: ${componentType} - ${promptKey || "unknown"}]`;
            }
          }

          return `${role}: ${content}\n`;
        })
        .join("\n");

      await navigator.clipboard.writeText(formattedChat);
      toast({
        title: "Chat copied to clipboard",
        description: `${messages.length} messages copied`,
      });
    } catch (err) {
      console.error("Failed to copy chat:", err);
      toast({
        variant: "destructive",
        title: "Failed to copy chat",
        description: "An error occurred while copying the chat to clipboard",
      });
    } finally {
      setCopying(false);
      // Show success icon briefly
      setTimeout(() => setCopying(false), 2000);
    }
  };

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Copy Chat Button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-background/80 backdrop-blur-sm"
          onClick={copyChat}
          disabled={copying || messages.length === 0}
        >
          {copying ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="text-xs">Copy Chat</span>
        </Button>
      </div>

      {/* Debug Button */}
      <div className="absolute top-2 right-28 z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowDebug(!showDebug)}
        >
          <Bug className="h-3.5 w-3.5" />
          <span className="text-xs">Debug</span>
        </Button>
      </div>

      {/* Message List Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {showDebug && <DebugInfo />}
        <MessageList
          messages={messages}
          onInteractionSubmit={onInteractionSubmit}
        />
        {/* Display loading indicator at the end if needed globally */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start pl-2 pt-2">
            <div className="bg-muted rounded-full px-4 py-2 text-sm text-muted-foreground animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-3 md:p-4 bg-background/80 backdrop-blur-sm">
        {/* Display general error messages */}
        {error && (
          <div className="mb-2 p-2 text-center text-xs bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          isDisabled={
            chatState === "GENERATING" ||
            (chatState === "CONFIRMATION" && !isLoading)
          } // Disable input during final phases unless loading fails
        />
      </div>
    </div>
  );
};

export default ChatInterface;
