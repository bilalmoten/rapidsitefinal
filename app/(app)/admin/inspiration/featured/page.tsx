import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Star, StarOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

// Define types that match the actual Supabase response structure
type WebsiteRow = {
  id: number;
  website_name: string;
  thumbnail_url: string;
  industry_type: string | null;
  vote_count: number;
  clone_count: number;
  view_count: number | null;
  is_featured: boolean;
  created_at: string;
  subdomain: string;
  users: { email: string }[];
};

export default async function FeaturedWebsitesPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  if (user.email !== "bilalmoten2@gmail.com") {
    redirect("/dashboard");
  }

  // Get featured websites
  const { data: featuredWebsites, error: featuredError } = await supabase
    .from("websites")
    .select(
      "id, website_name, thumbnail_url, industry_type, vote_count, clone_count, view_count, is_featured, created_at, subdomain, users(email)"
    )
    .eq("is_featured", true)
    .eq("is_public", true)
    .order("vote_count", { ascending: false });

  if (featuredError) {
    console.error("Error fetching featured websites:", featuredError);
    return <div className="text-red-500">Error loading featured websites</div>;
  }

  // Get top voted websites that are not featured
  const { data: topWebsites, error: topError } = await supabase
    .from("websites")
    .select(
      "id, website_name, thumbnail_url, industry_type, vote_count, clone_count, view_count, is_featured, created_at, subdomain, users(email)"
    )
    .eq("is_public", true)
    .eq("is_featured", false)
    .order("vote_count", { ascending: false })
    .limit(10);

  if (topError) {
    console.error("Error fetching top websites:", topError);
    return <div className="text-red-500">Error loading top websites</div>;
  }

  const handleFeatureToggle = async (
    websiteId: number,
    currentStatus: boolean
  ) => {
    "use server";

    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from("websites")
        .update({ is_featured: !currentStatus })
        .eq("id", websiteId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating featured status:", error);
    }

    // This will refresh the page with the new data
    redirect("/admin/inspiration/featured");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              href="/admin/inspiration"
              className="mr-4 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Manage Featured Websites
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Websites */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Currently Featured Websites
          </h2>

          {featuredWebsites && featuredWebsites.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Website</TableHead>
                    <TableHead className="text-gray-300">Industry</TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Votes
                    </TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Clones
                    </TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Views
                    </TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredWebsites.map((website: WebsiteRow) => (
                    <TableRow key={website.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center space-x-3">
                          <div className="relative h-10 w-16 overflow-hidden rounded">
                            <Image
                              src={website.thumbnail_url || "/placeholder.svg"}
                              alt={website.website_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {website.website_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {website.users && website.users[0]
                                ? website.users[0].email
                                : "No user"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {website.industry_type ? (
                          <Badge variant="outline" className="text-gray-300">
                            {website.industry_type}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-gray-200">
                        {website.vote_count}
                      </TableCell>
                      <TableCell className="text-right text-gray-200">
                        {website.clone_count}
                      </TableCell>
                      <TableCell className="text-right text-gray-200">
                        {website.view_count || 0}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDate(website.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <form
                            action={handleFeatureToggle.bind(
                              null,
                              website.id,
                              true
                            )}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-500"
                            >
                              <StarOff size={16} />
                            </Button>
                          </form>
                          <Link
                            href={`/inspiration/${website.id}`}
                            target="_blank"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-400"
                            >
                              <ExternalLink size={16} />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              No featured websites found
            </div>
          )}
        </div>

        {/* Top Websites (Not Featured) */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Top Websites (Not Featured)
          </h2>

          {topWebsites && topWebsites.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Website</TableHead>
                    <TableHead className="text-gray-300">Industry</TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Votes
                    </TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Clones
                    </TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Views
                    </TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topWebsites.map((website: WebsiteRow) => (
                    <TableRow key={website.id} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center space-x-3">
                          <div className="relative h-10 w-16 overflow-hidden rounded">
                            <Image
                              src={website.thumbnail_url || "/placeholder.svg"}
                              alt={website.website_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {website.website_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {website.users && website.users[0]
                                ? website.users[0].email
                                : "No user"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {website.industry_type ? (
                          <Badge variant="outline" className="text-gray-300">
                            {website.industry_type}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-gray-200">
                        {website.vote_count}
                      </TableCell>
                      <TableCell className="text-right text-gray-200">
                        {website.clone_count}
                      </TableCell>
                      <TableCell className="text-right text-gray-200">
                        {website.view_count || 0}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDate(website.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <form
                            action={handleFeatureToggle.bind(
                              null,
                              website.id,
                              false
                            )}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-amber-500"
                            >
                              <Star size={16} />
                            </Button>
                          </form>
                          <Link
                            href={`/inspiration/${website.id}`}
                            target="_blank"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-400"
                            >
                              <ExternalLink size={16} />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              No websites found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
