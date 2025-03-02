"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Users, Star, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function InspirationStats() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all");
  const [topVoted, setTopVoted] = useState<any[]>([]);
  const [topCloned, setTopCloned] = useState<any[]>([]);
  const [topViewed, setTopViewed] = useState<any[]>([]);
  const [featuredSites, setFeaturedSites] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalClones: 0,
    totalViews: 0,
    totalFeatured: 0,
  });

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      // Define date filter based on timeframe
      let dateFilter = {};
      const now = new Date();

      if (timeframe === "week") {
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        dateFilter = { created_at: { gte: lastWeek.toISOString() } };
      } else if (timeframe === "month") {
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        dateFilter = { created_at: { gte: lastMonth.toISOString() } };
      }

      // Fetch top voted websites
      const { data: votedData } = await supabase
        .from("websites")
        .select("id, website_name, thumbnail_url, vote_count, created_at")
        .order("vote_count", { ascending: false })
        .limit(5)
        .match(dateFilter);

      if (votedData) {
        setTopVoted(votedData);
      }

      // Fetch top cloned websites
      const { data: clonedData } = await supabase
        .from("websites")
        .select("id, website_name, thumbnail_url, clone_count, created_at")
        .order("clone_count", { ascending: false })
        .limit(5)
        .match(dateFilter);

      if (clonedData) {
        setTopCloned(clonedData);
      }

      // Fetch top viewed websites
      const { data: viewedData } = await supabase
        .from("websites")
        .select("id, website_name, thumbnail_url, view_count, created_at")
        .order("view_count", { ascending: false })
        .limit(5)
        .match(dateFilter);

      if (viewedData) {
        setTopViewed(viewedData);
      }

      // Fetch featured websites
      const { data: featuredData } = await supabase
        .from("websites")
        .select("id, website_name, thumbnail_url, is_featured, created_at")
        .eq("is_featured", true)
        .limit(10);

      if (featuredData) {
        setFeaturedSites(featuredData);
      }

      // Get total stats
      const { data: statsData } = await supabase
        .from("websites")
        .select("vote_count, clone_count, view_count, is_featured");

      if (statsData) {
        const totals = statsData.reduce(
          (acc, site) => {
            return {
              totalVotes: acc.totalVotes + (site.vote_count || 0),
              totalClones: acc.totalClones + (site.clone_count || 0),
              totalViews: acc.totalViews + (site.view_count || 0),
              totalFeatured: acc.totalFeatured + (site.is_featured ? 1 : 0),
            };
          },
          {
            totalVotes: 0,
            totalClones: 0,
            totalViews: 0,
            totalFeatured: 0,
          }
        );

        setStats(totals);
      }
    } catch (error) {
      console.error("Error fetching inspiration stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = async (
    websiteId: number,
    currentStatus: boolean
  ) => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("websites")
        .update({ is_featured: !currentStatus })
        .eq("id", websiteId);

      if (error) throw error;

      // Refresh the data
      fetchData();
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Inspiration Dashboard</h2>

        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Heart className="mr-2 h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalVotes}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalClones}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="mr-2 h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalViews}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Featured Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="mr-2 h-4 w-4 text-amber-500" />
              <span className="text-2xl font-bold">{stats.totalFeatured}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Voted Websites</CardTitle>
            <CardDescription>Websites with the most votes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 text-center">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Votes</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVoted.length > 0 ? (
                    topVoted.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell>
                          <Link
                            href={`/inspiration/${site.id}`}
                            className="hover:underline"
                          >
                            {site.website_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          {site.vote_count}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDate(site.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleFeatureToggle(site.id, site.is_featured)
                            }
                          >
                            {site.is_featured ? "Unfeature" : "Feature"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Cloned Websites</CardTitle>
            <CardDescription>Websites with the most clones</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 text-center">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Clones</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCloned.length > 0 ? (
                    topCloned.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell>
                          <Link
                            href={`/inspiration/${site.id}`}
                            className="hover:underline"
                          >
                            {site.website_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          {site.clone_count}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDate(site.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleFeatureToggle(site.id, site.is_featured)
                            }
                          >
                            {site.is_featured ? "Unfeature" : "Feature"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Websites</CardTitle>
            <CardDescription>Websites with the most views</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 text-center">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topViewed.length > 0 ? (
                    topViewed.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell>
                          <Link
                            href={`/inspiration/${site.id}`}
                            className="hover:underline"
                          >
                            {site.website_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          {site.view_count}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDate(site.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleFeatureToggle(site.id, site.is_featured)
                            }
                          >
                            {site.is_featured ? "Unfeature" : "Feature"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Websites</CardTitle>
            <CardDescription>
              Currently featured websites in the gallery
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4 text-center">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredSites.length > 0 ? (
                    featuredSites.map((site) => (
                      <TableRow key={site.id}>
                        <TableCell>
                          <Link
                            href={`/inspiration/${site.id}`}
                            className="hover:underline"
                          >
                            {site.website_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                          >
                            Featured
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDate(site.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeatureToggle(site.id, true)}
                          >
                            Unfeature
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No featured websites
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
