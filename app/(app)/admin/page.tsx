import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Users,
  Globe,
  Wand2,
  Mail,
  Layout,
  Calendar,
} from "lucide-react";

export default async function AdminDashboard() {
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

  // Get the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetch basic stats
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

  const { data: pages } = await supabase.from("pages").select("*");

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*");

  const { data: users } = await supabase.from("users").select("*");

  const { data: usage } = await supabase.from("user_usage").select("*");

  // Calculate stats
  const totalSites = sites?.length || 0;
  const totalPages = pages?.length || 0;
  const totalUsers = users?.length || 0;
  const totalSubscribers = subscribers?.length || 0;
  const totalAiEdits =
    usage?.reduce((sum, record) => sum + (record.ai_edits_count || 0), 0) || 0;

  // Get recent sites (last 5)
  const recentSites = sites?.slice(0, 5) || [];

  // Calculate sites in last 30 days
  const recentSitesCount =
    sites?.filter((site) => new Date(site.created_at) > thirtyDaysAgo).length ||
    0;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Sites</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalSites}
                </p>
              </div>
              <Globe className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Last 30 Days
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {recentSitesCount}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Pages</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalPages}
                </p>
              </div>
              <Layout className="w-8 h-8 text-indigo-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-emerald-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Newsletter Subscribers
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalSubscribers}
                </p>
              </div>
              <Mail className="w-8 h-8 text-purple-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total AI Edits
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalAiEdits}
                </p>
              </div>
              <Wand2 className="w-8 h-8 text-amber-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/newsletter"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Newsletter Management
            </h3>
            <p className="text-gray-400">
              Manage subscribers and view analytics
            </p>
          </Link>

          <Link
            href="/admin/sites"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Site Management
            </h3>
            <p className="text-gray-400">
              View and manage all created websites
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              User Management
            </h3>
            <p className="text-gray-400">Manage users and permissions</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Websites
            </h2>
            <Link
              href="/admin/sites"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Sites →
            </Link>
          </div>
          <div className="space-y-4">
            {recentSites.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {recentSites.map((site) => (
                  <div key={site.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">
                            {site.website_name || "Unnamed Site"}
                          </p>
                          <span className="text-gray-500">•</span>
                          <p className="text-sm text-gray-400">
                            {site.users?.email || "No user"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-500">
                            Created{" "}
                            {new Date(site.created_at).toLocaleDateString()}
                          </p>
                          <span className="text-gray-700">•</span>
                          <p className="text-sm text-gray-500">
                            {site.published ? "Published" : "Draft"}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/admin/sites/${site.id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No websites created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
