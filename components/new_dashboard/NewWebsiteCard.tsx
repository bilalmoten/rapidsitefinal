import React from "react";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewWebsiteCardProps {
  website: {
    id: string;
    website_name: string;
    website_description: string;
    thumbnail_url: string;
    subdomain: string;
  };
}

const NewWebsiteCard: React.FC<NewWebsiteCardProps> = ({ website }) => {
  return (
    <div className="rounded-xl bg-[#0A0A0B]/50 border border-neutral-800/30 backdrop-blur-sm overflow-hidden">
      <div className="p-4">
        <h3 className="text-base font-medium text-neutral-200 mb-1">
          {website.website_name}
        </h3>
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
          {website.website_description}
          {website.website_description.length > 100 && (
            <button className="text-neutral-200 hover:text-primary ml-1">
              See more
            </button>
          )}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-lg"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-lg"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-lg p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-lg p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewWebsiteCard;
