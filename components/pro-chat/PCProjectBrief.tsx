"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Target,
  Users,
  PaintBucket,
  Type,
  Link2Icon,
  Image as ImageIcon,
  X,
  RocketIcon,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Palette,
  FileText,
  Copy,
  Save,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PCProjectBrief, PCUploadedAsset } from "@/hooks/useProChatStore";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface PCProjectBriefSidebarProps {
  brief: PCProjectBrief;
  chatState: string;
  onClose?: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onManageAssets?: () => void;
  onSave?: () => void;
}

export const PCProjectBriefSidebar: React.FC<PCProjectBriefSidebarProps> = ({
  brief,
  chatState,
  onClose,
  onGenerate,
  isGenerating,
  onManageAssets,
  onSave,
}) => {
  const router = useRouter();
  const isConfirmationStage = chatState === "CONFIRMATION";
  const isComplete = chatState === "COMPLETE";
  const isGeneratingState = chatState === "GENERATING";
  const isIntroduction = chatState === "INTRODUCTION";
  const canGenerate =
    chatState !== "INTRODUCTION" &&
    chatState !== "GENERATING" &&
    chatState !== "COMPLETE";

  const navigateToAssets = () => {
    router.push("/dashboard/assets");
  };

  const handleManageAssets = () => {
    if (onManageAssets) {
      onManageAssets();
    }
  };

  // Function to copy project brief to clipboard
  // TODO: Remove this function and button in production
  const copyProjectBrief = () => {
    const briefData = JSON.stringify(brief, null, 2);
    navigator.clipboard.writeText(briefData).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Project brief data copied to clipboard",
        duration: 3000,
      });
    });
  };

  // Determine if we have enough details to generate a website
  const hasMinimumDetails = brief.purpose && brief.purpose.trim() !== "";

  // Format the progress value for display
  const progressValue = Math.min(Math.round(brief.progress), 100);

  return (
    <div className="h-full flex flex-col bg-background p-4 overflow-y-auto">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Project Brief</h2>
        <div className="flex gap-2">
          {/* TODO: Remove this copy button in production */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyProjectBrief}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Copy project brief data (dev only)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {progressValue}%
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Save Button */}
      {onSave && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="mb-4 w-full flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Project Brief</span>
        </Button>
      )}

      {/* Website Details */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium">Website Details</h3>

        <div className="grid grid-cols-1 gap-3">
          {/* Purpose */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <LayoutGrid className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Purpose</h4>
                  <p className="text-sm text-muted-foreground">
                    {brief.purpose || "Not specified yet"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Target Audience</h4>
                  <p className="text-sm text-muted-foreground">
                    {brief.targetAudience || "Not specified yet"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Design Elements */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-medium">Design Elements</h3>

        <div className="grid grid-cols-1 gap-3">
          {/* Color Palette */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium mb-1">Color Palette</h4>
                  {brief.colorPalette ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {brief.colorPalette.name}
                      </p>
                      <div className="flex gap-1">
                        {brief.colorPalette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="h-5 w-5 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not selected yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Font Pairing */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Type className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Font Pairing</h4>
                  {brief.fontPairing ? (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {brief.fontPairing.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Heading:</span>{" "}
                        {brief.fontPairing.headingFont}
                        <br />
                        <span className="font-medium">Body:</span>{" "}
                        {brief.fontPairing.bodyFont}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not selected yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Website Structure */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <LayoutGrid className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Website Structure
                  </h4>
                  {brief.webStructure ? (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {brief.webStructure.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Pages:</span>{" "}
                        {brief.webStructure.pages.length}
                        <br />
                        <span className="font-medium">Sections:</span>{" "}
                        {brief.webStructure.pages.reduce(
                          (acc: number, page: any) =>
                            acc + page.sections.length,
                          0
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not selected yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content References */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Content References</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleManageAssets}
          >
            <span>Manage</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">References</h4>
                {brief.contentReferences &&
                brief.contentReferences.length > 0 ? (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {brief.contentReferences.length} reference
                      {brief.contentReferences.length !== 1 ? "s" : ""} added
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      No references yet
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={handleManageAssets}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Assets */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Images & Assets</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleManageAssets}
          >
            <span>Manage</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Images</h4>
                {brief.assets && brief.assets.length > 0 ? (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {brief.assets.length} image
                      {brief.assets.length !== 1 ? "s" : ""} added
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      No images yet
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={handleManageAssets}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate button card */}
      <Card className="mt-auto">
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="text-sm font-medium">Ready to generate?</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You can generate your website at any time. The more details you
              provide, the better the result!
              {/* {!brief.targetAudience && (
                <span className="block mt-1 text-amber-500">
                  💡 Tip: Add a target audience for better results.
                </span>
              )} */}
            </p>
          </div>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onGenerate}
                  disabled={isGenerating || !hasMinimumDetails}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate Website"}
                </Button>
              </TooltipTrigger>
              {!hasMinimumDetails && (
                <TooltipContent>
                  <p>
                    Please provide at least the website purpose before
                    generating
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </div>
  );
};
