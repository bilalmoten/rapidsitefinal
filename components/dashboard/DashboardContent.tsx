"use client";

import React, { useState } from "react";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import QuickActions from "./QuickActions";
import RecentProjects from "./RecentProjects";
import Stats from "./Stats";
import AIAssistantPopup from "./AIAssistantPopup";

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
    <div className="min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        {/* <Header user={user} /> */}
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="rounded-lg bg-card p-6 shadow-sm">
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
