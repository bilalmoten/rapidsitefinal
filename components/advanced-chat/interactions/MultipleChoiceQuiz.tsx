// components/advanced-chat/interactions/MultipleChoiceQuiz.tsx
"use client";

import React, { useState, FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  MultipleChoiceProps,
  MultipleChoiceOption,
} from "@/types/advanced-chat";

const MultipleChoiceQuiz: FC<MultipleChoiceProps> = ({
  onSubmit,
  question,
  options = [],
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    // Immediately submit on selection for this simple component
    console.log("MultipleChoiceQuiz: Option selected, calling onSubmit with:", {
      value,
    });
    onSubmit({ value });
  };

  return (
    <Card className="w-full max-w-sm mx-auto my-2 shadow-sm border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Quick Question</CardTitle>
        {question && (
          <CardDescription className="text-xs">{question}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <Button
              key={option.value}
              variant="outline"
              className={cn(
                "w-full justify-start h-auto py-2 px-3 text-left",
                isSelected && "bg-secondary border-primary font-semibold"
              )}
              onClick={() => handleSelect(option.value)}
            >
              {isSelected ? (
                <CheckSquare className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
              ) : (
                <Square className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
              )}
              <span className="text-sm">{option.text}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceQuiz;
