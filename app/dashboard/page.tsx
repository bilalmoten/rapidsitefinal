import React, { useState } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewWebsiteDialog from "@/components/NewWebsiteDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";
import Image from "next/image";

import BWT from "@/components/design/BWT";
import Card from "@/components/design/Card";
import Last from "@/components/design/Last";
import Sidebar from "@/components/design/Sidebar";
import Pagination from "@/components/design/Pagination";
import Website from "./website";
import ModeToggle from "@/components/modetoggle";
import Navbar_new from "@/components/navbar-new";
export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const items = [
    {
      image: "/image1.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
    {
      image: "/image2.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
    {
      image: "/image3.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
    {
      image: "/image4.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
    {
      image: "/image5.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
    {
      image: "/image6.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
    {
      image: "/image7.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
    {
      image: "/image8.png",
      heading: "Personal Portfolio",
      content: "Created 6 days ago",
    },
  ];

  if (!user) {
    return redirect("/login");
  }

  const { data: websites, error } = await supabase
    .from("websites")
    .select("id, website_name, website_description, thumbnail_url")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching websites:", error);
    return <div className="text-red-600">Error fetching websites.</div>;
  }

  return (
    // <div className="container mx-auto p-4">
    //   <nav className="bg-white shadow-sm">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex justify-between items-center py-4">
    //         <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
    //         <NewWebsiteDialog userId={user.id}>
    //           <Button>
    //             <PlusCircle className="mr-2 h-4 w-4" />
    //             New Website
    //           </Button>
    //         </NewWebsiteDialog>
    //       </div>
    //     </div>
    //   </nav>

    //   <div className="container mx-auto p-4">
    //     <h1 className="text-2xl font-bold mb-4">Your Websites</h1>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    //       {websites && websites.length > 0 ? (
    //         websites.map((website) => (
    //           <div
    //             key={website.id}
    //             className="bg-white shadow-md rounded-lg p-4 text-black"
    //           >
    //             <img
    //               src={website.thumbnail_url}
    //               alt={website.website_name}
    //               className="w-full h-32 object-cover rounded-t-lg"
    //             />
    //             <h2 className="text-lg font-semibold mt-2">
    //               {website.website_name}
    //             </h2>
    //             <p className="text-sm mt-2">
    //               {website.website_description || ""}
    //             </p>
    //             <div className="flex justify-between mt-4">
    //               <Link href={`/dashboard/editor/${website.id}`}>
    //                 <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
    //                   Edit
    //                 </button>
    //               </Link>
    //               <Link href={`/preview/${website.id}`}>
    //                 <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
    //                   Preview
    //                 </button>
    //               </Link>
    //               <DeleteWebsiteDialog
    //                 websiteId={website.id}
    //                 websiteName={website.website_name}
    //               />
    //             </div>
    //           </div>
    //         ))
    //       ) : (
    //         <p className="text-gray-600">
    //           No websites found. Click the button above to create a new one.
    //         </p>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <main className="flex">
      <Sidebar user={user.id} />
      <div className="container px-10 py-5">
        {/* <div>
           <div className="heading font-[700] text-[22px]">Quick Start</div>
          <ModeToggle />
          <Navbar_new email={user.email ?? ""} id={user.id} />
        </div> */}
        <Website websites={websites} />
        <BWT />
        <Last />
      </div>
    </main>
  );
}
