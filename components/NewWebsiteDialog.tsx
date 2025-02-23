// components/NewWebsiteDialog.tsx
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
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { PLAN_LIMITS, PlanType } from "@/lib/constants/plans";
import { toast } from "sonner";
import { trackEvent, EVENTS } from "@/utils/analytics";
import { cn } from "@/lib/utils";
import DashboardBackground from "./dashboard/DashboardBackground";

const sanitizeSubdomain = (value: string) => {
  // Replace spaces and special characters with hyphens, convert to lowercase
  return (
    value
      .toLowerCase()
      // .replace(/^-|-$/g, "") // Remove hyphens from start and end
      .replace(/[^a-z0-9-]/g, "-") // Replace invalid chars with hyphen
      .replace(/-+/g, "-")
  ); // Replace multiple hyphens with single hyphen
};

export default function NewWebsiteDialog({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingSubdomains, setExistingSubdomains] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    subdomain: "",
    description: "",
  });
  const router = useRouter();

  const checkLimits = async () => {
    const supabase = createClient();

    // Get user's plan and current usage
    const { data: usage, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (usageError) {
      console.error("Error checking usage:", usageError);
      return false;
    }

    // Get current active websites count
    const { count: activeWebsites } = await supabase
      .from("websites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("isdeleted", "yes");

    const activeWebsitesCount = activeWebsites || 0;

    if (activeWebsitesCount >= PLAN_LIMITS[usage.plan as PlanType].websites) {
      toast.error(
        `You've reached your plan's limit of ${
          PLAN_LIMITS[usage.plan as PlanType].websites
        } active websites. Please upgrade your plan or delete some websites.`
      );
      return false;
    }

    if (
      usage.websites_generated >=
      PLAN_LIMITS[usage.plan as PlanType].websitesGenerated
    ) {
      toast.error(
        `You've reached your plan's limit of ${
          PLAN_LIMITS[usage.plan as PlanType].websitesGenerated
        } generated websites. Please upgrade your plan.`
      );
      return false;
    }

    return true;
  };

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
    if (existingSubdomains.includes(value))
      return { message: "Already taken", status: "error", icon: XCircle };
    return { message: "Available", status: "success", icon: CheckCircle2 };
  };

  const validateSubdomain = (value: string) => {
    if (!value) return "Subdomain is required";
    if (value.length < 3) return "Subdomain must be at least 3 characters";
    if (existingSubdomains.includes(value))
      return "This subdomain is already taken";
    return "";
  };

  const handleCreate = async () => {
    // Reset errors
    setErrors({ title: "", subdomain: "", description: "" });

    // Validate fields
    const newErrors = {
      title:
        websiteTitle.trim() === ""
          ? "Title is required"
          : websiteTitle.trim().length <= 3
            ? "Title must be more than 3 characters"
            : "",
      subdomain: validateSubdomain(subdomain),
      description:
        description.trim() === ""
          ? "Description is required"
          : description.trim().length <= 10
            ? "Description must be more than 10 characters"
            : "",
    };

    // If any errors exist, set them and return
    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const response = await fetch("/api/create-website", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title: websiteTitle,
        subdomain,
        description,
      }),
    });

    const result = await response.json();
    console.log(result);
    console.log("Response:", response);
    console.log("Response.ok: successful");

    if (response.ok) {
      trackEvent(EVENTS.WEBSITE.CREATED, {
        websiteId: result.id,
        title: websiteTitle,
        subdomain: subdomain,
      });
      router.push(`/dashboard/chat/${result.id}`);
      console.log("Website created:", result.id);
    } else {
      console.error("Error creating website:", result.message);
    }

    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={async (open) => {
        if (open) {
          const canProceed = await checkLimits();
          if (!canProceed) return;
          loadExistingSubdomains();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6 bg-neutral-10 dark:bg-neutral-90 backdrop-blur-xl border border-neutral-20 dark:border-neutral-70">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-90 dark:text-neutral-10">
            Create New Website
          </DialogTitle>
          <p className="text-neutral-60 dark:text-neutral-40 mt-2">
            Fill in the details below to create your new website. All fields are
            required.
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
            <Label
              htmlFor="subdomain"
              className="text-base font-semibold text-neutral-70 dark:text-neutral-30"
            >
              Subdomain
            </Label>
            <div className="space-y-2">
              <div className="flex">
                <span className="bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-60 dark:text-neutral-40 px-4 py-2 border border-r-0 rounded-l-md flex items-center">
                  https://
                </span>
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(sanitizeSubdomain(e.target.value))
                  }
                  className={cn(
                    "rounded-none bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-90 dark:text-neutral-10 placeholder:text-neutral-60 dark:placeholder:text-neutral-40",
                    errors.subdomain && "border-destructive"
                  )}
                  placeholder="my-site"
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
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-base font-semibold text-neutral-70 dark:text-neutral-30"
            >
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                "w-full min-h-[100px] p-3 rounded-md border bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-90 dark:text-neutral-10 placeholder:text-neutral-60 dark:placeholder:text-neutral-40 focus:border-primary-main/50 focus:ring-primary-main/20",
                errors.description && "border-destructive"
              )}
              placeholder="A brief description of your website"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={isLoading}
          className="w-full bg-primary-main text-neutral-90 hover:bg-primary-light"
        >
          {isLoading ? "Creating..." : "Create Website"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
