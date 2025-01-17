"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

type EditType = "name" | "subdomain";

interface EditWebsiteDialogProps {
  websiteId: string;
  currentName: string;
  currentSubdomain: string;
  type: EditType;
  children: React.ReactNode;
}

const sanitizeSubdomain = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
};

const isSubdomainType = (type: EditType): type is "subdomain" => {
  return type === "subdomain";
};

export function EditWebsiteDialog({
  websiteId,
  currentName,
  currentSubdomain,
  type,
  children,
}: EditWebsiteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(
    isSubdomainType(type) ? currentSubdomain : currentName
  );
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSave = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Validate
      if (!value.trim()) {
        setError(`${isSubdomainType(type) ? "Subdomain" : "Name"} is required`);
        return;
      }

      if (isSubdomainType(type)) {
        if (value.length < 3) {
          setError("Subdomain must be at least 3 characters");
          return;
        }

        // Check if subdomain is available
        const { data: existingWebsites } = await supabase
          .from("websites")
          .select("id")
          .eq("subdomain", value)
          .neq("id", websiteId);

        if (existingWebsites && existingWebsites.length > 0) {
          setError("This subdomain is already taken");
          return;
        }
      }

      // Update the website
      const updateField = isSubdomainType(type) ? "subdomain" : "website_name";
      const { error: updateError } = await supabase
        .from("websites")
        .update({
          [updateField]: value,
        })
        .eq("id", websiteId);

      if (updateError) throw updateError;

      toast.success(`Website ${type} updated successfully`);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating website:", error);
      toast.error("Failed to update website");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(isSubdomainType(type) ? sanitizeSubdomain(newValue) : newValue);
  };

  const renderInput = () => {
    if (isSubdomainType(type)) {
      return (
        <div className="flex">
          <Input
            id={type}
            value={value}
            onChange={handleChange}
            className={`rounded-none rounded-l-md ${
              error ? "border-red-500" : ""
            }`}
            placeholder="my-website"
          />
          <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">
            .aiwebsitebuilder.tech
          </span>
        </div>
      );
    }

    return (
      <Input
        id={type}
        value={value}
        onChange={handleChange}
        className={error ? "border-red-500" : ""}
        placeholder="My Awesome Website"
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit Website {isSubdomainType(type) ? "Subdomain" : "Name"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={type}>
              {isSubdomainType(type) ? "Subdomain" : "Website Name"}
            </Label>
            {renderInput()}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
