"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Monitor,
  Smartphone,
  Tablet,
  Save,
  Code,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onSave: () => void;
  subdomain: string;
  pageTitle: string;
  pages: string[];
  onPageChange: (newPage: string) => void;
  onViewportChange: (viewport: string) => void;
  onThemeChange: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  viewport: string;
  isCodeViewActive: boolean;
  onCodeViewToggle: () => void;
  hasUnsavedChanges?: boolean;
  viewportDimensions?: { width: number; height: number };
  onResetViewport?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  onSave,
  subdomain,
  pageTitle,
  pages,
  onPageChange,
  onViewportChange,
  viewport,
  isCodeViewActive,
  onCodeViewToggle,
  hasUnsavedChanges = false,
  viewportDimensions,
  onResetViewport,
}) => {
  const router = useRouter();
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowSaveDialog(true);
    } else {
      router.push("/dashboard");
    }
  };

  const handleConfirmBack = async () => {
    await onSave();
    router.push("/dashboard");
  };

  const handleCopyUrl = () => {
    const url = `https://${subdomain}.aiwebsitebuilder.tech/${pageTitle.replace(
      ".html",
      ""
    )}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("URL copied to clipboard", {
        duration: 2000,
      });
    });
  };

  const handlePreview = () => {
    const url = `https://${subdomain}.aiwebsitebuilder.tech/${pageTitle.replace(
      ".html",
      ""
    )}`;
    window.open(url, "_blank");
  };

  return (
    <header className="border rounded-lg border-neutral-70 relative backdrop-blur-xl m-4 bg-neutral-90/5">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-90 via-primary-dark to-primary-main opacity-10 rounded-lg" />
      <div className="flex h-14 items-center px-4 relative">
        {/* Left Section - Back Button and URL */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2 bg-neutral-90/50 px-2 py-1 rounded-md border border-neutral-70">
            <span className="text-sm text-neutral-30">
              https://{subdomain}.aiwebsitebuilder.tech/
            </span>
            <Input
              className="h-7 w-[200px] bg-transparent border-none text-neutral-10 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pageTitle.replace(".html", "")}
              readOnly
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyUrl}
              className="h-7 w-7 transition-all active:scale-95 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-90 border-neutral-70">
                {pages.map((page) => (
                  <DropdownMenuItem
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={
                      pageTitle === page
                        ? "bg-neutral-80"
                        : "text-neutral-30 hover:text-neutral-10 hover:bg-neutral-80"
                    }
                  >
                    {page}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Center Section - Device Preview */}
        <div className="flex-1 flex p-6">
          <TooltipProvider>
            <div className="flex items-center rounded-lg border border-neutral-70 bg-neutral-90/50 p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewport === "desktop" ? "secondary" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      viewport === "desktop"
                        ? "bg-neutral-80 text-neutral-10"
                        : "text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
                    )}
                    onClick={() => onViewportChange("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desktop view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewport === "tablet" ? "secondary" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      viewport === "tablet"
                        ? "bg-neutral-80 text-neutral-10"
                        : "text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
                    )}
                    onClick={() => onViewportChange("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tablet view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewport === "mobile" ? "secondary" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      viewport === "mobile"
                        ? "bg-neutral-80 text-neutral-10"
                        : "text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
                    )}
                    onClick={() => onViewportChange("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mobile view</TooltipContent>
              </Tooltip>

              {viewport !== "desktop" && viewportDimensions && (
                <>
                  <div className="h-4 w-[1px] bg-neutral-70 mx-2" />
                  <div className="text-xs text-neutral-30">
                    {viewportDimensions.width} × {viewportDimensions.height}
                  </div>
                  {onResetViewport && (
                    <>
                      <div className="h-4 w-[1px] bg-neutral-70 mx-2" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetViewport}
                        className="text-xs text-neutral-30 hover:text-neutral-10"
                      >
                        Reset
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </TooltipProvider>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="border-neutral-70 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            variant={isCodeViewActive ? "secondary" : "outline"}
            size="sm"
            onClick={onCodeViewToggle}
            className={cn(
              isCodeViewActive
                ? "bg-neutral-80 text-neutral-10"
                : "border-neutral-70 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
            )}
          >
            <Code className="mr-2 h-4 w-4" />
            Code
          </Button>
          <Button
            size="sm"
            className="bg-primary-main hover:bg-primary-main/90 text-neutral-90"
            onClick={onSave}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent className="bg-neutral-90 border-neutral-70">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-10">
              Unsaved Changes
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-30">
              You have unsaved changes. Would you like to save before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-70 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50">
              Don't Save
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary-main hover:bg-primary-main/90 text-neutral-90"
              onClick={handleConfirmBack}
            >
              Save & Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default TopBar;
