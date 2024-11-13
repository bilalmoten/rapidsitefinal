"use client";

import React from "react";
import { MessageSquare, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const ChatWindow: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className="group flex items-center gap-2 rounded-lg border bg-background shadow-lg hover:bg-secondary/80"
            >
              <MessageSquare className="h-4 w-4" />
              <Lock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">AI Assistant</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[250px]">
            <p>Coming Soon! AI Assistant will help you:</p>
            <ul className="mt-1 text-xs list-disc list-inside text-muted-foreground">
              <li>Edit and generate content</li>
              <li>Optimize your website</li>
              <li>Get real-time suggestions</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ChatWindow;
