import React, { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "ai";
import ReactMarkdown from "react-markdown";

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
  const getInitials = (role: string) => {
    return role === "assistant" ? "AI" : "ME";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="flex-1 overflow-hidden container mx-auto p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <Avatar
                className={`${
                  message.role === "user" ? "bg-primary" : "bg-secondary"
                }`}
              >
                <AvatarFallback>{getInitials(message.role)}</AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown className="prose dark:prose-invert max-w-none">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex space-x-2">
        <Textarea
          placeholder="Type your message here..."
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none"
          rows={3}
          disabled={!isChatActive || isLoading}
        />
        <div className="flex flex-col space-y-2">
          <Button type="submit" disabled={isLoading || !isChatActive}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onVoiceInput}
            disabled={!isChatActive || isLoading}
          >
            <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
            <span className="sr-only">Voice input</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
