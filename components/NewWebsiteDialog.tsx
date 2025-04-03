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
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { PLAN_LIMITS, PlanType } from "@/lib/constants/plans";
import { toast } from "sonner";
import { trackEvent, EVENTS } from "@/utils/analytics";
import { cn } from "@/lib/utils";
import DashboardBackground from "./dashboard/DashboardBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [prompt, setPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingSubdomains, setExistingSubdomains] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"express" | "pro">("express");
  const [errors, setErrors] = useState({
    title: "",
    subdomain: "",
    prompt: "",
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

  const handleCreateExpress = async () => {
    // Reset errors
    setErrors({ title: "", subdomain: "", prompt: "" });

    // Validate fields
    const newErrors = {
      title:
        websiteTitle.trim() === ""
          ? "Title is required"
          : websiteTitle.trim().length <= 3
            ? "Title must be more than 3 characters"
            : "",
      subdomain: validateSubdomain(subdomain),
      prompt:
        prompt.trim() === ""
          ? "Prompt is required"
          : prompt.trim().length < 10
            ? "Prompt must be at least 10 characters"
            : "",
    };

    // If any errors exist, set them and return
    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create the website first
      const createResponse = await fetch("/api/create-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: websiteTitle,
          subdomain,
          description: prompt, // Use prompt as description
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create website");
      }

      const websiteData = await createResponse.json();
      const websiteId = websiteData.id;

      // Then trigger the express generation
      const generateResponse = await fetch("/api/express-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          userId,
          websiteId,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate website");
      }

      // Track the event
      trackEvent(EVENTS.WEBSITE.CREATED, {
        websiteId,
        title: websiteTitle,
        subdomain,
        type: "express",
      });

      // Redirect to editor page
      router.push(`/dashboard/editor/${websiteId}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Error in express generation:", error);
      toast.error("Failed to create website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePro = async () => {
    // Reset errors
    setErrors({ title: "", subdomain: "", prompt: "" });

    // Validate fields
    const newErrors = {
      title:
        websiteTitle.trim() === ""
          ? "Title is required"
          : websiteTitle.trim().length <= 3
            ? "Title must be more than 3 characters"
            : "",
      subdomain: validateSubdomain(subdomain),
      prompt: "", // No prompt needed for Pro
    };

    // If any errors exist, set them and return
    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create the website for Pro Chat
      const response = await fetch("/api/create-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: websiteTitle,
          subdomain,
          description: "Created with Pro Website Designer",
          metadata: {
            is_pro: true,
            source: "pro_website_designer",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create website");
      }

      const result = await response.json();

      // Track the event
      trackEvent(EVENTS.WEBSITE.CREATED, {
        websiteId: result.id,
        title: websiteTitle,
        subdomain,
        type: "pro",
      });

      // Redirect to Pro Chat with the new website ID as URL parameter
      router.push(`/dashboard/pro-chat/${result.id}`);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating pro website:", error);
      toast.error("Failed to create website. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            Choose how you want to create your website
          </p>
        </DialogHeader>

        <Tabs
          defaultValue="express"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "express" | "pro")}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="express" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Express Website</span>
            </TabsTrigger>
            <TabsTrigger value="pro" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Pro Website</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="express" className="space-y-6">
            <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light/20">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary-main" />
                Express Website
              </h3>
              <p className="text-sm text-neutral-60 dark:text-neutral-40">
                Generate a complete website instantly with AI based on a simple
                prompt. Perfect for quick projects.
              </p>
            </div>

            <div className="space-y-6">
              {/* Website Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title-express"
                  className="text-base font-semibold text-neutral-70 dark:text-neutral-30"
                >
                  Website Title
                </Label>
                <Input
                  id="title-express"
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
                  htmlFor="subdomain-express"
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
                      id="subdomain-express"
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
                                status.status === "success" &&
                                  "text-primary-main",
                                status.status === "error" && "text-destructive",
                                status.status === "neutral" &&
                                  "text-neutral-60 dark:text-neutral-40"
                              )}
                            />
                            <span
                              className={cn(
                                status.status === "success" &&
                                  "text-primary-main",
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

              {/* Prompt Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="prompt"
                  className="text-base font-semibold text-neutral-70 dark:text-neutral-30"
                >
                  Website Prompt
                </Label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className={cn(
                    "w-full min-h-[100px] p-3 rounded-md border bg-neutral-20 dark:bg-neutral-80 border-neutral-20 dark:border-neutral-70 text-neutral-90 dark:text-neutral-10 placeholder:text-neutral-60 dark:placeholder:text-neutral-40 focus:border-primary-main/50 focus:ring-primary-main/20",
                    errors.prompt && "border-destructive"
                  )}
                  placeholder="Create a website for my coffee shop named 'Bean There' with a modern, cozy design. Include sections for our menu, about us, and contact information."
                />
                {errors.prompt && (
                  <p className="text-sm text-destructive">{errors.prompt}</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleCreateExpress}
              disabled={isLoading}
              className="w-full bg-primary-main text-neutral-90 hover:bg-primary-light"
            >
              {isLoading ? "Generating..." : "Generate Express Website"}
            </Button>
          </TabsContent>

          <TabsContent value="pro" className="space-y-6">
            <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light/20">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary-main" />
                Pro Website Designer
              </h3>
              <p className="text-sm text-neutral-60 dark:text-neutral-40">
                Create a high-quality, customized website through an interactive
                chat experience. Perfect for detailed projects.
              </p>
            </div>

            <div className="space-y-6">
              {/* Website Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title-pro"
                  className="text-base font-semibold text-neutral-70 dark:text-neutral-30"
                >
                  Website Title
                </Label>
                <Input
                  id="title-pro"
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
                  htmlFor="subdomain-pro"
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
                      id="subdomain-pro"
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
                                status.status === "success" &&
                                  "text-primary-main",
                                status.status === "error" && "text-destructive",
                                status.status === "neutral" &&
                                  "text-neutral-60 dark:text-neutral-40"
                              )}
                            />
                            <span
                              className={cn(
                                status.status === "success" &&
                                  "text-primary-main",
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

              <div className="p-4 bg-neutral-20/50 dark:bg-neutral-80/50 rounded-lg">
                <p className="text-sm text-neutral-60 dark:text-neutral-40">
                  In the Pro Website Designer, you'll be guided through an
                  interactive chat experience to create a detailed, customized
                  website. You'll be able to:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-neutral-60 dark:text-neutral-40 list-disc pl-5">
                  <li>Specify detailed design preferences</li>
                  <li>Upload images and reference materials</li>
                  <li>Define custom layouts and structures</li>
                  <li>Iteratively refine your website</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleCreatePro}
              disabled={isLoading}
              className="w-full bg-primary-main text-neutral-90 hover:bg-primary-light"
            >
              {isLoading ? "Creating..." : "Start Pro Designer"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
