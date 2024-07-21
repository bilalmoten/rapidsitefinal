// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default function CreateWebsiteButton() {
  // const router = useRouter();

  const handleCreateWebsite = async () => {
    "use server";
    // in terminal i want clicked written
    console.log("clicked");
    return redirect("/dashboard/editor");
  };

  return (
    <form action={handleCreateWebsite}>
      <Button
        variant="default"
        onClick={handleCreateWebsite}
        className="w-full justify-center mt-4"
      >
        Create New Site
      </Button>
    </form>
  );
}
