"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSidebar } from "@/contexts/SidebarContext";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Wand2,
  TimerIcon,
  FileText,
  BookOpen,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { UsageBar } from "@/components/ui/usage-bar";
import { PLAN_LIMITS } from "@/lib/constants/plans";
import SettingsModal from "./dashboard/SettingsModal";
import { CircularProgress } from "@/components/ui/circular-progress";

const DashboardSidebar = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [usage, setUsage] = useState({
    websitesActive: 0,
    websitesGenerated: 0,
    aiEditsCount: 0,
    plan: "free" as const,
    subscription_status: "inactive" as string | undefined,
    subscription_id: undefined as string | undefined,
  });
  const [user, setUser] = useState<{
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, first_name, last_name, avatar_url")
      .eq("id", authUser.id)
      .single();

    if (!userError && userData) {
      setUser(userData);
    }

    const { data: usageData, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", authUser.id)
      .single();

    if (!usageError && usageData) {
      setUsage({
        websitesActive: usageData.websites_active || 0,
        websitesGenerated: usageData.websites_generated || 0,
        aiEditsCount: usageData.ai_edits_count || 0,
        plan: usageData.plan || "free",
        subscription_status: usageData.subscription_status || "inactive",
        subscription_id: usageData.subscription_id,
      });
    }
  };

  const navItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: TimerIcon,
      label: "Roadmap",
      href: "/roadmap",
    },
    {
      icon: FileText,
      label: "Changelog",
      href: "/changelog",
    },
  ];

  const comingSoonItems = [
    {
      icon: BookOpen,
      label: "Documentation",
    },
    {
      icon: Video,
      label: "Tutorials",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
    },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-300",
        isExpanded ? "w-64" : "w-20",
        "border-r border-neutral-80/30 bg-neutral-90/90 backdrop-blur-xl"
      )}
    >
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-main text-neutral-10 shadow-lg shadow-primary-main/20">
            <Wand2 className="h-5 w-5" />
          </div>
          {isExpanded && (
            <span className="text-lg font-semibold text-neutral-10">
              RapidSite
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-40 hover:text-neutral-10 transition-colors"
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "group relative flex h-14 w-full items-center gap-3 rounded-xl px-3 transition-all duration-200",
                    isActive
                      ? "bg-primary-main text-neutral-10 shadow-lg shadow-primary-main/20"
                      : "text-neutral-40 hover:bg-neutral-80/30 hover:text-neutral-10"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200",
                      !isExpanded && "group-hover:scale-105"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {isExpanded && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 hidden rounded-lg bg-neutral-80/90 px-3 py-2 text-sm font-medium text-neutral-20 shadow-lg backdrop-blur-sm group-hover:block">
                      {item.label}
                    </div>
                  )}
                </button>
              </Link>
            );
          })}

          {comingSoonItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <button
                  disabled
                  className={cn(
                    "group relative flex h-14 w-full items-center gap-3 rounded-xl px-3 transition-all duration-200",
                    "text-neutral-40/70 hover:bg-neutral-80/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      !isExpanded && "group-hover:scale-105"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {isExpanded && (
                    <>
                      <span className="text-sm font-medium">{item.label}</span>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="text-xs rounded-full bg-primary-main/10 px-2 py-0.5 text-primary-main font-medium">
                          Soon
                        </div>
                      </div>
                    </>
                  )}
                  {!isExpanded && (
                    <>
                      <div className="absolute -right-1 -top-1">
                        <div className="h-2 w-2 rounded-full bg-primary-main animate-pulse" />
                      </div>
                      <div className="absolute left-full ml-3 hidden rounded-lg bg-neutral-80/90 px-3 py-2 text-sm font-medium text-neutral-20 shadow-lg backdrop-blur-sm group-hover:block">
                        {item.label}
                        <span className="ml-2 text-xs text-primary-main font-medium">
                          Soon
                        </span>
                      </div>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-auto p-4 space-y-3">
          {isExpanded ? (
            <>
              <div className="text-sm font-medium text-neutral-30 mb-2">
                Usage
              </div>
              <div className="space-y-4">
                <UsageBar
                  icon="website"
                  label="Active Websites"
                  current={usage.websitesActive}
                  limit={PLAN_LIMITS[usage.plan].websites}
                />
                <UsageBar
                  icon="generated"
                  label="Websites Generated"
                  current={usage.websitesGenerated}
                  limit={PLAN_LIMITS[usage.plan].websitesGenerated}
                />
                <UsageBar
                  icon="ai"
                  label="AI Edits"
                  current={usage.aiEditsCount}
                  limit={PLAN_LIMITS[usage.plan].aiEdits}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <CircularProgress
                icon="website"
                current={usage.websitesActive}
                limit={PLAN_LIMITS[usage.plan].websites}
                label="Active Websites"
              />
              <CircularProgress
                icon="generated"
                current={usage.websitesGenerated}
                limit={PLAN_LIMITS[usage.plan].websitesGenerated}
                label="Websites Generated"
              />
              <CircularProgress
                icon="ai"
                current={usage.aiEditsCount}
                limit={PLAN_LIMITS[usage.plan].aiEdits}
                label="AI Edits"
              />
            </div>
          )}
        </div>

        <div className="border-t border-neutral-80/30 p-4 space-y-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full rounded-xl transition-all duration-200",
              isExpanded ? "justify-start px-4" : "justify-center",
              "hover:bg-neutral-80/30"
            )}
            onClick={() => setShowSettings(true)}
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <Settings className="h-6 w-6" />
            </div>
            {isExpanded && (
              <span className="ml-3 text-sm font-medium">Settings</span>
            )}
          </Button>

          <div className="flex items-center justify-between rounded-xl bg-neutral-80/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center">
                <Moon className="h-6 w-6" />
              </div>
              {isExpanded && (
                <span className="text-sm font-medium">Dark Mode</span>
              )}
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
          </div>

          <Button
            variant="ghost"
            className={cn(
              "w-full rounded-xl transition-all duration-200",
              isExpanded ? "justify-start px-4" : "justify-center",
              "text-destructive hover:bg-destructive/10"
            )}
            onClick={handleLogout}
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <LogOut className="h-6 w-6" />
            </div>
            {isExpanded && (
              <span className="ml-3 text-sm font-medium">Log Out</span>
            )}
          </Button>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        usage={usage}
        user={user || undefined}
        onProfileUpdate={fetchData}
      />
    </div>
  );
};

export default DashboardSidebar;
