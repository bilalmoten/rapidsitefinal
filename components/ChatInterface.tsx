"use client";

import React, { KeyboardEvent, useRef, useEffect } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [input]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
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
                    className={`rounded-2xl px-4 py-2 shadow-sm ${
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
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={onSubmit} className="p-4">
          <div className="flex gap-3 bg-secondary/50 rounded-lg p-2">
            <Textarea
              ref={textareaRef}
              placeholder={
                isChatActive
                  ? "Type your message here... (Shift + Enter for new line)"
                  : "Chat session completed"
              }
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-[200px] w-full resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto"
              disabled={!isChatActive || isLoading}
            />

            <div className="flex flex-col gap-2 self-end">
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !isChatActive || !input.trim()}
                className="h-11 w-11 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span className="sr-only">Send message</span>
              </Button>

              <div className="relative inline-block cursor-not-allowed">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 opacity-50 pointer-events-none rounded-lg"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
