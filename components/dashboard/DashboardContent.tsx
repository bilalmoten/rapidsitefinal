"use client";

import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import QuickActions from "./QuickActions";
import RecentProjects from "./RecentProjects";
import Stats from "./Stats";
import AIAssistantPopup from "./AIAssistantPopup";
import DashboardBackground from "./DashboardBackground";
import Navbar from "./Navbar";

interface DashboardContentProps {
  user: any;
  websites: {
    id: string;
    website_name: string;
    website_description: string;
    thumbnail_url: string;
    subdomain: string;
  }[];
  projectCount: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  websites,
  projectCount,
}) => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  return (
    <div className="relative min-h-screen">
      <DashboardBackground />
      <main className="relative z-[1] ml-20 flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="rounded-lg bg-neutral-90/50 backdrop-blur-sm p-6 shadow-lg border border-neutral-80">
            <WelcomeSection user={user} />
          </div>
          <QuickActions
            userId={user.id}
            toggleAIAssistant={toggleAIAssistant}
          />
          <RecentProjects websites={websites} />
          <Stats projectCount={projectCount} />
        </div>
      </main>
      <AIAssistantPopup
        isOpen={isAIAssistantOpen}
        onClose={toggleAIAssistant}
      />
    </div>
  );
};

export default DashboardContent;
