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
  const router = useRouter();

  const handleCreate = async () => {
    if (!websiteTitle.trim() || !subdomain.trim() || !description.trim())
      return;

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
            <Input
              id="title"
              value={websiteTitle}
              onChange={(e) => setWebsiteTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subdomain" className="text-right">
              Subdomain
            </Label>
            <Input
              id="subdomain"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
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
