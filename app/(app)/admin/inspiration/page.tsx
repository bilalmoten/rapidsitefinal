import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InspirationStats from "@/components/admin/InspirationStats";

export default async function AdminInspirationPage() {
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Inspiration Gallery Management
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/admin/inspiration/featured"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-white">
                Featured Websites
              </h3>
            </div>
            <p className="text-gray-400">
              Manage which websites appear in the featured banner
            </p>
          </Link>

          <Link
            href="/admin/inspiration/analytics"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">
                Gallery Analytics
              </h3>
            </div>
            <p className="text-gray-400">
              View detailed statistics about the inspiration gallery
            </p>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Overview</h2>

          <div className="text-white">
            <InspirationStats />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/inspiration"
            target="_blank"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              View Public Gallery
            </h3>
            <p className="text-gray-400">
              Open the inspiration gallery as visible to users
            </p>
          </Link>

          <Link
            href="/admin/website-submissions"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Website Submissions
            </h3>
            <p className="text-gray-400">
              Review and approve website submissions
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
