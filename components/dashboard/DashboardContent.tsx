"use client";

import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import RecentProjects from "./RecentProjects";
import Stats from "./Stats";
import AIAssistantPopup from "./AIAssistantPopup";
import DashboardBackground from "./DashboardBackground";
import DashboardRightPanel from "./DashboardRightPanel";
// import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardContentProps {
  user: any;
  websites: {
    id: string;
    website_name: string;
    website_description: string;
    thumbnail_url: string;
    subdomain: string;
    is_public: boolean;
    created_at: string;
    last_updated_at: string;
  }[];
  projectCount: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  websites,
  projectCount,
}) => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  // const { isExpanded } = useSidebar();

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  const toggleRightPanel = () => {
    setIsRightPanelOpen(!isRightPanelOpen);
  };

  // Mock data for now - you'll want to fetch these from your backend
  const publishedSites = websites.length;
  const totalViews = 3721; // Example value, replace with actual data

  const RightPanelContent = () => (
    <DashboardRightPanel
      user={user}
      projectCount={projectCount}
      publishedSites={publishedSites}
      totalViews={totalViews}
    />
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      <DashboardBackground />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-auto transition-all duration-300 flex",
          // isExpanded ? "ml-64" : "ml-20",
          isRightPanelOpen ? "mr-[480px]" : "mr-0"
        )}
      >
        <main className="relative z-[1] h-screen overflow-y-auto">
          <div className="container h-full mx-auto p-4 lg:p-8 space-y-8">
            <RecentProjects websites={websites} userId={user.id} />
          </div>
        </main>
      </div>

      {/* Desktop Right Panel */}
      <div className="flex-auto hidden lg:block fixed right-0 top-0 z-[2] h-screen">
        {!isRightPanelOpen ? (
          <Button
            className="fixed right-4 bottom-4 rounded-full h-12 w-12 bg-primary shadow-lg hover:shadow-xl transition-shadow"
            onClick={toggleRightPanel}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        ) : (
          <aside className="h-full w-[400px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 border-l border-border">
            <div className="relative w-full h-full">
              <Button
                className="fixed right-[420px] bottom-4 rounded-full h-12 w-12 bg-primary shadow-lg hover:shadow-xl transition-shadow"
                onClick={toggleRightPanel}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <RightPanelContent />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-shadow">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <RightPanelContent />
          </SheetContent>
        </Sheet>
      </div>

      <AIAssistantPopup
        isOpen={isAIAssistantOpen}
        onClose={toggleAIAssistant}
      />
    </div>
  );
};

export default DashboardContent;
