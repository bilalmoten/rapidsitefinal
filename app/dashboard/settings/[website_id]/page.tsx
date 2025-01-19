import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DomainManager } from "@/components/domains/DomainManager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe, RefreshCw, Search, Lock, Trash2 } from "lucide-react";
import { RegenerateWebsiteButton } from "@/components/dashboard/RegenerateWebsiteButton";
import { EditWebsiteDialog } from "@/components/dashboard/EditWebsiteDialog";
import { DeleteWebsiteDialog } from "@/components/DeleteWebsiteDialog";
import { SEOSettings } from "@/components/dashboard/SEOSettings";

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
      <div className="p-4">
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
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            General
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Website Name</p>
                <p className="text-sm text-muted-foreground">
                  {website.website_name}
                </p>
              </div>
              <EditWebsiteDialog
                websiteId={params.website_id}
                currentName={website.website_name}
                currentSubdomain={website.subdomain}
                type="name"
              >
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </EditWebsiteDialog>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Subdomain</p>
                <p className="text-sm text-muted-foreground">
                  {website.subdomain}.aiwebsitebuilder.tech
                </p>
              </div>
              <EditWebsiteDialog
                websiteId={params.website_id}
                currentName={website.website_name}
                currentSubdomain={website.subdomain}
                type="subdomain"
              >
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </EditWebsiteDialog>
            </div>
          </div>
        </Card>

        {/* Domain Management */}
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

        {/* SEO Settings */}
        <SEOSettings
          websiteId={params.website_id}
          initialSeoIndexed={website.seo_indexed}
          initialIsPublic={website.is_public}
        />

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600">
            <Lock className="w-5 h-5 mr-2" />
            Danger Zone
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <p className="font-medium">Regenerate Website</p>
                <p className="text-sm text-muted-foreground">
                  Delete all current pages and regenerate the website from
                  scratch using the original chat. Use this if there were errors
                  in the generation process.
                </p>
              </div>
              <RegenerateWebsiteButton websiteId={params.website_id} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium">Delete Website</p>
                <p className="text-sm text-muted-foreground">
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
        </Card>
      </div>
    </div>
  );
}
