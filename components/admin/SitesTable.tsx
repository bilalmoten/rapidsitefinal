"use client";

import { useState, useEffect } from "react";
import { Search, Filter, SortAsc, Globe } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Site {
  id: string;
  website_name: string;
  created_at: string;
  published: boolean;
  users: {
    email: string;
  } | null;
}

export default function SitesTable({ initialSites }: { initialSites: Site[] }) {
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [filteredSites, setFilteredSites] = useState<Site[]>(initialSites);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters and search
  useEffect(() => {
    let result = [...sites];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (site) =>
          site.website_name?.toLowerCase().includes(searchLower) ||
          site.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((site) =>
        statusFilter === "published" ? site.published : !site.published
      );
    }

    // Date filter
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);

      result = result.filter((site) => {
        const siteDate = new Date(site.created_at);
        switch (dateFilter) {
          case "today":
            return siteDate >= today;
          case "week":
            return siteDate >= weekAgo;
          case "month":
            return siteDate >= monthAgo;
          case "year":
            return siteDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "name":
          return (a.website_name || "").localeCompare(b.website_name || "");
        case "name-desc":
          return (b.website_name || "").localeCompare(a.website_name || "");
        default: // newest
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    setFilteredSites(result);
  }, [sites, search, statusFilter, dateFilter, sortBy]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("websites").delete().eq("id", id);

      if (error) throw error;

      setSites((prev) => prev.filter((site) => site.id !== id));
    } catch (error) {
      console.error("Error deleting site:", error);
      alert("Failed to delete site");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by site name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-gray-900 text-white rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>

            {/* Date Range */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-gray-900 text-white rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-900 text-white rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
              <SortAsc className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Sites Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Site
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredSites.map((site) => (
                <tr
                  key={site.id}
                  className="hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {site.website_name || "Unnamed Site"}
                        </div>
                        <div className="text-sm text-gray-400">
                          ID: {site.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {site.users?.email || "No owner"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(site.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        site.published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {site.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/sites/${site.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(site.id)}
                        disabled={isLoading}
                        className="text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-900/50 px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredSites.length}</span> of{" "}
              <span className="font-medium">{sites.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                disabled
                className="px-3 py-1 rounded bg-gray-800 text-gray-400 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled
                className="px-3 py-1 rounded bg-gray-800 text-gray-400 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
