"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layout,
  Globe,
  BarChart,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, toggleDarkMode }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <Layout className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">AI Web Builder</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-2 rounded-lg bg-primary text-primary-foreground"
            >
              <Layout className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Globe className="h-5 w-5 mr-3" />
              My Projects
            </Link>
          </li>
          <li>
            <Link
              href="/analytics"
              className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <BarChart className="h-5 w-5 mr-3" />
              Analytics
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center justify-between pt-4 border-t">
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        <span className="ml-2">{darkMode ? "Dark" : "Light"} Mode</span>
        {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </div>
      <Button
        variant="ghost"
        className="mt-4 w-full justify-start"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-3" />
        Log Out
      </Button>
    </aside>
  );
};

export default Sidebar;
