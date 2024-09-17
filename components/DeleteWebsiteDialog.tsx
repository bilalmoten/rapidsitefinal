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
import { Trash2 } from "lucide-react";

interface DeleteWebsiteDialogProps {
  websiteId: string;
  websiteName: string;
  children: React.ReactNode;
}

const DeleteWebsiteDialog: React.FC<DeleteWebsiteDialogProps> = ({
  websiteId,
  websiteName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("websites")
      .update({ isdeleted: "yes" })
      .eq("id", websiteId);

    if (error) {
      console.error("Error marking website as deleted:", error);
    } else {
      router.refresh();
    }

    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Website</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete "{websiteName}"? This action cannot
            be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
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
      {/* {children} */}
    </Dialog>
  );
};

export default DeleteWebsiteDialog;
