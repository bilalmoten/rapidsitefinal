"use client";

import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
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
  const getIcon = () => {
    switch (settingType) {
      case "color":
        return (
          <div className="mr-2 flex items-center">
            <div
              className="h-4 w-4 rounded-full mr-1"
              style={{
                backgroundColor: settingValue.startsWith("#")
                  ? settingValue
                  : undefined,
              }}
            />
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        );
      case "font":
        return <Info className="mr-2 h-4 w-4 text-blue-500" />;
      case "layout":
        return <Info className="mr-2 h-4 w-4 text-purple-500" />;
      default:
        return <Info className="mr-2 h-4 w-4 text-blue-500" />;
    }
  };

  const renderValue = () => {
    if (settingType === "color" && settingValue.startsWith("#")) {
      return <span className="font-mono text-xs">{settingValue}</span>;
    }
    return settingValue;
  };

  return toast({
    variant: "default",
    title: (
      <div className="flex items-center">
        {getIcon()}
        <span>Project Setting Updated</span>
      </div>
    ),
    description: (
      <div className="mt-1">
        <p className="text-sm">
          <span className="font-medium">{settingName}:</span> {renderValue()}
        </p>
        {settingDescription && (
          <p className="text-xs text-muted-foreground mt-1">
            {settingDescription}
          </p>
        )}
      </div>
    ),
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
    title: (
      <div className="flex items-center">
        <CheckCircle className="mr-2 h-4 w-4" />
        <span>{extractionType} Extracted</span>
      </div>
    ),
    description: (
      <div className="mt-1">
        <p className="text-sm font-medium">{value}</p>
        {description && <p className="text-xs mt-1">{description}</p>}
      </div>
    ),
  });
}

/**
 * Shows an error toast notification
 */
export function showErrorToast(title: string, message: string) {
  return toast({
    variant: "destructive",
    title: (
      <div className="flex items-center">
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </div>
    ),
    description: message,
  });
}
