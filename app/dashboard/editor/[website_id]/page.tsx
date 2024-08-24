// app/dashboard/editor/[website_id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientEditor from "@/components/ClientEditor";

export default async function EditorPage({
  params,
}: {
  params: { website_id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("subdomain, pages")
    .eq("id", params.website_id)
    .single();

  if (websiteError) {
    console.error("Error fetching website:", websiteError);
    return <div>Error fetching website information.</div>;
  }

  const initialPageTitle = website.pages[0];

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("user_id", user.id)
    .eq("website_id", params.website_id)
    .eq("title", initialPageTitle)
    .single();

  if (pageError) {
    console.error("Error fetching page content:", pageError);
    return <div>Error fetching page content.</div>;
  }

  console.log("params.website_id:", params.website_id);

  return (
    <ClientEditor
      initialPageTitle={initialPageTitle}
      initialContent={page?.content || ""}
      userId={user.id}
      websiteId={params.website_id}
      subdomain={website.subdomain}
      pages={website.pages}
    />
  );
}
