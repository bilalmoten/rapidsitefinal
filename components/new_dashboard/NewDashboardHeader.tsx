import React from "react";
import { Wand2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewDashboardHeaderProps {
  user: any;
}

const NewDashboardHeader: React.FC<NewDashboardHeaderProps> = ({ user }) => {
  return (
    <header className="h-20 border-b border-neutral-80/30 bg-neutral-90/50 backdrop-blur-sm px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-neutral-10">
          <Wand2 className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold">RapidSite</span>
      </div>

      {/* Usage Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 bg-neutral-80/30 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-full" />
            </div>
            <span className="text-sm text-neutral-40">Active Websites 0/1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 bg-neutral-80/30 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary rounded-full" />
            </div>
            <span className="text-sm text-neutral-40">Generated 2/3</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 bg-neutral-80/30 rounded-full overflow-hidden">
              <div className="h-full w-1/5 bg-primary rounded-full" />
            </div>
            <span className="text-sm text-neutral-40">AI Edits 2/10</span>
          </div>
        </div>

        {/* User Avatar */}
        <Avatar>
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback>
            {user.first_name?.[0] || user.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default NewDashboardHeader;
