import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = createClient();
    const requestBody = await request.json();
    const { userId, websiteID, chat_conversation } = requestBody;
    console.log("Request body:");
    console.log(requestBody);
    console.log("Chat conversation:");
    console.log(chat_conversation); // Add this line
    if (!userId || !chat_conversation || !websiteID) {
        return NextResponse.json({ message: "Missing required fields" });
    }

    const { error } = await supabase
        .from("websites")
        .update({ chat_conversation })
        .eq("user_id", userId)
        .eq("id", websiteID);

    if (error) {
        return NextResponse.json({ message: "Error updating content", error });
    }

    return NextResponse.json({
        message:
            "Content updated successfully with the following details: " + JSON.stringify(requestBody),
    });
}