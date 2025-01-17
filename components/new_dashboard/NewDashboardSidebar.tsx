import React from "react";
import { BarChart3, Globe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewDashboardSidebarProps {
  user: any;
  projectCount: number;
}

const NewDashboardSidebar: React.FC<NewDashboardSidebarProps> = ({
  user,
  projectCount,
}) => {
  return (
    <aside className="w-80 border-l border-neutral-80/30 bg-neutral-90/50 backdrop-blur-sm p-6">
      <div className="space-y-8">
        {/* Welcome Message */}
        <div>
          <h2 className="text-2xl font-semibold mb-1">
            Welcome back, {user.first_name || user.email}!
          </h2>
          <p className="text-sm text-neutral-40">
            Ready to create your next stunning website?
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-40">Total Projects</div>
              <div className="text-2xl font-semibold text-primary">10</div>
            </div>
            <BarChart3 className="h-5 w-5 text-neutral-40" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-40">Published Sites</div>
              <div className="text-2xl font-semibold text-primary">7</div>
            </div>
            <Globe className="h-5 w-5 text-neutral-40" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-40">Total Views</div>
              <div className="text-2xl font-semibold text-primary">3,721</div>
            </div>
            <Eye className="h-5 w-5 text-neutral-40" />
          </div>
        </div>

        {/* AI Assistant */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Seek help with our AI assistant
          </h3>
          <div className="rounded-xl bg-neutral-90/50 backdrop-blur-sm border border-neutral-80/30 p-4 space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary">AI</span>
                </div>
                <p className="text-sm">Hello 👋 What can I help you today?</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-80/30 flex items-center justify-center">
                  <span className="text-xs">You</span>
                </div>
                <p className="text-sm text-neutral-40">
                  Hi there! I'm trying to create a website, but I'm not sure
                  where to start.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary">AI</span>
                </div>
                <p className="text-sm">
                  To create a website, simply click the "Create new website"
                  button with the huge plus sign.
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Type a message"
                className="w-full bg-neutral-90/50 border border-neutral-80/30 rounded-lg py-2 px-4 pr-10 text-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6668 1.33334L7.3335 8.66668M14.6668 1.33334L10.0002 14.6667L7.3335 8.66668L1.3335 6.00001L14.6668 1.33334Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default NewDashboardSidebar;
