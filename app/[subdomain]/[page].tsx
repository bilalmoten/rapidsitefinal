import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string; page: string };
}) {
  const supabase = createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id")
    .eq("subdomain", params.subdomain)
    .single();

  if (!website) {
    notFound();
  }

  const { data: pageContent, error } = await supabase
    .from("pages")
    .select("content")
    .eq("website_id", website.id)
    .eq("title", params.page)
    .single();

  if (error || !pageContent) {
    notFound();
  }

  return <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />;
}
