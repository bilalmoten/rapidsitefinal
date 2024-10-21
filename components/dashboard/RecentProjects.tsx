"use client";

import React, { useState } from "react";
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
  const projectsPerPage = 4;
  const totalPages = Math.ceil(websites.length / projectsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const displayedWebsites = websites.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
      {websites.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedWebsites.map((website) => (
              <div
                key={website.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <Image
                      src={website.thumbnail_url}
                      alt={website.website_name}
                      width={100}
                      height={100}
                      className="rounded-md w-full h-32 object-cover"
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
