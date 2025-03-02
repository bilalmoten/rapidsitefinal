"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSitePageViews, getVisitorStats } from "@/utils/site-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download,
  Monitor,
  Smartphone,
  Tablet,
  Users,
  Clock,
  Activity,
  ListStart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface ApiResponse {
  total_views: number;
  unique_visitors: number;
  average_time: number;
  pages: Array<{
    path: string;
    views: number;
    unique_visitors: number;
    average_time: number;
  }>;
  daily_stats: Array<{
    date: string;
    views: number;
    unique_visitors: number;
  }>;
}

interface RawPageData {
  total_views: number;
  unique_visitors: number;
  average_time: number;
  pages: Array<{
    path: string;
    views: number;
    unique_visitors: number;
    average_time: number;
  }>;
  daily_stats: Array<{
    date: string;
    views: number;
    unique_visitors: number;
  }>;
}

interface PageViewStats {
  totalViews: number;
  uniqueVisitors: number;
  averageTime: string;
  topPages: Array<{
    path: string;
    views: number;
    uniqueVisitors: number;
    averageTime: number;
  }>;
  daily_stats: Array<{
    date: string;
    views: number;
    unique_visitors: number;
  }>;
}

interface SiteAnalyticsProps {
  subdomain: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const formatTime = (milliseconds: number): string => {
  // Add safeguards for unrealistic values
  if (!milliseconds || milliseconds < 0 || milliseconds > 24 * 60 * 60 * 1000) {
    // Max 24 hours
    return "0s";
  }

  // Convert to seconds first
  const seconds = Math.round(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

const formatPagePath = (path: string): string => {
  // Remove /sites/subdomain prefix
  const cleanPath = path.replace(/^\/sites\/[^\/]+/, "");

  // If it's the homepage (empty or /)
  if (!cleanPath || cleanPath === "/") {
    return "Homepage";
  }

  // Remove leading slash and capitalize
  return cleanPath
    .slice(1) // Remove leading slash
    .split("/")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
};

const processAnalyticsData = (data: RawPageData): PageViewStats => {
  // Calculate real average time by only considering reasonable non-zero times
  const nonZeroTimes = data.pages
    .map((page) => page.average_time)
    .filter((time) => time > 0 && time < 24 * 60 * 60); // Filter out times > 24 hours

  const averageTime =
    nonZeroTimes.length > 0
      ? nonZeroTimes.reduce((a, b) => a + b, 0) / nonZeroTimes.length
      : 0;

  // Process page times with safeguards
  const processedPages = (data.pages || []).map((page) => {
    const pageTime = page.average_time;
    const safeTime = pageTime > 0 && pageTime < 24 * 60 * 60 ? pageTime : 0;

    return {
      path: formatPagePath(page.path),
      views: page.views,
      uniqueVisitors: page.unique_visitors,
      averageTime: safeTime * 1000, // Convert seconds to milliseconds
    };
  });

  return {
    totalViews: data.total_views || 0,
    uniqueVisitors: data.unique_visitors || 0,
    averageTime: formatTime(averageTime * 1000), // Convert seconds to milliseconds
    topPages: processedPages,
    daily_stats: data.daily_stats || [],
  };
};

export default function SiteAnalytics({ subdomain }: SiteAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<PageViewStats | null>(
    null
  );
  const [visitorData, setVisitorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    const cacheKey = `analytics_${subdomain}_${timeRange}`;

    async function fetchAnalytics() {
      try {
        // console.log("🔄 [SiteAnalytics] Starting analytics fetch for:", {
        //   subdomain,
        //   timeRange,
        // });

        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

        // If we have valid cached data, use it
        if (cachedData && cacheTimestamp) {
          const age = Date.now() - parseInt(cacheTimestamp);
          if (age < CACHE_DURATION) {
            // console.log("📦 [SiteAnalytics] Using cached data");
            const { pageData, visitData } = JSON.parse(cachedData);
            setAnalyticsData(processAnalyticsData(pageData));
            setVisitorData(visitData);
            setLoading(false);
            return;
          }
        }

        setLoading(true);
        const [pageData, visitData] = await Promise.all([
          getSitePageViews(subdomain, `-${timeRange}`, "now"),
          getVisitorStats(subdomain, `-${timeRange}`, "now"),
        ]);

        // Cache the fresh data
        localStorage.setItem(cacheKey, JSON.stringify({ pageData, visitData }));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

        if (!pageData || typeof pageData !== "object") {
          throw new Error("Invalid analytics data received");
        }

        // Process and set the data
        const apiData = pageData as unknown as ApiResponse;
        const filledDailyStats = fillMissingDates(
          apiData.daily_stats || [],
          timeRange
        );

        const rawData: RawPageData = {
          total_views: Number(apiData.total_views) || 0,
          unique_visitors: Number(apiData.unique_visitors) || 0,
          average_time: Number(apiData.average_time) || 0,
          pages: apiData.pages || [],
          daily_stats: filledDailyStats,
        };

        const formattedData = processAnalyticsData(rawData);
        setAnalyticsData(formattedData);
        setVisitorData(visitData);
      } catch (error) {
        console.error("❌ [SiteAnalytics] Error fetching analytics:", error);
        setAnalyticsData(createEmptyData(timeRange));
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [subdomain, timeRange]);

  // Helper function to fill missing dates
  const fillMissingDates = (stats: any[], timeRange: string) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    const endDate = new Date();
    const filledStats = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const existingData = stats.find((stat) => stat.date === dateStr);
      filledStats.push(
        existingData || {
          date: dateStr,
          views: 0,
          unique_visitors: 0,
        }
      );
    }

    return filledStats.sort((a, b) => a.date.localeCompare(b.date));
  };

  // Helper function to create empty data
  const createEmptyData = (timeRange: string): PageViewStats => ({
    totalViews: 0,
    uniqueVisitors: 0,
    averageTime: "0s",
    topPages: [],
    daily_stats: fillMissingDates([], timeRange),
  });

  const handleExport = () => {
    // console.log("📥 [SiteAnalytics] Preparing data export");
    const data = {
      overview: analyticsData,
      visitors: visitorData,
      timeRange,
      exportDate: new Date().toISOString(),
    };

    // console.log("📦 [SiteAnalytics] Export data prepared:", data);

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subdomain}-analytics-${timeRange}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // console.log("✅ [SiteAnalytics] Export completed");
  };

  if (loading) {
    return (
      <div className="w-full bg-[#0a0a0b00] border border-neutral-70 rounded-lg backdrop-blur-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[28px] font-medium text-white flex items-center">
              <Activity className="w-6 h-6 mr-3 text-primary-main" />
              Site Analytics
            </h2>
          </div>
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-main border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  const safeAnalyticsData = {
    totalViews: analyticsData?.totalViews || 0,
    uniqueVisitors: analyticsData?.uniqueVisitors || 0,
    averageTime: analyticsData?.averageTime || "0s",
    topPages: analyticsData?.topPages || [],
    daily_stats: analyticsData?.daily_stats || [],
  };

  return (
    <div className="w-full bg-[#0a0a0b00] border border-neutral-70 rounded-lg backdrop-blur-md">
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[28px] font-medium text-white flex items-center">
              <Activity className="w-6 h-6 mr-3 text-primary-main" />
              Site Analytics
            </h2>
            <div className="flex gap-4">
              <div className="flex bg-[#0a0a0b40] border border-neutral-70 rounded-lg overflow-hidden">
                <button
                  onClick={() => setTimeRange("7d")}
                  className={`px-4 py-2 text-sm ${
                    timeRange === "7d"
                      ? "bg-primary-main text-black font-medium"
                      : "text-neutral-20 hover:text-white"
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange("30d")}
                  className={`px-4 py-2 text-sm ${
                    timeRange === "30d"
                      ? "bg-primary-main text-black font-medium"
                      : "text-neutral-20 hover:text-white"
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimeRange("90d")}
                  className={`px-4 py-2 text-sm ${
                    timeRange === "90d"
                      ? "bg-primary-main text-black font-medium"
                      : "text-neutral-20 hover:text-white"
                  }`}
                >
                  90 Days
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-neutral-70 text-neutral-20 hover:bg-neutral-80/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
              <div>
                <p className="text-neutral-20 text-sm mb-1">Total Views</p>
                <p className="text-primary-main text-[28px] font-medium">
                  {safeAnalyticsData.totalViews}
                </p>
              </div>
              <BarChartIcon className="w-6 h-6 text-primary-main" />
            </div>
            <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
              <div>
                <p className="text-neutral-20 text-sm mb-1">Unique Visitors</p>
                <p className="text-primary-main text-[28px] font-medium">
                  {safeAnalyticsData.uniqueVisitors}
                </p>
              </div>
              <Users className="w-6 h-6 text-primary-main" />
            </div>
            <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
              <div>
                <p className="text-neutral-20 text-sm mb-1">
                  Avg. Time on Page
                </p>
                <p className="text-primary-main text-[28px] font-medium">
                  {safeAnalyticsData.averageTime}
                </p>
              </div>
              <Clock className="w-6 h-6 text-primary-main" />
            </div>
          </div>

          <div className="border border-neutral-70 rounded-lg bg-[#0a0a0b40] backdrop-blur-sm p-6">
            <div className="flex items-center mb-6">
              <Activity className="w-5 h-5 mr-2 text-primary-main" />
              <h3 className="text-[20px] font-medium text-white">
                Daily Traffic
              </h3>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={safeAnalyticsData.daily_stats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="viewsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#22c55e"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#22c55e"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                    <linearGradient
                      id="visitorsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0b",
                      border: "1px solid #374151",
                      borderRadius: "6px",
                      color: "#e5e7eb",
                    }}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#viewsGradient)"
                    name="Page Views"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="unique_visitors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#visitorsGradient)"
                    name="Unique Visitors"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-neutral-70 rounded-lg bg-[#0a0a0b40] backdrop-blur-sm p-6">
            <div className="flex items-center mb-6">
              <ListStart className="w-5 h-5 mr-2 text-primary-main" />
              <h3 className="text-[20px] font-medium text-white">Top Pages</h3>
            </div>
            <div className="space-y-4">
              {safeAnalyticsData.topPages.map((page: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-neutral-70 pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-neutral-20">{page.path}</p>
                    <p className="text-sm text-neutral-40">
                      {page.uniqueVisitors} unique visitors •{" "}
                      {formatTime(page.averageTime)} avg. time
                    </p>
                  </div>
                  <p className="text-primary-main text-[20px] font-medium">
                    {page.views} views
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
