import React from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TextFormats, TextFormatAction } from "@/types/editor";

interface TextFormatBarProps {
  position: { x: number; y: number };
  isActive: boolean;
  onFormat: (action: TextFormatAction) => void;
  currentFormats: TextFormats;
}

const TextFormatBar: React.FC<TextFormatBarProps> = ({
  position,
  isActive,
  onFormat,
  currentFormats,
}) => {
  // Prevent clicks from triggering blur
  const handleButtonClick = (e: React.MouseEvent, action: TextFormatAction) => {
    e.preventDefault();
    e.stopPropagation();
    onFormat(action);
  };

  return (
    <TooltipProvider>
      <div
        className="fixed z-[60] rounded-lg shadow-lg p-1 flex gap-1 transition-all duration-200 format-bar bg-white"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? "auto" : "none",
          transform: `translateY(${isActive ? "0" : "10px"})`,
          border: "1px solid rgba(0,0,0,0.1)",
        }}
        onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking the format bar
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={currentFormats.bold ? "bg-accent" : ""}
              onMouseDown={(e) => handleButtonClick(e, { type: "bold" })}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={currentFormats.italic ? "bg-accent" : ""}
              onMouseDown={(e) => handleButtonClick(e, { type: "italic" })}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={currentFormats.underline ? "bg-accent" : ""}
              onMouseDown={(e) => handleButtonClick(e, { type: "underline" })}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>

        <div className="flex gap-1 border-l pl-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={
                  currentFormats.alignment === "left" ? "bg-accent" : ""
                }
                onMouseDown={(e) =>
                  handleButtonClick(e, { type: "align", value: "left" })
                }
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={
                  currentFormats.alignment === "center" ? "bg-accent" : ""
                }
                onMouseDown={(e) =>
                  handleButtonClick(e, { type: "align", value: "center" })
                }
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={
                  currentFormats.alignment === "right" ? "bg-accent" : ""
                }
                onMouseDown={(e) =>
                  handleButtonClick(e, { type: "align", value: "right" })
                }
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onFormat({ type: "size", value: "sm" });
              }}
            >
              Small
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onFormat({ type: "size", value: "base" });
              }}
            >
              Normal
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onFormat({ type: "size", value: "lg" });
              }}
            >
              Large
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

export default TextFormatBar;
