// app/dashboard/editor/[website_id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientEditor from "@/components/ClientEditor";

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
    .select("subdomain, pages")
    .eq("id", params.website_id)
    .single();

  if (websiteError) {
    console.error("Error fetching website:", websiteError);
    return (
      <div>Error fetching website information: {websiteError.message}</div>
    );
  }

  if (!website || !website.pages || website.pages.length === 0) {
    console.error("No pages found for website");
    return <div>No pages found for this website.</div>;
  }

  const initialPageTitle = website.pages[0];
  console.log("Initial page title:", initialPageTitle);

  console.log("Fetching page content");
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("user_id", user.id)
    .eq("website_id", params.website_id)
    .eq("title", initialPageTitle)
    .single();

  if (pageError) {
    console.error("Error fetching page content:", pageError);
    return <div>Error fetching page content: {pageError.message}</div>;
  }

  if (!page) {
    console.error("No page content found");
    return <div>No content found for this page.</div>;
  }

  // Get user's plan and usage data
  const { data: userUsage, error: userUsageError } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (userUsageError) {
    console.error("Error fetching user plan:", userUsageError);
    return <div>Error fetching user plan: {userUsageError.message}</div>;
  }

  // Get user's profile data
  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userDataError) {
    console.error("Error fetching user data:", userDataError);
    return <div>Error fetching user data: {userDataError.message}</div>;
  }

  const userPlan = userUsage?.plan || "free";

  console.log("Rendering ClientEditor");
  return (
    <ClientEditor
      initialPageTitle={initialPageTitle}
      initialContent={page.content || ""}
      userId={user.id}
      websiteId={params.website_id}
      subdomain={website.subdomain}
      pages={website.pages}
      userPlan={userPlan}
      usage={userUsage}
      user={userData}
    />
  );
}
