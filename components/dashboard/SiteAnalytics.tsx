"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getSitePageViews,
  formatAnalyticsData,
  getVisitorStats,
} from "@/utils/site-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Download,
  Monitor,
  Smartphone,
  Tablet,
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
} from "recharts";

interface SiteAnalyticsProps {
  subdomain: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function SiteAnalytics({ subdomain }: SiteAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [visitorData, setVisitorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        console.log("🔄 [SiteAnalytics] Starting analytics fetch for:", {
          subdomain,
          timeRange,
        });

        setLoading(true);
        const [pageData, visitData] = await Promise.all([
          getSitePageViews(subdomain, `-${timeRange}`, "now"),
          getVisitorStats(subdomain, `-${timeRange}`, "now"),
        ]);

        console.log("📊 [SiteAnalytics] Raw analytics data received:", {
          pageData,
          visitData,
        });

        const formattedData = formatAnalyticsData(pageData);
        console.log(
          "✨ [SiteAnalytics] Formatted analytics data:",
          formattedData
        );

        setAnalyticsData(formattedData);
        setVisitorData(visitData);
      } catch (error) {
        console.error("❌ [SiteAnalytics] Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [subdomain, timeRange]);

  const handleExport = () => {
    console.log("📥 [SiteAnalytics] Preparing data export");
    const data = {
      overview: analyticsData,
      visitors: visitorData,
      timeRange,
      exportDate: new Date().toISOString(),
    };

    console.log("📦 [SiteAnalytics] Export data prepared:", data);

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
    console.log("✅ [SiteAnalytics] Export completed");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Site Analytics</CardTitle>
          <div className="flex gap-4">
            <Tabs value={timeRange} onValueChange={setTimeRange}>
              <TabsList>
                <TabsTrigger value="7d">7 Days</TabsTrigger>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
                <TabsTrigger value="90d">90 Days</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {analyticsData?.totalViews || 0}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">
                  {analyticsData?.uniqueVisitors || 0}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Avg. Time on Page
                </p>
                <p className="text-2xl font-bold">
                  {analyticsData?.averageTime || "0s"}
                </p>
              </div>
            </div>

            <div className="h-[300px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.topPages || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="path" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pages">
            <div className="space-y-4">
              {analyticsData?.topPages?.map((page: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{page.path}</p>
                    <p className="text-sm text-muted-foreground">
                      {page.uniqueVisitors} unique visitors • {page.averageTime}{" "}
                      avg. time
                    </p>
                  </div>
                  <p className="font-bold">{page.views} views</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Monitor className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Desktop</p>
                  <p className="text-2xl font-bold">
                    {visitorData?.devices?.desktop || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Smartphone className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="text-2xl font-bold">
                    {visitorData?.devices?.mobile || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Tablet className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Tablet</p>
                  <p className="text-2xl font-bold">
                    {visitorData?.devices?.tablet || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Desktop",
                        value: visitorData?.devices?.desktop || 0,
                      },
                      {
                        name: "Mobile",
                        value: visitorData?.devices?.mobile || 0,
                      },
                      {
                        name: "Tablet",
                        value: visitorData?.devices?.tablet || 0,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {visitorData?.devices &&
                      Object.values(visitorData.devices).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
