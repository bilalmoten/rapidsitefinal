import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewWebsiteDialog from "@/components/NewWebsiteDialog";
import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, PlusCircle } from "lucide-react";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";
import ModeToggle from "@/components/mode-toggle";
import Website from "@/components/website";
import Last from "@/components/Last";
import BWT from "@/components/BWT";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: websites, error } = await supabase
    .from("websites")
    .select("id, website_name, website_description, thumbnail_url")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching websites:", error);
    return <div className="text-red-600">Error fetching websites.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <nav className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-semibold ">Dashboard</h1>
            <h2 className="text-xl font-bold">Welcome back, {user.email}!</h2>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>

              <ModeToggle />
            </div>
            <NewWebsiteDialog userId={user.id}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Website
              </Button>
            </NewWebsiteDialog>
          </div>
        </div>
      </nav>

      <div className=" container mx-auto p-4 max-w-full">
        <h1 className="text-2xl font-bold mb-4">Your Websites</h1>
        <div className="">
          {websites && websites.length > 0 ? (
            // websites.map((website) => (
            //   <div
            //     key={website.id}
            //     className="bg-white shadow-md rounded-lg p-4 text-black"
            //   >
            //     <img
            //       src={website.thumbnail_url}
            //       alt={website.website_name}
            //       className="w-full h-32 object-cover rounded-t-lg"
            //     />
            //     <h2 className="text-lg font-semibold mt-2">
            //       {website.website_name}
            //     </h2>
            //     <p className="text-sm mt-2">
            //       {website.website_description || ""}
            //     </p>
            //     <div className="flex justify-between mt-4">
            //       <Link href={`/dashboard/editor/${website.id}`}>
            //         <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            //           Edit
            //         </button>
            //       </Link>
            //       <Link href={`/preview/${website.id}`}>
            //         <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            //           Preview
            //         </button>
            //       </Link>
            //       <DeleteWebsiteDialog
            //         websiteId={website.id}
            //         websiteName={website.website_name}
            //       />
            //     </div>
            //   </div>
            // ))
            <Website websites={websites} />
          ) : (
            <p className="text-gray-600">
              No websites found. Click the button above to create a new one.
            </p>
          )}
        </div>
        <BWT />
        <Last />
      </div>
    </div>
  );
}
