"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Layout,
  PlusCircle,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  BarChart,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Image from "next/image";

export function Page() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
          <Header />
          <div className="container mx-auto px-4 py-8">
            <WelcomeSection />
            <QuickActions />
            <RecentProjects />
            <Stats />
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
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
      <Button variant="ghost" className="mt-4 w-full justify-start">
        <LogOut className="h-5 w-5 mr-3" />
        Log Out
      </Button>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Input type="search" placeholder="Search..." className="w-64" />
          <Button size="icon" variant="ghost" className="rounded-full">
            <Image
              src="/placeholder.svg"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}

function WelcomeSection() {
  return (
    <section className="mb-8">
      <motion.div
        className="bg-primary text-primary-foreground rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">Welcome back, User!</h2>
        <p>Ready to create your next stunning website? Let's get started!</p>
      </motion.div>
    </section>
  );
}

function QuickActions() {
  const actions = [
    {
      icon: <PlusCircle className="h-6 w-6" />,
      title: "New Project",
      description: "Start a new website project",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI Assistant",
      description: "Get help from our AI",
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Templates",
      description: "Browse website templates",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start space-x-4 cursor-pointer hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-full">
              {action.icon}
            </div>
            <div>
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function RecentProjects() {
  const projects = [
    {
      name: "My Portfolio",
      lastEdited: "2 days ago",
      image: "/placeholder.svg",
    },
    {
      name: "Client Website",
      lastEdited: "1 week ago",
      image: "/placeholder.svg",
    },
    { name: "Blog", lastEdited: "3 weeks ago", image: "/placeholder.svg" },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={project.image}
              alt={project.name}
              width={300}
              height={200}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{project.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last edited: {project.lastEdited}
              </p>
              <Button variant="link" className="mt-2 p-0">
                Edit <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { title: "Total Projects", value: "12" },
    { title: "Published Sites", value: "8" },
    { title: "Total Views", value: "3,721" },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Your Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
