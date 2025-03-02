"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturedBanner, {
  FeaturedWebsite,
} from "@/components/inspiration/FeaturedBanner";
import WebsiteCard from "@/components/inspiration/WebsiteCard";
import FilterBar, { FilterOptions } from "@/components/inspiration/FilterBar";

// Use a more flexible interface to work with both server and client data
interface Website {
  id: number;
  website_name: string;
  website_description?: string;
  thumbnail_url: string;
  subdomain: string;
  industry_type?: string | null;
  features_used?: string[] | null;
  categories?: string[] | null;
  vote_count: number;
  clone_count: number;
  created_at?: string;
  [key: string]: any; // Allow additional properties
}

interface InspirationClientProps {
  featuredWebsites: Website[];
  allWebsites: Website[];
  userVotes: Record<number, boolean>;
  isAuthenticated: boolean;
  availableIndustries: string[];
  availableFeatures: string[];
  availableCategories: string[];
}

export default function InspirationClient({
  featuredWebsites,
  allWebsites,
  userVotes,
  isAuthenticated,
  availableIndustries,
  availableFeatures,
  availableCategories,
}: InspirationClientProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    sort: "newest",
    industryTypes: [],
    features: [],
    categories: [],
  });

  // Keep track of user votes client-side
  const [votes, setVotes] = useState<Record<number, boolean>>(userVotes);

  // Keep track of vote counts client-side to avoid full page refreshes
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>(() => {
    return allWebsites.reduce(
      (acc, website) => {
        acc[website.id] = website.vote_count;
        return acc;
      },
      {} as Record<number, number>
    );
  });

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Function to handle vote updates from WebsiteCard components
  const handleVoteChange = (
    websiteId: number,
    hasVoted: boolean,
    newCount: number
  ) => {
    setVotes((prev) => ({
      ...prev,
      [websiteId]: hasVoted,
    }));

    setVoteCounts((prev) => ({
      ...prev,
      [websiteId]: newCount,
    }));
  };

  // Apply filters and sorting to websites
  const filteredWebsites = useMemo(() => {
    return allWebsites.filter((website) => {
      // Search filter
      if (
        filters.search &&
        !website.website_name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        !(
          website.website_description &&
          website.website_description
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        )
      ) {
        return false;
      }

      // Industry type filter
      if (
        filters.industryTypes.length > 0 &&
        (!website.industry_type ||
          !filters.industryTypes.includes(website.industry_type))
      ) {
        return false;
      }

      // Features filter
      if (filters.features.length > 0) {
        if (!website.features_used || website.features_used.length === 0) {
          return false;
        }

        // Check if any of the selected features exist in the website features
        const hasMatchingFeature = filters.features.some((feature) =>
          website.features_used?.includes(feature)
        );

        if (!hasMatchingFeature) {
          return false;
        }
      }

      // Categories filter
      if (filters.categories.length > 0) {
        if (!website.categories || website.categories.length === 0) {
          return false;
        }

        // Check if any of the selected categories exist in the website categories
        const hasMatchingCategory = filters.categories.some((category) =>
          website.categories?.includes(category)
        );

        if (!hasMatchingCategory) {
          return false;
        }
      }

      return true;
    });
  }, [allWebsites, filters]);

  // Apply sorting to filtered websites
  const sortedWebsites = useMemo(() => {
    return [...filteredWebsites].sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return (
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
          );
        case "popular":
          // Use client-side vote counts for sorting
          return (
            (voteCounts[b.id] || b.vote_count) -
            (voteCounts[a.id] || a.vote_count)
          );
        case "cloned":
          return b.clone_count - a.clone_count;
        default:
          return 0;
      }
    });
  }, [filteredWebsites, filters.sort, voteCounts]);

  // Format featured websites to match FeaturedBanner component's requirements
  const formattedFeaturedWebsites = useMemo(() => {
    return featuredWebsites.map((website) => ({
      id: website.id,
      website_name: website.website_name,
      thumbnail_url: website.thumbnail_url,
      industry_type: website.industry_type || "",
      vote_count: website.vote_count,
      clone_count: website.clone_count,
      subdomain: website.subdomain,
    })) as FeaturedWebsite[];
  }, [featuredWebsites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Inspiration Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Explore website designs created with our platform
          </p>
        </div>

        {isAuthenticated && (
          <Link href="/dashboard">
            <Button className="mt-4 md:mt-0">
              <Plus size={16} className="mr-2" />
              Create Your Own
            </Button>
          </Link>
        )}
      </div>

      {/* Featured Websites Banner */}
      {formattedFeaturedWebsites.length > 0 && (
        <FeaturedBanner
          featuredWebsites={formattedFeaturedWebsites}
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          options={filters}
          onFilterChange={handleFilterChange}
          availableIndustries={availableIndustries}
          availableFeatures={availableFeatures}
          availableCategories={availableCategories}
        />
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedWebsites.map((website) => (
          <WebsiteCard
            key={website.id}
            id={website.id}
            name={website.website_name}
            thumbnailUrl={website.thumbnail_url}
            industryType={website.industry_type || undefined}
            features={website.features_used || undefined}
            voteCount={voteCounts[website.id] || website.vote_count}
            cloneCount={website.clone_count}
            isAuthenticated={isAuthenticated}
            hasVoted={!!votes[website.id]}
            subdomain={website.subdomain}
            onVoteChange={handleVoteChange}
          />
        ))}
      </div>

      {sortedWebsites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No websites found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
