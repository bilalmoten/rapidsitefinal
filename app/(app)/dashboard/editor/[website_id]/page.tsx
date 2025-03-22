// app/dashboard/editor/[website_id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientEditor from "@/components/ClientEditor";
import AnonymousUserBanner from "@/components/AnonymousUserBanner";

export default async function EditorPage(props: {
  params: Promise<{ website_id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found, redirecting to login");
    return redirect("/login");
  }

  console.log("Fetching website data for ID:", params.website_id);
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("subdomain, pages, user_id, website_name, is_published")
    .eq("id", params.website_id)
    .single();

  if (websiteError) {
    console.error("Error fetching website:", websiteError);
    return (
      <div>Error fetching website information: {websiteError.message}</div>
    );
  }

  // Check if this website belongs to the current user
  const isOwner = website.user_id === user.id;

  // Anonymous users can only view their own websites
  const isAnonymous = !user.email;
  if (isAnonymous && !isOwner) {
    console.log("Anonymous user trying to access someone else's website");
    return redirect("/dashboard");
  }

  // Validate pages array and filter out any empty strings
  if (!website.pages || !Array.isArray(website.pages)) {
    console.error("No pages array found for website");
    return <div>No pages found for this website.</div>;
  }

  // Filter out empty page names
  const validPages = website.pages.filter((page) => page && page.trim() !== "");

  if (validPages.length === 0) {
    console.error("No valid pages found for website");
    return <div>No valid pages found for this website.</div>;
  }

  const initialPageTitle = validPages[0];
  console.log("Initial page title:", initialPageTitle);

  console.log("Fetching page content");
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("user_id", website.user_id)
    .eq("website_id", params.website_id)
    .eq("title", initialPageTitle)
    .single();

  if (pageError) {
    console.error("Error fetching page:", pageError);
    return <div>Error fetching page content: {pageError.message}</div>;
  }

  if (!page) {
    console.error("No page content found");
    return <div>No content found for this page.</div>;
  }

  // Get user's basic info from users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("email, first_name, last_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
  }

  // Format user data for ClientEditor component
  const formattedUserData = userData
    ? {
        email: userData.email || "",
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar_url: userData.avatar_url,
      }
    : undefined;

  // Get user's usage data from the user_usage table
  const { data: userUsageData, error: usageError } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (usageError) {
    console.error("Error fetching user usage data:", usageError);
    // Continue without usage data, using defaults
  }

  // Use the plan from user_usage if available, otherwise fallback to users table
  const userPlan = userUsageData?.plan || userData?.plan || "free";

  // Combine usage data from user_usage table
  const userUsage = {
    websitesActive: userUsageData?.websites_active || 0,
    websitesGenerated: userUsageData?.websites_generated || 0,
    aiEditsCount: userUsageData?.ai_edits_count || 0,
    plan: userPlan,
    subscription_status: userUsageData?.subscription_status,
    subscription_id: userUsageData?.subscription_id,
  };

  // Show banner only for anonymous users
  const showAnonymousBanner = isAnonymous;

  console.log("Rendering ClientEditor");
  console.log("user plan", userPlan);
  return (
    <>
      {showAnonymousBanner && <AnonymousUserBanner />}
      <ClientEditor
        initialContent={page.content || ""}
        userId={website.user_id}
        websiteId={params.website_id}
        initialPageTitle={initialPageTitle}
        subdomain={website.subdomain}
        pages={validPages}
        userPlan={userPlan}
        usage={userUsage}
        user={formattedUserData}
        websiteName={website.website_name || ""}
        isPublished={website.is_published || false}
      />
    </>
  );
}
