import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientEditor from "@/components/ClientEditor";

export default async function EditorPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: page } = await supabase
    .from("pages")
    .select("content")
    .eq("user_id", user.id)
    .eq("title", "home")
    .single();

  return (
    <div className="h-screen w-full">
      <ClientEditor content={page?.content || ""} />
    </div>
  );
}
