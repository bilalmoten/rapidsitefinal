import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewWebsiteDialog from "@/components/NewWebsiteDialog";
import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, PlusCircle } from "lucide-react";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";
import ModeToggle from "@/components/mode-toggle";
import Sidebar from "@/components/Sidebar2";
import Website from "@/components/website";
import BWT from "@/components/BWT";
import Last from "@/components/Last";

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
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching websites:", error);
    return <div className="text-red-600">Error fetching websites.</div>;
  }

  return (
    <main className="flex">
      {/* <Sidebar user={user.id} /> */}
      <div className="container px-10 py-5">
        <div className="heading font-[700] text-[22px]">Quick Start</div>
        <Website websites={websites} />
        <BWT />
        <Last />
      </div>
    </main>
  );
}
