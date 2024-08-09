import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function POST(request: Request) {
  const supabase = createClient();
  const requestBody = await request.json();
  const { userId, content, title, website_id } = requestBody;
  console.log("Request body:");
  console.log(requestBody);
  if (!userId || !content || !title || !website_id) {
    return NextResponse.json({ message: "Missing required fields" });
  }

  const { error } = await supabase
    .from("pages")
    .update({ content })
    .eq("user_id", userId)
    .eq("website_id", website_id)
    .eq("title", title);

  if (error) {
    return NextResponse.json({ message: "Error updating content", error });
  }

  return NextResponse.json({
    message:
      "Content updated successfully with the following details: " + JSON.stringify(requestBody),
  });
}