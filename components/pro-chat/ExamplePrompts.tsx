"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PCChatState } from "@/hooks/useProChatStore";

interface ExamplePromptsProps {
  chatState: PCChatState["chatState"];
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

// Example prompts based on chat state
const promptsByState: Record<PCChatState["chatState"], string[]> = {
  INTRODUCTION: [
    "I need a professional website for my consulting business",
    "I'm looking to create a portfolio website to showcase my work",
    "I need an e-commerce site to sell my handmade products",
    "Can you create a website for my restaurant?",
  ],
  GATHERING_PURPOSE: [
    "My target audience is young professionals aged 25-35",
    "I want visitors to book a consultation call with me",
    "The main goal is to showcase my portfolio and attract new clients",
    "I need to highlight our company's services and expertise",
  ],
  DEFINING_STYLE: [
    "I prefer a minimalist design with lots of whitespace",
    "I want a bold, colorful design that reflects our creative brand",
    "Our brand uses blue and white as primary colors",
    "I like the style of websites like [example.com]",
  ],
  CONTENT_PLANNING: [
    "I need these pages: Home, About, Services, Portfolio, and Contact",
    "Can you include a blog section in the website?",
    "I want a testimonials section to showcase client feedback",
    "The homepage should highlight our three main services",
  ],
  REFINEMENT: [
    "Can we make the call-to-action buttons more prominent?",
    "I'd like to see a different layout for the services section",
    "The hero section should include an image carousel",
    "Let's change the color scheme to something warmer",
  ],
  CONFIRMATION: [
    "I'm happy with everything, let's generate the website",
    "Can you summarize what the website will include?",
    "Let's review the website structure one more time",
    "Is there anything else I should add before we generate?",
  ],
  GENERATING: [
    "How long will the generation take?",
    "What will I be able to edit after generation?",
    "Will I receive a notification when it's ready?",
    "Can I make changes to the design later?",
  ],
  COMPLETE: [
    "How do I edit the content of my website?",
    "Can I add more pages later?",
    "How do I publish my website?",
    "How can I connect my custom domain?",
  ],
};

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({
  chatState,
  onSelectPrompt,
  className = "",
}) => {
  const currentPrompts = promptsByState[chatState];

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs text-muted-foreground">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {currentPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs py-1 h-auto"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
