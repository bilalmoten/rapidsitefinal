"use client";

import React, { KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "ai";
import ReactMarkdown from "react-markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  isListening: boolean;
  isChatActive: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onVoiceInput: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  isLoading,
  isListening,
  isChatActive,
  onInputChange,
  onSubmit,
  onVoiceInput,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-3 max-w-[85%] ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  className={`${
                    message.role === "user"
                      ? "bg-blue-600"
                      : "bg-secondary border-2 border-primary/10"
                  } h-8 w-8`}
                >
                  <AvatarFallback>
                    {message.role === "assistant" ? "AI" : "ME"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-secondary/50 border border-primary/10"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown className="prose dark:prose-invert max-w-none text-sm">
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Hmm, Let me think about that...
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form
          onSubmit={onSubmit}
          className="container flex gap-3 p-4 max-w-5xl mx-auto"
        >
          <div className="flex-1 relative">
            <Textarea
              placeholder={
                isChatActive
                  ? "Type your message here..."
                  : "Chat session completed"
              }
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              className="min-h-[56px] w-full resize-none bg-secondary/50 border-primary/10 focus-visible:ring-1 focus-visible:ring-offset-1"
              rows={1}
              disabled={!isChatActive || isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !isChatActive || !input.trim()}
              className="h-[56px] w-[56px] bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>

            {/* <TooltipProvider delayDuration={30}>
              <Tooltip>
                <TooltipTrigger asChild> */}
            <div className="relative inline-block cursor-not-allowed">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-[56px] w-[56px] opacity-50 pointer-events-none"
                disabled={true}
              >
                <Mic className="h-5 w-5" />
                <div className="absolute -top-1 -right-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
              </Button>
            </div>
            {/* </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-sm">Voice input coming soon!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
