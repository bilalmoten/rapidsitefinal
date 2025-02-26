import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import SubscriberTable from "@/components/admin/SubscriberTable";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export default async function NewsletterAdmin() {
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

  // Fetch subscribers
  const { data: subscribers, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch subscribers:", error);
    throw error;
  }

  // Calculate statistics
  const activeSubscribers =
    subscribers?.filter((s) => s.status === "active").length || 0;
  const inactiveSubscribers =
    subscribers?.filter((s) => s.status === "inactive").length || 0;
  const unsubscribed =
    subscribers?.filter((s) => s.status === "unsubscribed").length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Newsletter Management
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Subscribers
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {subscribers?.length || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600 opacity-80" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Active</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {activeSubscribers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Inactive</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {inactiveSubscribers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Unsubscribed</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {unsubscribed}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Subscriber List
              </h2>
              <div className="text-sm text-gray-500">
                Showing {subscribers?.length || 0} subscribers
              </div>
            </div>
          </div>
          <div className="p-6">
            <SubscriberTable initialSubscribers={subscribers || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
