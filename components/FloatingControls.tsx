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
    <header className="border rounded-lg border-neutral-70 relative backdrop-blur-xl m-4 bg-neutral-90/5 ">
      <div
        className="absolute inset-0 bg-gradient-to-br from-neutral-90 via-primary-dark to-primary-main opacity-10 
      rounded-lg"
      />
      <div className="flex h-14 items-center px-4 relative ">
        <Button
          variant={isEditMode ? "secondary" : "ghost"}
          size="sm"
          onClick={toggleEditMode}
          className={cn(
            "flex items-center gap-2 rounded-lg",
            isEditMode
              ? "bg-primary-main text-neutral-90 hover:bg-primary-main/90"
              : "text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/20"
          )}
        >
          <Pencil className="h-4 w-4" />
          Manual Edit
        </Button>
        <Button
          variant={isPickMode ? "secondary" : "ghost"}
          size="sm"
          onClick={togglePickMode}
          className={cn(
            "flex items-center gap-2 rounded-lg",
            isPickMode
              ? "bg-primary-main text-neutral-90 hover:bg-primary-main/90"
              : "text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/20"
          )}
        >
          <Wand2 className="h-4 w-4" />
          AI Edit
        </Button>

        <div className="h-6 w-[1px] bg-neutral-80/20 mx-1" />

        <div className="flex items-center gap-1 bg-neutral-90/30 rounded-lg p-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-md text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/20",
                    !canUndo &&
                      "opacity-30 cursor-not-allowed hover:text-neutral-30 hover:bg-transparent"
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
                    "h-7 w-7 rounded-md text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/20",
                    !canRedo &&
                      "opacity-30 cursor-not-allowed hover:text-neutral-30 hover:bg-transparent"
                  )}
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default FloatingControls;
