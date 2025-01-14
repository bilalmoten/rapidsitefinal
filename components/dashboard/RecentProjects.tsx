"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface RecentProjectsProps {
  websites: {
    id: string;
    website_name: string;
    website_description: string;
    thumbnail_url: string;
    subdomain: string;
  }[];
}

import { MoreHorizontal, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RegenerateWebsiteDialog } from "@/components/dashboard/RegenerateWebsiteDialog";

const RecentProjects: React.FC<RecentProjectsProps> = ({ websites }) => {
  const supabase = createClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [websitesWithThumbnails, setWebsitesWithThumbnails] =
    useState(websites);
  const [isLoading, setIsLoading] = useState(true);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(websitesWithThumbnails.length / projectsPerPage);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleRegenerate = async (websiteId: string) => {
    setIsProcessing(true);
    try {
      const trackResponse = await fetch("/api/track-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      if (!trackResponse.ok) {
        const error = await trackResponse.json();
        if (error.error === "LIMIT_REACHED") {
          toast.error(
            "You've reached your plan's website generation limit. Please upgrade to continue."
          );
          setIsProcessing(false);
          return;
        }
        throw new Error("Failed to track website generation");
      }

      const response = await fetch(
        `https://api2.azurewebsites.net/api/code_website?website_id=${websiteId}&user_id=${user?.id}&model=o1-mini`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate website");
      }

      window.location.href = `/dashboard/editor/${websiteId}`;
    } catch (error) {
      console.error("Error regenerating website:", error);
      alert(
        "An error occurred while regenerating your website. Please try again."
      );
      setIsProcessing(false);
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const generateThumbnail = async (websiteId: string, subdomain: string) => {
    try {
      const response = await fetch("/api/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteId, subdomain }),
      });

      if (!response.ok) throw new Error("Failed to generate thumbnail");

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      return "https://lervpgatcoelsswuahga.supabase.co/storage/v1/object/public/website-thumbnails/public/placeholder-website.jpg";
    }
  };

  useEffect(() => {
    const updateThumbnails = async () => {
      setIsLoading(true);
      const updatedWebsites = await Promise.all(
        websites.map(async (website) => {
          if (
            !website.thumbnail_url ||
            website.thumbnail_url === "https://example.com/placeholder"
          ) {
            const thumbnailUrl = await generateThumbnail(
              website.id,
              website.subdomain
            );
            return {
              ...website,
              thumbnail_url:
                thumbnailUrl ||
                "https://lervpgatcoelsswuahga.supabase.co/storage/v1/object/public/website-thumbnails/public/placeholder-website.jpg",
            };
          }
          return website;
        })
      );
      setWebsitesWithThumbnails(updatedWebsites);
      setIsLoading(false);
    };

    updateThumbnails();
  }, [websites]);

  const displayedWebsites = websitesWithThumbnails.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  if (isProcessing) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full px-4">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Regenerating your website...</p>
        <p className="mt-2 text-sm text-gray-500">
          This may take a few minutes. You'll be redirected when it's ready.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border shadow-sm p-4 animate-pulse"
            >
              <div className="h-32 bg-muted rounded-md border border-border mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="flex justify-between pt-4 border-t border-border">
                <div className="h-8 w-20 bg-muted rounded"></div>
                <div className="h-8 w-20 bg-muted rounded"></div>
                <div className="h-8 w-20 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
      {websitesWithThumbnails.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedWebsites.map((website) => (
              <div
                key={website.id}
                className="bg-card hover:bg-accent/50 rounded-lg border border-border shadow-sm p-4 transition-colors"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 relative h-32 rounded-md overflow-hidden border border-border">
                    <Image
                      src={
                        website.thumbnail_url ||
                        "https://lervpgatcoelsswuahga.supabase.co/storage/v1/object/public/website-thumbnails/public/placeholder-website.jpg"
                      }
                      alt={website.website_name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {website.website_name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {website.website_description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <Link href={`/dashboard/editor/${website.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <a
                      href={`https://${website.subdomain}.aiwebsitebuilder.tech`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </a>
                    <DeleteWebsiteDialog
                      websiteId={website.id}
                      websiteName={website.website_name}
                    >
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </DeleteWebsiteDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedWebsiteId(website.id);
                            setRegenerateDialogOpen(true);
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={prevPage}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="mx-2">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                onClick={nextPage}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <RegenerateWebsiteDialog
                open={regenerateDialogOpen}
                onOpenChange={setRegenerateDialogOpen}
                onConfirm={() => {
                  setRegenerateDialogOpen(false);
                  handleRegenerate(selectedWebsiteId);
                }}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600">No recent projects found.</p>
      )}
    </div>
  );
};

export default RecentProjects;
