import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { updateActiveWebsitesCount } from "@/middleware/usage-tracking";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { websiteId, userId } = await request.json();

    if (!websiteId || !userId) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Mark website as deleted
    const { error } = await supabase
        .from("websites")
        .update({ isdeleted: "yes" })
        .eq("id", websiteId);

    if (error) {
        console.error("Error marking website as deleted:", error);
        return NextResponse.json({ message: "Error deleting website", error }, { status: 500 });
    }

    // Update active websites count
    await updateActiveWebsitesCount(userId);

    return NextResponse.json({ success: true });
} 