import React from "react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturedBanner from "@/components/inspiration/FeaturedBanner";
import WebsiteCard from "@/components/inspiration/WebsiteCard";
import FilterBar, { FilterOptions } from "@/components/inspiration/FilterBar";
import InspirationClient from "@/components/inspiration/InspirationClient";

export const dynamic = "force-dynamic";

export default async function InspirationPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // Get all available options for filters
  const { data: industryTypes } = await supabase
    .from("websites")
    .select("industry_type")
    .not("industry_type", "is", null)
    .order("industry_type");

  const { data: features } = await supabase
    .from("websites")
    .select("features_used");

  const { data: categories } = await supabase
    .from("websites")
    .select("categories");

  // Extract unique values using Array.from instead of spread operator
  const uniqueIndustries = Array.from(
    new Set(industryTypes?.map((item) => item.industry_type))
  ).filter(Boolean) as string[];

  const uniqueFeatures = Array.from(
    new Set(features?.flatMap((item) => item.features_used || []))
  ).filter(Boolean) as string[];

  const uniqueCategories = Array.from(
    new Set(categories?.flatMap((item) => item.categories || []))
  ).filter(Boolean) as string[];

  // Get featured websites
  const { data: featuredWebsites, error: featuredError } = await supabase
    .from("websites")
    .select(
      "id, website_name, thumbnail_url, industry_type, vote_count, clone_count, subdomain"
    )
    .eq("is_featured", true)
    .eq("is_public", true)
    .order("vote_count", { ascending: false })
    .limit(5);

  if (featuredError) {
    console.error("Error fetching featured websites:", featuredError);
  }

  // Get all public websites (for gallery)
  const { data: allWebsites, error } = await supabase
    .from("websites")
    .select(
      `
      id, 
      website_name, 
      website_description,
      thumbnail_url, 
      subdomain,
      industry_type,
      features_used,
      categories,
      vote_count,
      clone_count,
      created_at
    `
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching websites:", error);
    return (
      <div className="text-red-600">Error fetching inspiration galleries.</div>
    );
  }

  // Check if user has voted on any of these websites
  let userVotes: Record<number, boolean> = {};

  if (isAuthenticated) {
    const { data: votes, error: votesError } = await supabase
      .from("website_votes")
      .select("website_id")
      .eq("user_id", user.id);

    if (!votesError && votes) {
      userVotes = votes.reduce(
        (acc, vote) => {
          acc[vote.website_id] = true;
          return acc;
        },
        {} as Record<number, boolean>
      );
    }
  }

  return (
    <InspirationClient
      featuredWebsites={featuredWebsites || []}
      allWebsites={allWebsites || []}
      userVotes={userVotes}
      isAuthenticated={isAuthenticated}
      availableIndustries={uniqueIndustries}
      availableFeatures={uniqueFeatures}
      availableCategories={uniqueCategories}
    />
  );
}
