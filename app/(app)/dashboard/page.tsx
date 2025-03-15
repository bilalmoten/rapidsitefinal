import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: websites, error } = await supabase
    .from("websites")
    .select(
      "id, website_name, website_description, thumbnail_url, subdomain, is_public, created_at, last_updated_at"
    )
    .eq("user_id", user.id)
    .neq("isdeleted", "yes");

  if (error) {
    console.error("Error fetching websites:", error);
    return <div className="text-red-600">Error fetching websites.</div>;
  }

  const projectCount = websites.length;

  return (
    <DashboardContent
      user={user}
      websites={websites}
      projectCount={projectCount}
    />
  );
}
