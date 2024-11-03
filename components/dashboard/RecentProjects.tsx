"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";

interface RecentProjectsProps {
  websites: {
    id: string;
    website_name: string;
    website_description: string;
    thumbnail_url: string;
    subdomain: string;
  }[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ websites }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [websitesWithThumbnails, setWebsitesWithThumbnails] =
    useState(websites);
  const [isLoading, setIsLoading] = useState(true);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(websitesWithThumbnails.length / projectsPerPage);

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
      return null;
    }
  };

  useEffect(() => {
    const updateThumbnails = async () => {
      setIsLoading(true);
      const updatedWebsites = await Promise.all(
        websites.map(async (website) => {
          if (!website.thumbnail_url) {
            const thumbnailUrl = await generateThumbnail(
              website.id,
              website.subdomain
            );
            return {
              ...website,
              thumbnail_url: thumbnailUrl || "/placeholder-website.jpg",
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

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="h-32 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
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
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 relative h-32">
                    <Image
                      src={website.thumbnail_url || "/placeholder-website.jpg"}
                      alt={website.website_name}
                      fill
                      sizes="(max-width: 640px) 100vw, 
                             (max-width: 768px) 50vw, 
                             (max-width: 1024px) 33vw, 
                             25vw"
                      className="rounded-md object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "/placeholder-website.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">
                      {website.website_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {website.website_description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
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
