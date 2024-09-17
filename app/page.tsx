import { createClient } from "@/utils/supabase/server";
import { Page } from "@/components/app-page";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col">
      <Page user={user} />
    </div>
  );
}
