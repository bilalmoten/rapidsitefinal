"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

interface CloneButtonProps {
  websiteId: number;
  websiteName: string;
  isAuthenticated: boolean;
  className?: string;
}

export default function CloneButton({
  websiteId,
  websiteName,
  isAuthenticated,
  className,
}: CloneButtonProps) {
  const [open, setOpen] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [name, setName] = useState(websiteName);
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");
  const [existingSubdomains, setExistingSubdomains] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      loadExistingSubdomains();
      // Initialize subdomain based on website name
      setSubdomain(sanitizeSubdomain(websiteName));
    }
  }, [open, websiteName]);

  const loadExistingSubdomains = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("websites")
      .select("subdomain")
      .not("subdomain", "is", null);

    if (data) {
      setExistingSubdomains(data.map((item) => item.subdomain));
    }
  };

  const sanitizeSubdomain = (value: string) => {
    return value.toLowerCase().replace(/[^a-z0-9-]/g, "");
  };

  const getSubdomainStatus = (value: string) => {
    if (!value) return "";
    if (value.length < 3) return "too-short";
    if (existingSubdomains.includes(value)) return "taken";
    return "available";
  };

  const handleClone = async () => {
    if (!isAuthenticated || isCloning) return;
    if (getSubdomainStatus(subdomain) !== "available") return;

    setIsCloning(true);

    try {
      const response = await fetch("/api/inspiration/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteId,
          websiteName: name,
          websiteDescription: description,
          subdomain,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/dashboard?cloned=${data.newWebsiteId}`);
      } else {
        throw new Error(data.error || "Failed to clone website");
      }
    } catch (error) {
      console.error("Error cloning website:", error);
      alert("Failed to clone website. Please try again.");
    } finally {
      setIsCloning(false);
      setOpen(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button variant="outline" className="w-full" disabled>
        <Copy className="mr-2 h-4 w-4" />
        Sign in to clone
      </Button>
    );
  }

  const subdomainStatus = getSubdomainStatus(subdomain);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          disabled={isCloning || !isAuthenticated}
          className={className}
        >
          {isCloning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cloning...
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Clone Website
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clone Website</DialogTitle>
          <DialogDescription>
            Create a copy of this website to your account. You can customize it
            after cloning.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Website Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Website"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subdomain">
              Subdomain
              <span className="text-muted-foreground ml-1 text-sm">
                (letters, numbers, and hyphens only)
              </span>
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="subdomain"
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(sanitizeSubdomain(e.target.value))
                }
                placeholder="my-website"
                className={cn(
                  subdomainStatus === "available" && "border-green-500",
                  subdomainStatus === "taken" && "border-red-500",
                  subdomainStatus === "too-short" && "border-yellow-500"
                )}
              />
              <span className="text-muted-foreground whitespace-nowrap">
                .rapidai.website
              </span>
            </div>
            <p
              className={cn(
                "text-sm",
                subdomainStatus === "available" && "text-green-500",
                subdomainStatus === "taken" && "text-red-500",
                subdomainStatus === "too-short" && "text-yellow-500",
                !subdomainStatus && "text-muted-foreground"
              )}
            >
              {subdomainStatus === "available" && "This subdomain is available"}
              {subdomainStatus === "taken" && "This subdomain is already taken"}
              {subdomainStatus === "too-short" &&
                "Subdomain must be at least 3 characters"}
              {!subdomainStatus && "Choose a subdomain for your website"}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Website Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your website"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleClone}
            disabled={
              !name.trim() || subdomainStatus !== "available" || isCloning
            }
          >
            {isCloning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cloning...
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Clone Website
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
