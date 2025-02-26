import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormSubmissionsTable } from "@/components/forms/FormSubmissionsTable";

export default async function FormsPage(props: {
  params: Promise<{ website_id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Get website data to verify ownership
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("*")
    .eq("id", params.website_id)
    .single();

  if (websiteError || !website) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {websiteError?.message || "Website not found"}
        </AlertDescription>
      </Alert>
    );
  }

  if (website.user_id !== user.id) {
    return redirect("/dashboard");
  }

  // Get submissions
  const { data: submissions, error: submissionsError } = await supabase
    .from("user_websites_form_submissions")
    .select("*")
    .eq("website_id", Number(website.id))
    .order("created_at", { ascending: false });

  if (submissionsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          Error loading form submissions. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border border-neutral-70 rounded-lg bg-[#0a0a0b00] backdrop-blur-sm p-6">
      <FormSubmissionsTable
        submissions={submissions || []}
        websiteId={website.id}
      />
    </div>
  );
}
