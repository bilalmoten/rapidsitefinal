import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const requestBody = await request.json();
  const { userId, content, title, website_id } = requestBody;
  console.log("Request body:");
  console.log(`userId: ${userId}, title: ${title}, website_id: ${website_id}`);
  if (!userId || !content || !title || !website_id) {
    return NextResponse.json({ message: "Missing required fields" });
  }

  // Update the page content
  const { error: pageError } = await supabase
    .from("pages")
    .update({ content })
    .eq("user_id", userId)
    .eq("website_id", website_id)
    .eq("title", title);

  if (pageError) {
    console.log(pageError);
    return NextResponse.json({ message: "Error updating content", error: pageError });
  }

  // Update the website's last_updated_at timestamp
  const { error: websiteError } = await supabase
    .from("websites")
    .update({ last_updated_at: new Date().toISOString() })
    .eq("id", website_id);

  if (websiteError) {
    console.log(websiteError);
    return NextResponse.json({ message: "Error updating website timestamp", error: websiteError });
  }

  console.log(`Content updated successfully with the following details: userId: ${userId}, title: ${title}, website_id: ${website_id}`);
  return NextResponse.json({
    message: `Content updated successfully with the following details: userId: ${userId}, title: ${title}, website_id: ${website_id}`
  });
}