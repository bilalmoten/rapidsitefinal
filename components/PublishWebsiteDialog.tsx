"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, XCircle, AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { trackEvent, EVENTS } from "@/utils/analytics";
import { cn } from "@/lib/utils";

const sanitizeSubdomain = (value: string) => {
  // Replace spaces and special characters with hyphens, convert to lowercase
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-") // Replace invalid chars with hyphen
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
};

export default function PublishWebsiteDialog({
  children,
  websiteId,
  currentName,
  currentSubdomain,
  isProUser,
}: {
  children: React.ReactNode;
  websiteId: string;
  currentName: string;
  currentSubdomain: string;
  isProUser: boolean;
}) {
  const [websiteTitle, setWebsiteTitle] = useState(currentName || "");
  const [subdomain, setSubdomain] = useState(currentSubdomain || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingSubdomains, setExistingSubdomains] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    subdomain: "",
  });
  const router = useRouter();

  const loadExistingSubdomains = async () => {
    const response = await fetch("/api/check-subdomains", {
      method: "GET",
    });
    const data = await response.json();
    if (data.subdomains) {
      setExistingSubdomains(data.subdomains);
    }
  };

  const getSubdomainStatus = (value: string) => {
    if (!value)
      return {
        message: "Enter a subdomain",
        status: "neutral",
        icon: AlertCircle,
      };
    if (value.length < 3)
      return {
        message: "Too short (min 3 characters)",
        status: "error",
        icon: XCircle,
      };
    if (existingSubdomains.includes(value) && value !== currentSubdomain)
      return { message: "Already taken", status: "error", icon: XCircle };
    return { message: "Available", status: "success", icon: CheckCircle2 };
  };

  const validateSubdomain = (value: string) => {
    if (!value) return "Subdomain is required";
    if (value.length < 3) return "Subdomain must be at least 3 characters";
    if (existingSubdomains.includes(value) && value !== currentSubdomain)
      return "This subdomain is already taken";
    return "";
  };

  const handlePublish = async () => {
    // Reset errors
    setErrors({ title: "", subdomain: "" });

    // Validate fields
    const newErrors = {
      title:
        websiteTitle.trim() === ""
          ? "Title is required"
          : websiteTitle.trim().length <= 3
            ? "Title must be more than 3 characters"
            : "",
      subdomain: validateSubdomain(subdomain),
    };

    // If any errors exist, set them and return
    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("websites")
        .update({
          website_name: websiteTitle,
          subdomain: subdomain,
          is_published: true,
        })
        .eq("id", websiteId);

      if (error) {
        console.error("Error publishing website:", error);
        toast.error("Failed to publish website");
        return;
      }

      // Use the DEPLOYED event for publishing
      trackEvent(EVENTS.WEBSITE.DEPLOYED, {
        websiteId: websiteId,
        title: websiteTitle,
        subdomain: subdomain,
        action: "published",
      });

      toast.success("Website published successfully!", {
        description: `Your website is now live at https://${subdomain}.rapidai.website`,
      });

      router.refresh();
    } catch (error) {
      console.error("Error publishing website:", error);
      toast.error("Failed to publish website");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={async (open) => {
        if (open) {
          loadExistingSubdomains();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6 bg-neutral-10 dark:bg-neutral-90 backdrop-blur-xl border border-neutral-20 dark:border-neutral-70">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-90 dark:text-neutral-10">
            Publish Your Website
          </DialogTitle>
          <p className="text-neutral-60 dark:text-neutral-40 mt-2">
            Your website is ready to go live! Confirm the details below to
            publish your website.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Website Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-base font-semibold text-neutral-70 dark:text-neutral-30"
            >
              Website Title
            </Label>
            <Input
              id="title"
              value={websiteTitle}
              onChange={(e) => setWebsiteTitle(e.target.value)}
              className={cn(
                "bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-90 dark:text-neutral-10 placeholder:text-neutral-60 dark:placeholder:text-neutral-40",
                errors.title && "border-destructive"
              )}
              placeholder="My Awesome Website"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Subdomain */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="subdomain"
                className="text-base font-semibold text-neutral-70 dark:text-neutral-30"
              >
                Subdomain
              </Label>
              {!isProUser && (
                <div className="flex items-center text-neutral-50 text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Upgrade to Pro to customize</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-60 dark:text-neutral-40 px-4 py-2 border border-r-0 rounded-l-md flex items-center">
                  https://
                </span>
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={(e) =>
                    isProUser
                      ? setSubdomain(sanitizeSubdomain(e.target.value))
                      : null
                  }
                  className={cn(
                    "rounded-none bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-90 dark:text-neutral-10 placeholder:text-neutral-60 dark:placeholder:text-neutral-40",
                    !isProUser && "opacity-70 cursor-not-allowed",
                    errors.subdomain && "border-destructive"
                  )}
                  placeholder="my-site"
                  readOnly={!isProUser}
                />
                <span className="bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-60 dark:text-neutral-40 px-4 py-2 border border-l-0 rounded-r-md flex items-center">
                  .rapidai.website
                </span>
              </div>
              {subdomain && (
                <div className="flex items-center gap-2 text-sm">
                  {(() => {
                    const status = getSubdomainStatus(subdomain);
                    const StatusIcon = status.icon;
                    return (
                      <>
                        <StatusIcon
                          className={cn(
                            "h-4 w-4",
                            status.status === "success" && "text-primary-main",
                            status.status === "error" && "text-destructive",
                            status.status === "neutral" &&
                              "text-neutral-60 dark:text-neutral-40"
                          )}
                        />
                        <span
                          className={cn(
                            status.status === "success" && "text-primary-main",
                            status.status === "error" && "text-destructive",
                            status.status === "neutral" &&
                              "text-neutral-60 dark:text-neutral-40"
                          )}
                        >
                          {status.message}
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
              {!isProUser && (
                <p className="text-sm text-neutral-50">
                  Free users cannot modify the subdomain. Upgrade to Pro to
                  customize your website URL.
                </p>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handlePublish}
          disabled={isLoading}
          className="w-full bg-primary-main text-neutral-90 hover:bg-primary-light"
        >
          {isLoading ? "Publishing..." : "Publish Website"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
