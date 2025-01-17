"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewDashboardHeader from "./NewDashboardHeader";
import NewNavigationSidebar from "./NewNavigationSidebar";
import NewWebsiteCard from "./NewWebsiteCard";
import NewCreateWebsiteCard from "./NewCreateWebsiteCard";
import DashboardBackground from "../dashboard/DashboardBackground";

interface NewDashboardContentProps {
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

const sortOptions = [
  { label: "Recently Updated", value: "updated" },
  { label: "Name (A-Z)", value: "name_asc" },
  { label: "Name (Z-A)", value: "name_desc" },
  { label: "Created (Newest)", value: "created_desc" },
  { label: "Created (Oldest)", value: "created_asc" },
];

const filterOptions = [
  { label: "All Websites", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
  { label: "Archived", value: "archived" },
];

const NewDashboardContent: React.FC<NewDashboardContentProps> = ({
  user,
  websites,
  projectCount,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [filter, setFilter] = useState(filterOptions[0]);

  const filteredWebsites = websites.filter((website) =>
    website.website_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#0A0A0B]">
      {/* <DashboardBackground /> */}
      <NewNavigationSidebar />

      {/* Main Content Area */}
      <div className="ml-20 z-10">
        <NewDashboardHeader user={user} />

        {/* Content */}
        <main className="px-6 py-6">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 bg-[#0A0A0B]/50 border-neutral-800/30 backdrop-blur-sm rounded-lg text-sm text-neutral-200 placeholder:text-neutral-500"
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 bg-[#0A0A0B]/50 border border-neutral-800/30 backdrop-blur-sm rounded-lg gap-2 px-4 text-sm font-normal text-neutral-200"
                >
                  Sort by <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#0A0A0B]/95 border-neutral-800/30 backdrop-blur-sm">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="text-neutral-200 focus:text-neutral-200 focus:bg-neutral-800/50"
                    onClick={() => setSortBy(option)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 bg-[#0A0A0B]/50 border border-neutral-800/30 backdrop-blur-sm rounded-lg gap-2 px-4 text-sm font-normal text-neutral-200"
                >
                  Filter <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#0A0A0B]/95 border-neutral-800/30 backdrop-blur-sm">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="text-neutral-200 focus:text-neutral-200 focus:bg-neutral-800/50"
                    onClick={() => setFilter(option)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-3 gap-4">
            <NewCreateWebsiteCard userId={user.id} />
            {filteredWebsites.map((website) => (
              <NewWebsiteCard key={website.id} website={website} />
            ))}
            {/* Inspiration Card */}
            <div className="rounded-xl bg-[#0A0A0B]/50 border border-neutral-800/30 backdrop-blur-sm overflow-hidden group cursor-pointer hover:border-primary/20 transition-colors">
              <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-primary">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12H22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-neutral-200">
                  Find Inspiration
                </h3>
                <p className="text-sm text-neutral-400">
                  Browse our gallery of AI-created websites
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewDashboardContent;
