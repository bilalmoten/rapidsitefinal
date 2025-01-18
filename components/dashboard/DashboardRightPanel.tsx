import React from "react";
import { User } from "@supabase/supabase-js";
import { FiBarChart2, FiEye, FiGlobe } from "react-icons/fi";

interface DashboardRightPanelProps {
  user: User;
  projectCount: number;
  publishedSites: number;
  totalViews: number;
}

const DashboardRightPanel: React.FC<DashboardRightPanelProps> = ({
  user,
  projectCount,
  publishedSites,
  totalViews,
}) => {
  return (
    <div className="w-[350px] h-full bg-[#0a0a0b00] p-6 flex flex-col border-t border-l border-r rounded-t-lg border-neutral-70 flex-shrink-0">
      {/* Welcome Section */}
      <h2 className="text-[28px] font-medium text-white mb-12">
        Welcome back, {user.email}!
      </h2>

      {/* Stats Section */}
      <div className="space-y-6 mb-16">
        {/* Total Projects */}
        <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4">
          <div>
            <p className="text-neutral-20 text-sm mb-1">Total Projects</p>
            <p className="text-primary-main text-[28px] font-medium">
              {projectCount}
            </p>
          </div>
          <FiBarChart2 className="w-6 h-6 text-neutral-40" />
        </div>

        {/* Published Sites */}
        <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4">
          <div>
            <p className="text-neutral-20 text-sm mb-1">Published Sites</p>
            <p className="text-primary-main text-[28px] font-medium">
              {publishedSites}
            </p>
          </div>
          <FiGlobe className="w-6 h-6 text-neutral-40" />
        </div>

        {/* Total Views */}
        <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4">
          <div>
            <p className="text-neutral-20 text-sm mb-1">Total Views</p>
            <div className="flex items-center gap-2">
              <p className="text-primary-main text-[20px] font-medium">
                Coming Soon
              </p>
              <span className="text-xs px-2 py-1 bg-primary-main bg-opacity-10 text-primary-main rounded">
                Beta
              </span>
            </div>
          </div>
          <FiEye className="w-6 h-6 text-neutral-40" />
        </div>
      </div>

      <div className="h-[2px] w-full bg-neutral-70 mb-8" />

      {/* Help Chat Section */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-white text-lg mb-8 flex items-center gap-2">
          AI Assistant
          <span className="text-xs px-2 py-1 bg-primary-main bg-opacity-10 text-primary-main rounded">
            Coming Soon
          </span>
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 mb-4">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect
                width="32"
                height="32"
                rx="8"
                fill="#18E299"
                fillOpacity="0.1"
              />
              <path
                d="M20.5 11.5L14.5 17.5"
                stroke="#18E299"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.5 11.5L17.0833 20.5C17.0367 20.6038 16.9614 20.6907 16.8667 20.7507C16.7719 20.8107 16.6617 20.8414 16.5496 20.8389C16.4375 20.8364 16.3288 20.8008 16.2372 20.7366C16.1455 20.6723 16.0748 20.5822 16.0333 20.4767L14.5 17.5L11.5233 15.9667C11.4178 15.9252 11.3277 15.8545 11.2635 15.7628C11.1992 15.6712 11.1636 15.5625 11.1611 15.4504C11.1586 15.3383 11.1893 15.2281 11.2493 15.1333C11.3093 15.0386 11.3962 14.9633 11.5 14.9167L20.5 11.5Z"
                stroke="#18E299"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-white text-sm mb-2">
            AI Assistant is coming soon!
          </p>
          <p className="text-neutral-40 text-sm">
            We're working on bringing you a powerful AI assistant to help with
            your website creation journey.
          </p>
        </div>

        {/* Chat Input - Disabled */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Chat coming soon..."
              disabled
              className="w-full bg-transparent border border-[#1C1C1C] rounded-lg px-4 py-3 text-sm text-neutral-40 placeholder-neutral-60 focus:outline-none cursor-not-allowed"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              disabled
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M8.75 11.25L17.5 2.5"
                  stroke="#404040"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 2.5L12.0833 17.5C12.0367 17.6038 11.9614 17.6907 11.8667 17.7507C11.7719 17.8107 11.6617 17.8414 11.5496 17.8389C11.4375 17.8364 11.3288 17.8008 11.2372 17.7366C11.1455 17.6723 11.0748 17.5822 11.0333 17.4767L8.75 11.25L2.52333 8.96667C2.41778 8.92519 2.32771 8.85446 2.26346 8.76282C2.19921 8.67118 2.16359 8.56246 2.16111 8.45036C2.15862 8.33826 2.18936 8.22805 2.24935 8.13327C2.30935 8.03848 2.39621 7.96322 2.5 7.91667L17.5 2.5Z"
                  stroke="#404040"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRightPanel;
