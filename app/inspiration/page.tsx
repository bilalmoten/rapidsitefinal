import React from "react";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function InspirationPage() {
  const supabase = createClient();
  const { data: websites, error } = await supabase
    .from("websites")
    .select("id, website_name, thumbnail_url")
    .limit(12);

  if (error) {
    console.error("Error fetching websites:", error);
    return <div className="text-red-600">Error fetching inspiration.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inspiration Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((website) => (
          <div
            key={website.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Image
              src={website.thumbnail_url || "/placeholder.svg"}
              alt={website.website_name}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{website.website_name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
