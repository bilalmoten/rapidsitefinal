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

  if (!user) {
    return redirect("/login");
  }

  const { data: websites, error } = await supabase
    .from("websites")
    .select("id, website_name, website_description, thumbnail_url")
    .eq("user_id", user.id)
    .neq("isdeleted", "yes");

  if (error) {
    console.error("Error fetching websites:", error);
    return <div className="text-red-600">Error fetching websites.</div>;
  }

  return (
    <main className="flex">
      <Sidebar user={user.id} />
      <div className="flex-1 ml-[200px] px-6 py-5">
        <Website websites={websites} />
        {/* <BWT /> */}
        {/* <Last /> */}
      </div>
    </main>
  );
}
