import { createClient } from "@/utils/supabase/server";
import LandingPage from "@/components/LandingPage";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingPage user={user} />;
}
