import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const supabase = createClient();

  // Fetch the website data based on the subdomain
  const { data: website, error } = await supabase
    .from("websites")
    .select("id, user_id, website_name, pages")
    .eq("subdomain", params.subdomain)
    .single();

  if (error || !website) {
    console.error("Error fetching website:", error);
    notFound();
  }

  // Fetch the content for the home page
  const { data: pageContent, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("website_id", website.id)
    .eq("title", "home")
    .single();

  if (pageError) {
    console.error("Error fetching page content:", pageError);
    return <div>Error loading page content</div>;
  }

  return (
    <div>
      <h1>{website.website_name}</h1>
      <div dangerouslySetInnerHTML={{ __html: pageContent?.content || "" }} />
    </div>
  );
}
