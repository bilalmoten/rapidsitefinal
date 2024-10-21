// api/create-website/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    console.log("POST function called"); // Added logging

    const supabase = createClient();
    const requestBody = await request.json();
    const { userId, title, subdomain, description } = requestBody;

    console.log("Request body:");
    console.log(requestBody);

    if (!userId || !title || !subdomain || !description) {
        console.log("Missing required fields22"); // Added logging
        return NextResponse.json({ message: "Missing required fields333" });
    }

    console.log("Attempting to insert into 'websites'"); // Added logging

    const { data, error } = await supabase
        .from("websites")
        .insert({ user_id: userId, website_name: title, website_description: description, subdomain, thumbnail_url: "https://example.com/placeholder.jpg", pages: [] })
        .select("id");

    if (error) {
        console.log("Error creating website:", error); // Added logging
        return NextResponse.json({ message: "Error creating website", error });
    }

    console.log("Website created successfully, data:", data); // Added logging

    return NextResponse.json({
        id: data[0].id,
    });
}
