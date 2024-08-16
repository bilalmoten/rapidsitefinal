// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

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
      <button
        onClick={handleCreateWebsite}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create your first website
      </button>
    </form>
  );
}
