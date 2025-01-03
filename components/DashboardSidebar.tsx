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

    // Get user profile data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, first_name, last_name, avatar_url")
      .eq("id", authUser.id)
      .single();

    if (!userError && userData) {
      setUser(userData);
    }

    // Get user usage data with user ID
    const { data: usageData, error: usageError } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", authUser.id)
      .single();

    console.log("User usage data:", usageData); // Debug log

    if (!usageError && usageData) {
      setUsage({
        websitesActive: usageData.websites_active || 0,
        websitesGenerated: usageData.websites_generated || 0,
        aiEditsCount: usageData.ai_edits_count || 0,
        plan: usageData.plan || "free",
        subscription_status: usageData.subscription_status || "inactive",
        subscription_id: usageData.subscription_id,
      });
    } else {
      console.error("Error fetching usage:", usageError);
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

  const UsageIndicator = ({
    current,
    limit,
    color = "primary",
  }: {
    current: number;
    limit: number;
    color?: string;
  }) => {
    const percentage = (current / limit) * 100;
    const isNearLimit = percentage >= 80;
    const isAtLimit = percentage >= 100;

    return (
      <div className="relative w-8 h-8 rounded-full bg-secondary/20">
        <div
          className={`absolute inset-1 rounded-full flex items-center justify-center text-xs font-medium
            ${
              isAtLimit
                ? "bg-red-500"
                : isNearLimit
                ? "bg-yellow-500"
                : `bg-${color}`
            }`}
        >
          {current}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "border-r bg-background/95 transition-all duration-300 flex flex-col h-screen",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        <div
          className={cn(
            "flex items-center",
            isExpanded ? "gap-2" : "w-full justify-center"
          )}
        >
          <Wand2 className="h-6 w-6 text-blue-600" />
          {isExpanded && (
            <span className="font-semibold text-lg">RapidSite</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex flex-col gap-2 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full relative",
                    isExpanded ? "justify-start px-3" : "justify-center p-3",
                    isActive && "bg-muted"
                  )}
                >
                  <Icon className="h-6 w-6 min-w-6 min-h-6" />
                  {isExpanded && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            );
          })}

          {comingSoonItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full relative",
                    isExpanded ? "justify-start px-3" : "justify-center p-3",
                    "opacity-50 cursor-not-allowed"
                  )}
                  disabled
                >
                  <div className="relative">
                    <Icon className="h-6 w-6 min-w-6 min-h-6" />
                    {!isExpanded && (
                      <div className="absolute -right-1 -top-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                  {isExpanded && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          Coming Soon
                        </div>
                      </div>
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "mt-auto p-3 space-y-3",
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        )}
      >
        {isExpanded ? (
          <>
            <div className="text-sm font-medium">Usage</div>
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
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
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

      <div className="border-t p-3 space-y-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full",
            isExpanded ? "justify-start px-3" : "justify-center px-0"
          )}
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-6 w-6" />
          {isExpanded && <span className="ml-3">Settings</span>}
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            {isExpanded && <span>Dark Mode</span>}
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
            "w-full text-muted-foreground hover:text-foreground",
            isExpanded ? "justify-start px-3" : "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
          {isExpanded && <span className="ml-3">Log Out</span>}
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground",
            isExpanded ? "justify-start px-3" : "justify-center px-0"
          )}
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-3">Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </Button>
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
