"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Bell, HelpCircle, Moon, Sun, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ModeToggle from "./mode-toggle";

// Mock data - replace with actual data from Supabase
const quickActions = [
  {
    id: 1,
    title: "Personal Portfolio",
    image: "/api/placeholder/400/200",
    created: "6 days ago",
  },
  {
    id: 2,
    title: "Travel Blog",
    image: "/api/placeholder/400/200",
    created: "3 weeks ago",
  },
  {
    id: 3,
    title: "Fitness Guide",
    image: "/api/placeholder/400/200",
    created: "2 months ago",
  },
];

const recentActivity = [
  {
    id: 1,
    title: "Personal Portfolio",
    date: "May 18, 2023",
    image: "/api/placeholder/50/50",
  },
  {
    id: 2,
    title: "Personal Portfolio",
    date: "May 18, 2023",
    image: "/api/placeholder/50/50",
  },
  {
    id: 3,
    title: "Personal Portfolio",
    date: "May 18, 2023",
    image: "/api/placeholder/50/50",
  },
];

const Dashboard = () => {
  const { theme, setTheme } = useTheme();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Fetch user name from Supabase
    // setUserName(fetchedName);

    // Show onboarding tooltip for new users
    toast.message("Welcome to AI Website Builder!", {
      description: "Click here for a quick tour of your dashboard.",
      action: <Button variant="outline">Start Tour</Button>,
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 p-4">
        <h1 className="text-2xl font-bold mb-8">AI Website Builder</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Sites
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Team
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Upgrade
              </Button>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <Button variant="default" className="w-full mt-4">
            Create new site
          </Button>
          <ul className="mt-4 space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Docs
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Tutorials
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Help & feedback
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                API reference
              </Button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Welcome back, {userName}!</h2>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>

            <ModeToggle />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Quick Actions
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" /> New Site
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Card key={action.id}>
                  <img
                    src={action.image}
                    alt={action.title}
                    className="w-full h-40 object-cover"
                  />
                  <CardContent>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-gray-500">
                      Created {action.created}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Use AI to generate text</h4>
                    <p className="text-sm text-gray-500">
                      Try it out in the ChatGPT plugin
                    </p>
                  </div>
                  <Button>Open Plugin</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Use AI to design layouts</h4>
                    <p className="text-sm text-gray-500">
                      Let AI suggest the best layout for your content
                    </p>
                  </div>
                  <Button>Try Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-center space-x-4">
                    <img
                      src={activity.image}
                      alt=""
                      className="w-10 h-10 rounded"
                    />
                    <div>
                      <h4 className="font-semibold">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
