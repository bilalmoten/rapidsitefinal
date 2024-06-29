// app/dashboard/page.js

import CreateWebsiteButton from "@/components/createwebsitebutton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createClient();
  //   const router = useRouter();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">Welcome, {user.email}!</p>
      ddd
      <CreateWebsiteButton />
    </div>
  );
}
