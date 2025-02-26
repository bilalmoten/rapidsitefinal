import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DomainManager } from "@/components/domains/DomainManager";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe, RefreshCw, Search, Lock, Trash2, BarChart } from "lucide-react";
import { RegenerateWebsiteButton } from "@/components/dashboard/RegenerateWebsiteButton";
import { EditWebsiteDialog } from "@/components/dashboard/EditWebsiteDialog";
import { DeleteWebsiteDialog } from "@/components/DeleteWebsiteDialog";
import { SEOSettings } from "@/components/dashboard/SEOSettings";
import SiteAnalytics from "@/components/dashboard/SiteAnalytics";

export default async function WebsiteSettingsPage(props: {
  params: Promise<{ website_id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("*")
    .eq("id", params.website_id)
    .single();

  if (websiteError || !website) {
    return (
      <div className="p-4 text-white">
        Error fetching website information:{" "}
        {websiteError?.message || "Website not found"}
      </div>
    );
  }

  // Check if user owns this website
  if (website.user_id !== user.id) {
    return redirect("/dashboard");
  }

  // Get user's plan
  const { data: userUsage } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const userPlan = userUsage?.plan || "free";

  // Get user data
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Analytics Section */}
      <div className="w-full bg-[#0a0a0b00] border border-neutral-70 rounded-lg backdrop-blur-md">
        <div className="p-6">
          <h2 className="text-[28px] font-medium text-white mb-6 flex items-center">
            <BarChart className="w-6 h-6 mr-3 text-primary-main" />
            Analytics
          </h2>
          <SiteAnalytics subdomain={website.subdomain} />
        </div>
      </div>

      {/* General Settings */}
      <div className="w-full bg-[#0a0a0b00] border border-neutral-70 rounded-lg backdrop-blur-md">
        <div className="p-6">
          <h2 className="text-[28px] font-medium text-white mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-3 text-primary-main" />
            General Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
              <div>
                <p className="text-neutral-20 text-sm mb-1">Website Name</p>
                <p className="text-primary-main text-[20px] font-medium">
                  {website.website_name}
                </p>
              </div>
              <EditWebsiteDialog
                websiteId={params.website_id}
                currentName={website.website_name}
                currentSubdomain={website.subdomain}
                type="name"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-70 text-neutral-20 hover:bg-neutral-80/10"
                >
                  Edit
                </Button>
              </EditWebsiteDialog>
            </div>
            <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
              <div>
                <p className="text-neutral-20 text-sm mb-1">Subdomain</p>
                <p className="text-primary-main text-[20px] font-medium">
                  {website.subdomain}.rapidai.website
                </p>
              </div>
              <EditWebsiteDialog
                websiteId={params.website_id}
                currentName={website.website_name}
                currentSubdomain={website.subdomain}
                type="subdomain"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-70 text-neutral-20 hover:bg-neutral-80/10"
                >
                  Edit
                </Button>
              </EditWebsiteDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Management */}
      <div className="w-full bg-[#0a0a0b00] border border-neutral-70 rounded-lg backdrop-blur-md">
        <DomainManager
          websiteId={params.website_id}
          userPlan={userPlan}
          usage={{
            websitesActive: userUsage?.websites_active || 0,
            websitesGenerated: userUsage?.websites_generated || 0,
            aiEditsCount: userUsage?.ai_edits_count || 0,
            plan: userPlan,
            subscription_status: userUsage?.subscription_status,
            subscription_id: userUsage?.subscription_id,
          }}
          user={userData}
        />
      </div>

      {/* SEO Settings */}
      <div className="w-full bg-[#0a0a0b00] border border-neutral-70 rounded-lg backdrop-blur-md">
        <SEOSettings
          websiteId={params.website_id}
          initialSeoIndexed={website.seo_indexed}
          initialIsPublic={website.is_public}
        />
      </div>

      {/* Danger Zone */}
      <div className="w-full bg-[#0a0a0b00] border border-red-500/20 rounded-lg backdrop-blur-md">
        <div className="p-6">
          <h2 className="text-[28px] font-medium text-red-500 mb-6 flex items-center">
            <Lock className="w-6 h-6 mr-3" />
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
              <div>
                <p className="text-neutral-20 text-sm mb-1">
                  Regenerate Website
                </p>
                <p className="text-neutral-40 text-sm">
                  Delete all current pages and regenerate the website from
                  scratch using the original chat. Use this if there were errors
                  in the generation process.
                </p>
              </div>
              <RegenerateWebsiteButton websiteId={params.website_id} />
            </div>
            <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
              <div>
                <p className="text-neutral-20 text-sm mb-1">Delete Website</p>
                <p className="text-neutral-40 text-sm">
                  Permanently delete this website and all its data
                </p>
              </div>
              <DeleteWebsiteDialog
                websiteId={params.website_id}
                websiteName={website.website_name}
              >
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Website
                </Button>
              </DeleteWebsiteDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
