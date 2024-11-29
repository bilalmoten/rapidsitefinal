import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

export const ChatMessageComponent = ({
  message,
  isTyping,
  progress,
}: {
  message: ChatMessage;
  isTyping: boolean;
  progress: number;
}) => {
  const displayContent = isTyping
    ? message.content.slice(0, Math.floor(message.content.length * progress))
    : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${
        message.role === "ai" ? "justify-start" : "justify-end"
      }`}
    >
      {message.role === "ai" && (
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-2">
          <Bot className="w-4 h-4 text-cyan-500" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          message.role === "ai"
            ? "bg-gray-800/50 text-gray-200"
            : "bg-cyan-500/20 text-gray-200"
        )}
      >
        <p className="text-sm whitespace-pre-line">{displayContent}</p>
      </div>
    </motion.div>
  );
};

export const ChatInterface = ({
  messages,
  currentMessageIndex,
  userMessageTiming,
  inputTypingProgress,
  nextMessage,
}: {
  messages: (ChatMessage & { progress: number })[];
  currentMessageIndex: number;
  userMessageTiming: {
    isTyping: boolean;
    isSending: boolean;
    isShowing: boolean;
  };
  inputTypingProgress: number;
  nextMessage?: ChatMessage;
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (userMessageTiming.isTyping && nextMessage?.role === "user") {
      setInputValue(
        nextMessage.content.slice(
          0,
          Math.floor(nextMessage.content.length * inputTypingProgress)
        )
      );
    } else if (userMessageTiming.isSending) {
      setInputValue(nextMessage?.content || "");
    } else {
      setInputValue("");
    }
  }, [userMessageTiming, inputTypingProgress, nextMessage]);

  return (
    <motion.div className="bg-[#0F1729] rounded-lg overflow-hidden border border-cyan-500/20 h-[600px]">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <ChatMessageComponent
              key={index}
              message={message}
              isTyping={index === currentMessageIndex && message.role === "ai"}
              progress={message.progress}
            />
          ))}
        </div>
        <div className="p-4 border-t border-cyan-500/20">
          <div className="flex gap-2">
            <Input
              className="bg-black/20 border-cyan-500/20"
              placeholder="Type your message..."
              value={inputValue}
              readOnly
            />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-all duration-300",
                userMessageTiming.isTyping && "opacity-50",
                userMessageTiming.isSending && "scale-90 opacity-50"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
