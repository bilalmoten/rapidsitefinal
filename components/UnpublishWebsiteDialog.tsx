"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AlertCircle, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { trackEvent, EVENTS } from "@/utils/analytics";

export default function UnpublishWebsiteDialog({
  children,
  websiteId,
  websiteName,
  subdomain,
}: {
  children: React.ReactNode;
  websiteId: string;
  websiteName: string;
  subdomain: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUnpublish = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("websites")
        .update({
          is_published: false,
        })
        .eq("id", websiteId);

      if (error) {
        console.error("Error unpublishing website:", error);
        toast.error("Failed to unpublish website");
        return;
      }

      // Track unpublish event
      trackEvent(EVENTS.WEBSITE.DEPLOYED, {
        websiteId: websiteId,
        title: websiteName,
        subdomain: subdomain,
        action: "unpublished",
      });

      toast.success("Website unpublished successfully", {
        description:
          "Your website is now offline and no longer accessible to the public.",
      });

      router.refresh();
    } catch (error) {
      console.error("Error unpublishing website:", error);
      toast.error("Failed to unpublish website");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 bg-neutral-10 dark:bg-neutral-90 backdrop-blur-xl border border-neutral-20 dark:border-neutral-70">
        <DialogHeader>
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <EyeOff className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-bold text-neutral-90 dark:text-neutral-10">
              Unpublish Website
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-neutral-60 dark:text-neutral-40">
            Are you sure you want to unpublish{" "}
            <span className="font-medium text-neutral-90 dark:text-neutral-10">
              {websiteName}
            </span>
            ? This will take your site offline and it will no longer be
            accessible at{" "}
            <span className="font-medium text-neutral-90 dark:text-neutral-10">
              https://{subdomain}.rapidai.website
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 justify-end mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-neutral-20 dark:border-neutral-70"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleUnpublish}
            disabled={isLoading}
          >
            {isLoading ? "Unpublishing..." : "Unpublish Website"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
