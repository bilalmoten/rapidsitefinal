"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Pencil, Wand2, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingControlsProps {
  isPickMode: boolean;
  isEditMode: boolean;
  togglePickMode: () => void;
  toggleEditMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPickMode,
  isEditMode,
  togglePickMode,
  toggleEditMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="border-t bg-background">
      <div className="flex items-center h-12 px-4">
        <div className="flex items-center gap-2">
          <Button
            variant={isEditMode ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleEditMode}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Manual Edit
          </Button>
          <Button
            variant={isPickMode ? "secondary" : "ghost"}
            size="sm"
            onClick={togglePickMode}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Edit
          </Button>

          <div className="h-4 w-[1px] bg-border mx-2" />

          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      !canUndo && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={onUndo}
                    disabled={!canUndo}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      !canRedo && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={onRedo}
                    disabled={!canRedo}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default FloatingControls;
