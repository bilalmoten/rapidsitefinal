"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Trash2,
  Edit,
  Settings,
  LayoutGrid,
  List,
  ExternalLink,
  Clock,
  Globe,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import NewWebsiteDialog from "@/components/NewWebsiteDialog";

interface Website {
  id: string;
  website_name: string;
  website_description: string;
  thumbnail_url: string;
  subdomain: string;
  is_public: boolean;
  created_at: string;
  last_updated_at: string;
}

interface RecentProjectsProps {
  websites: Website[];
  userId: string;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({
  websites: initialWebsites,
  userId,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("updated");
  const [searchQuery, setSearchQuery] = useState("");
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const filtered = initialWebsites.filter((website) =>
      website.website_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.website_name.localeCompare(b.website_name);
        case "name-desc":
          return b.website_name.localeCompare(a.website_name);
        case "updated":
          return (
            new Date(b.last_updated_at).getTime() -
            new Date(a.last_updated_at).getTime()
          );
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    setWebsites(sorted);
  }, [initialWebsites, searchQuery, sortBy]);

  const ProjectCard = ({ website }: { website: Website }) => (
    <div className="bg-card hover:bg-accent/50 rounded-xl border border-border shadow-sm transition-all duration-200 group">
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl border-b border-border">
        <Image
          src={website.thumbnail_url || "/placeholder-image.jpg"}
          alt={website.website_name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Link href={`/dashboard/editor/${website.id}`}>
            <Button size="sm" variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link
            href={`https://${website.subdomain}.aiwebsitebuilder.tech`}
            target="_blank"
          >
            <Button size="sm" variant="secondary">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit
            </Button>
          </Link>
          <Link href={`/dashboard/settings/${website.id}`}>
            <Button size="sm" variant="secondary">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {website.website_name}
          </h3>
          <Badge variant={website.is_public ? "default" : "secondary"}>
            {website.is_public ? "Live" : "Building"}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {website.website_description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="truncate">
              {website.subdomain}.aiwebsitebuilder.tech
            </span>
          </div>
          <span className="text-xs">
            Updated {new Date(website.last_updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  const ProjectRow = ({ website }: { website: Website }) => (
    <div className="flex items-center gap-4 p-4 bg-card hover:bg-accent/50 rounded-lg border border-border transition-all duration-200">
      <div className="relative h-20 aspect-video rounded-md overflow-hidden border border-border">
        <Image
          src={website.thumbnail_url || "/placeholder-image.jpg"}
          alt={website.website_name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 200px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {website.website_name}
          </h3>
          <Badge variant={website.is_public ? "default" : "secondary"}>
            {website.is_public ? "Live" : "Building"}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
          {website.website_description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{website.subdomain}.aiwebsitebuilder.tech</span>
          </div>
          <span className="text-xs">
            Updated {new Date(website.last_updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/dashboard/editor/${website.id}`}>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Link
          href={`https://${website.subdomain}.aiwebsitebuilder.tech`}
          target="_blank"
        >
          <Button size="sm" variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit
          </Button>
        </Link>
        <Link href={`/dashboard/settings/${website.id}`}>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Projects</h2>
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-4 space-y-4"
            >
              <div className="aspect-video bg-muted animate-pulse rounded-lg" />
              <div className="h-6 bg-muted animate-pulse rounded-md w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Projects</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="created">Recently Created</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-lg border border-border p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {websites.length === 0 && !isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first website project to get started
              </p>
              <NewWebsiteDialog userId={userId}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </NewWebsiteDialog>
            </div>
          ) : (
            <>
              <NewWebsiteDialog userId={userId}>
                <div className="bg-card hover:bg-accent/50 rounded-xl border border-border shadow-sm transition-all duration-200 group cursor-pointer">
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-xl border-b border-border bg-gradient-to-br from-primary/20 to-primary/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      New Project
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Start a new website project
                    </p>
                  </div>
                </div>
              </NewWebsiteDialog>

              <div className="bg-card hover:bg-accent/50 rounded-xl border border-border shadow-sm transition-all duration-200 group cursor-pointer">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-xl border-b border-border bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Inspiration
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-purple-500 border-purple-500"
                    >
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Browse and clone from our gallery of AI-created websites
                  </p>
                </div>
              </div>

              {websites.map((website) => (
                <ProjectCard key={website.id} website={website} />
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <NewWebsiteDialog userId={userId}>
              <Button className="flex-1 gap-2" size="lg">
                <Plus className="h-5 w-5" />
                New Project
              </Button>
            </NewWebsiteDialog>
            <Button
              className="flex-1 gap-2"
              size="lg"
              variant="outline"
              disabled
            >
              <Sparkles className="h-5 w-5" />
              Inspiration
              <Badge variant="outline" className="ml-2">
                Coming Soon
              </Badge>
            </Button>
          </div>

          {websites.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first website project to get started
              </p>
              <NewWebsiteDialog userId={userId}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </NewWebsiteDialog>
            </div>
          ) : (
            websites.map((website) => (
              <ProjectRow key={website.id} website={website} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
