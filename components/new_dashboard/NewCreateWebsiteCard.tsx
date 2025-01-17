import React from "react";
import { Plus } from "lucide-react";

interface NewCreateWebsiteCardProps {
  userId: string;
}

const NewCreateWebsiteCard: React.FC<NewCreateWebsiteCardProps> = () => {
  return (
    <div className="rounded-xl bg-[#0A0A0B]/50 border border-neutral-800/30 backdrop-blur-sm overflow-hidden group cursor-pointer hover:border-primary/20 transition-colors">
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Plus className="h-6 w-6 text-primary mb-2" />
        <div className="text-base font-medium text-neutral-200">
          Create new website
        </div>
      </div>
    </div>
  );
};

export default NewCreateWebsiteCard;
