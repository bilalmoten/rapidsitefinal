// api/create-website/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { pages } from "next/dist/build/templates/app-page";

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
        .insert({ user_id: userId, website_name: title, website_description: description, subdomain: subdomain, thumbnail_url: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/website-building-tutorial-youtube-thumbnail-design-template-65458d2b58bd9624b45f5cfdefcff157_screen.jpg?ts=1606639135", pages: [] })
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