"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import WelcomeSection from "./WelcomeSection";
import QuickActions from "./QuickActions";
import RecentProjects from "./RecentProjects";
import Stats from "./Stats";
import AIAssistantPopup from "./AIAssistantPopup";

interface DashboardContentProps {
  user: any;
  websites: any[];
  projectCount: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  websites,
  projectCount,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex h-screen">
        <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-1 overflow-y-auto">
          <Header user={user} />
          <div className="container mx-auto px-4 py-8">
            <WelcomeSection user={user} />
            <QuickActions
              userId={user.id}
              toggleAIAssistant={toggleAIAssistant}
            />
            <RecentProjects websites={websites} />
            <Stats projectCount={projectCount} />
          </div>
        </main>
      </div>
      <AIAssistantPopup
        isOpen={isAIAssistantOpen}
        onClose={toggleAIAssistant}
      />
    </div>
  );
};

export default DashboardContent;
