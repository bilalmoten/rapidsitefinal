"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Eye, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";

interface RecentProjectsProps {
  websites: any[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ websites }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const websitesPerPage = 3;

  const pageCount = Math.ceil(websites.length / websitesPerPage);
  const offset = currentPage * websitesPerPage;
  const currentWebsites = websites.slice(offset, offset + websitesPerPage);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentWebsites.map((website, index) => (
          <motion.div
            key={website.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={website.thumbnail_url || "/placeholder.svg"}
              alt={website.website_name}
              width={300}
              height={200}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{website.website_name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {website.website_description || "No description"}
              </p>
              <div className="flex justify-between">
                <Link href={`/dashboard/chat/${website.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </Link>
                <Link href={`/dashboard/edit/${website.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <DeleteWebsiteDialog
                  websiteId={website.id}
                  websiteName={website.website_name}
                >
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DeleteWebsiteDialog>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))
            }
            disabled={currentPage === pageCount - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecentProjects;
