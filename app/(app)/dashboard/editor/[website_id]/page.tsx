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
    .select("subdomain, pages, user_id")
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

  // Get user's plan and usage data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const userPlan = userData?.plan || "free";
  const userUsage = {
    websitesActive: userData?.websites_active || 0,
    websitesGenerated: userData?.websites_generated || 0,
    aiEditsCount: userData?.ai_edits_count || 0,
    plan: userData?.plan || "free",
  };

  // Show banner only for anonymous users
  const showAnonymousBanner = isAnonymous;

  console.log("Rendering ClientEditor");
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
        user={userData}
      />
    </>
  );
}
