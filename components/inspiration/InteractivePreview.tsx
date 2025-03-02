"use client";

import React, { useState, useEffect } from "react";
import { Laptop, Smartphone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InteractivePreviewProps {
  websiteId: number;
  websiteName: string;
  subdomain: string;
}

export default function InteractivePreview({
  websiteId,
  websiteName,
  subdomain,
}: InteractivePreviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const websiteUrl = `https://${subdomain}.rapidai.website`;

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Force iframe reload when view mode changes
  const handleViewModeChange = (mode: "desktop" | "mobile") => {
    setIsLoading(true);
    setViewMode(mode);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4 border border-border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "desktop" ? "default" : "outline"}
            size="icon"
            onClick={() => handleViewModeChange("desktop")}
            title="Desktop view"
          >
            <Laptop size={18} />
          </Button>
          <Button
            variant={viewMode === "mobile" ? "default" : "outline"}
            size="icon"
            onClick={() => handleViewModeChange("mobile")}
            title="Mobile view"
          >
            <Smartphone size={18} />
          </Button>
        </div>
        <div>
          <Link href={websiteUrl} target="_blank">
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Open in New Tab</span>
            </Button>
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "relative rounded-lg border border-border overflow-hidden bg-card transition-all duration-300",
          viewMode === "desktop"
            ? "w-full h-[500px]"
            : "w-[375px] h-[667px] mx-auto"
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center">
              <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">
                Loading preview...
              </p>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={websiteUrl}
          className="w-full h-full"
          onLoad={handleIframeLoad}
          title={`${websiteName} preview`}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        This is an interactive preview of the website. Toggle between desktop
        and mobile views.
      </p>
    </div>
  );
}
