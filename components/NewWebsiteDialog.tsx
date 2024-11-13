// components/NewWebsiteDialog.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

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
}: // onWebsiteCreated,
{
  children: React.ReactNode;
  userId: string;
  // onWebsiteCreated: () => void;
}) {
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    subdomain: "",
    description: "",
  });
  const router = useRouter();

  const handleCreate = async () => {
    // Reset errors
    setErrors({ title: "", subdomain: "", description: "" });

    // Validate fields
    const newErrors = {
      title: websiteTitle.trim() === "" ? "Title is required" : "",
      subdomain: subdomain.trim() === "" ? "Subdomain is required" : "",
      description: description.trim() === "" ? "Description is required" : "",
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
      router.push(`/dashboard/chat/${result.id}`);
      console.log("Website created:", result.id);
    } else {
      console.error("Error creating website:", result.message);
    }

    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Website</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="title"
                value={websiteTitle}
                onChange={(e) => setWebsiteTitle(e.target.value)}
                className={errors.title ? "border-red-500" : ""}
                placeholder="My Awesome Website"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subdomain" className="text-right">
              Subdomain
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center">
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(sanitizeSubdomain(e.target.value))
                  }
                  className={`rounded-r-none ${
                    errors.subdomain ? "border-red-500" : ""
                  }`}
                  placeholder="my-site"
                />
                <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">
                  .vercel.app
                </span>
              </div>
              {errors.subdomain && (
                <p className="text-sm text-red-500">{errors.subdomain}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "border-red-500" : ""}
                placeholder="A brief description of your website"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Website"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
