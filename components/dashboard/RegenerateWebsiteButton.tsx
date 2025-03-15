"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RegenerateWebsiteDialog } from "@/components/dashboard/RegenerateWebsiteDialog";
import { RefreshCw } from "lucide-react";

interface RegenerateWebsiteButtonProps {
  websiteId: string;
  userID: string;
}

export function RegenerateWebsiteButton({
  websiteId,
  userID,
}: RegenerateWebsiteButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRegenerate = async () => {
    try {
      const response = await fetch(
        `https://rapidsite-new.azurewebsites.net/api/start_website_generation?user_id=${userID}&website_id=${websiteId}&model=gemini-2.0-flash-001`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate website");
      }

      // Redirect to editor
      window.location.href = `/dashboard/editor/${websiteId}`;
    } catch (error) {
      console.error("Error regenerating website:", error);
      alert(
        "An error occurred while regenerating your website. Please try again."
      );
    }
  };

  return (
    <RegenerateWebsiteDialog
      open={open}
      onOpenChange={setOpen}
      onConfirm={() => {
        setOpen(false);
        handleRegenerate();
      }}
    >
      <Button variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Regenerate Website
      </Button>
    </RegenerateWebsiteDialog>
  );
}
