"use client";

import React from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type SettingType = "color" | "font" | "layout" | "general" | "style";

interface ProjectSettingToastProps {
  settingType: SettingType;
  settingName: string;
  settingValue: string;
  settingDescription?: string;
  allowUndo?: boolean;
  onUndo?: () => void;
}

/**
 * Displays a toast notification for project setting updates
 */
export function showProjectSettingToast({
  settingType,
  settingName,
  settingValue,
  settingDescription,
  allowUndo = true,
  onUndo,
}: ProjectSettingToastProps) {
  return toast({
    variant: "default",
    title: "Project Setting Updated",
    description: `${settingName}: ${settingValue}${settingDescription ? ` - ${settingDescription}` : ""}`,
    action:
      allowUndo && onUndo ? (
        <Button variant="outline" size="sm" onClick={onUndo}>
          Undo
        </Button>
      ) : undefined,
  });
}

/**
 * Shows an extraction confirmation toast
 */
export function showExtractionToast(
  extractionType: string,
  value: string,
  description?: string
) {
  return toast({
    variant: "success",
    title: `${extractionType} Extracted`,
    description: description ? `${value}\n${description}` : value,
  });
}

/**
 * Shows an error toast notification
 */
export function showErrorToast(title: string, message: string) {
  return toast({
    variant: "destructive",
    title: title,
    description: message,
  });
}
