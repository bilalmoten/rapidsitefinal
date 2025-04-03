// components/advanced-chat/MessageList.tsx
"use client";

import React from "react";
import MessageDisplay from "./MessageDisplay";
import type { ChatMessage } from "@/types/advanced-chat";

interface MessageListProps {
  messages: ChatMessage[];
  onInteractionSubmit: (messageId: string, data: any) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  onInteractionSubmit,
}) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageDisplay
          key={message.id || `msg-${index}`} // Fallback key if ID is missing somehow
          message={message}
          onInteractionSubmit={onInteractionSubmit}
        />
      ))}
    </div>
  );
};

export default MessageList;
