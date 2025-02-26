import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SitesTable from "@/components/admin/SitesTable";

export default async function SitesManagement() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  if (user.email !== "bilalmoten2@gmail.com") {
    redirect("/dashboard");
  }

  // Fetch all sites with user info
  const { data: sites } = await supabase
    .from("websites")
    .select(
      `
      *,
      users (
        email
      )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Site Management</h1>
            </div>
            <div className="text-sm text-gray-400">
              {sites?.length || 0} total sites
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SitesTable initialSites={sites || []} />
      </div>
    </div>
  );
}
