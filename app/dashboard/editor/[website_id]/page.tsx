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

  const { data: pages, error: pagesError } = await supabase
    .from("websites")
    .select("pages")
    .eq("user_id", user.id)
    .eq("id", params.website_id);

  console.log(pages);
  console.log(pages && pages[0].pages[0]);
  console.log(pages && pages[0].pages);
  if (pagesError) {
    console.error("Error fetching pages:", pagesError);
    return <div>Error fetching page content.</div>;
  }
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("user_id", user.id)
    .eq("website_id", params.website_id)
    .eq("title", pages && pages[0].pages[0])
    .single();

  if (pageError) {
    console.error("Error fetching page content:", pageError);
    return <div>Error fetching page content.</div>;
  }

  return (
    <div className="h-screen w-full">
      <ClientEditor
        content={page?.content || ""}
        userId={user.id}
        websiteId={params.website_id}
      />
    </div>
  );
}
