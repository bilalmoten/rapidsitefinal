// components/DeleteWebsiteDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteWebsiteDialogProps {
  websiteId: string;
  websiteName: string;
  children: React.ReactNode;
}

export function DeleteWebsiteDialog({
  websiteId,
  websiteName,
  children,
}: DeleteWebsiteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      // Get user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      // Call the delete website API
      const response = await fetch("/api/delete-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteId,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete website");
      }

      toast.success("Website deleted successfully");
      router.refresh();
      router.push("/dashboard"); // Redirect to dashboard after deletion
    } catch (error) {
      console.error("Error deleting website:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete website"
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Website</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground mb-2">
            Are you sure you want to delete "{websiteName}"?
          </p>
          <p className="text-sm text-red-600 font-medium">
            This action cannot be undone. All website data, including pages,
            content, and settings will be permanently deleted.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Website"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
