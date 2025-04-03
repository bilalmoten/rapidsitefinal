"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal, PaperclipIcon, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PCMessageInputProps {
  onSendMessage: (content: string, imageUrl?: string | null) => Promise<void>;
  disabled?: boolean;
  isGenerating?: boolean;
  onGenerateWebsite?: () => Promise<void>;
  value?: string;
  onChange?: (value: string) => void;
}

export const PCMessageInput: React.FC<PCMessageInputProps> = ({
  onSendMessage,
  disabled = false,
  isGenerating = false,
  onGenerateWebsite,
  value,
  onChange,
}) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use either controlled or uncontrolled input
  const isControlled = value !== undefined && onChange !== undefined;
  const inputValue = isControlled ? value : message;

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (isControlled) {
      onChange(newValue);
    } else {
      setMessage(newValue);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || disabled) return;

    try {
      await onSendMessage(inputValue);
      if (isControlled) {
        onChange("");
      } else {
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="mx-auto max-w-4xl">
        <div
          className={`flex items-end gap-2 p-2 rounded-lg transition-all ${
            isFocused ? "bg-card border" : "bg-muted/50"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleChangeValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type your message..."
            className="min-h-[40px] max-h-[200px] flex-1 bg-transparent border-0 focus:ring-0 resize-none p-2 text-sm focus:outline-none"
            style={{ height: "40px", overflowY: "auto" }}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  disabled={disabled}
                >
                  <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Upload image (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AnimatePresence>
            {inputValue.trim() ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  disabled={disabled}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onGenerateWebsite}
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={disabled || isGenerating || !onGenerateWebsite}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {isGenerating ? "Generating..." : "Generate Website"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      Ready to create your website? Click to start generation!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
