"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload, File, X } from "lucide-react";
import { showExtractionToast } from "@/components/notifications/ProjectToast";
import { cn } from "@/lib/utils";

interface FileUploadButtonProps {
  onFileSelected: (file: File | null, previewUrl: string | null) => void;
  fileType?: "image" | "all";
  buttonText?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  showToast?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function FileUploadButton({
  onFileSelected,
  fileType = "image",
  buttonText = "Upload",
  variant = "outline",
  showToast = true,
  className,
  icon,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Generate preview URL for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          onFileSelected(file, previewUrl);

          if (showToast) {
            showExtractionToast(
              "Image",
              file.name,
              `${(file.size / 1024).toFixed(1)}KB - Ready to use`
            );
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files
        onFileSelected(file, null);

        if (showToast) {
          showExtractionToast(
            "File",
            file.name,
            `${(file.size / 1024).toFixed(1)}KB - Ready to use`
          );
        }
      }
    }
  };

  const getAcceptValue = () => {
    return fileType === "image" ? "image/*" : undefined;
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={getAcceptValue()}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant={variant}
        className={cn(
          "relative overflow-hidden transition-all",
          isHovering && "bg-primary/10",
          className
        )}
        onClick={handleButtonClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {icon ||
          (fileType === "image" ? (
            <ImagePlus className="w-4 h-4 mr-2" />
          ) : (
            <File className="w-4 h-4 mr-2" />
          ))}
        {buttonText}

        {isHovering && (
          <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
            <Upload className="w-4 h-4 text-primary/70" />
          </div>
        )}
      </Button>
    </div>
  );
}
