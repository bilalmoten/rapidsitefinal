"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";
import Pagination from "@/components/Pagination"; // Adjust the import path as necessary
import Card from "@/components/Card";

interface Website {
  id: string;
  thumbnail_url: string;
  website_name: string;
  website_description?: string;
}

interface WebsiteProps {
  websites: Website[];
}

const Website: React.FC<WebsiteProps> = ({ websites }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(websites.length / itemsPerPage);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedWebsites = websites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="cardContainer pb-10 pt-2 flex flex-wrap justify-center gap-4">
        {paginatedWebsites && paginatedWebsites.length > 0 ? (
          paginatedWebsites.map((website) => (
            <React.Fragment key={website.id}>
              <Card
                image={website.thumbnail_url}
                website_id={website.id}
                heading={website.website_name}
                content={website.website_description || ""}
              />
            </React.Fragment>
          ))
        ) : (
          <p className="text-gray-600">
            No websites found. Click the button above to create a new one.
          </p>
        )}
      </div>
      <div className="w-full flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default Website;
