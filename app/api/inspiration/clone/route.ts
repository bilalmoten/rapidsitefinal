import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { websiteId, websiteName, websiteDescription, subdomain } = await request.json();

    if (!websiteId) {
        return NextResponse.json({ error: "Website ID is required" }, { status: 400 });
    }

    if (!subdomain) {
        return NextResponse.json({ error: "Subdomain is required" }, { status: 400 });
    }

    try {
        // Get the website to clone
        const { data: sourceWebsite, error: fetchError } = await supabase
            .from("websites")
            .select("*")
            .eq("id", websiteId)
            .single();

        if (fetchError) {
            console.error("Error fetching source website:", fetchError);
            return NextResponse.json({ error: "Website not found" }, { status: 404 });
        }

        // Check if the subdomain is already taken
        const { data: existingSubdomain } = await supabase
            .from("websites")
            .select("id")
            .eq("subdomain", subdomain)
            .single();

        if (existingSubdomain) {
            return NextResponse.json({ error: "Subdomain is already taken" }, { status: 400 });
        }

        // Create new website record (clone) - make sure we only include fields that exist in the table
        const { data: newWebsite, error: insertError } = await supabase
            .from("websites")
            .insert({
                user_id: user.id,
                website_name: websiteName || `Copy of ${sourceWebsite.website_name}`,
                website_description: websiteDescription || sourceWebsite.website_description,
                subdomain: subdomain,
                thumbnail_url: sourceWebsite.thumbnail_url,
                is_public: true,
                industry_type: sourceWebsite.industry_type,
                color_palette: sourceWebsite.color_palette,
                features_used: sourceWebsite.features_used,
                categories: sourceWebsite.categories,
                vote_count: 0,
                clone_count: 0,
                // Removed view_count as it doesn't exist in the table
                isdeleted: "no",
                created_at: new Date().toISOString(),
                last_updated_at: new Date().toISOString(),
                status: "completed",
                seo_indexed: false,
                is_featured: false,
                pages: sourceWebsite.pages // Copy the pages array if it exists
            })
            .select("id")
            .single();

        if (insertError) {
            console.error("Error creating cloned website:", insertError);
            return NextResponse.json({ error: "Failed to clone website" }, { status: 500 });
        }

        // Clone pages if they exist
        const { data: sourcePages, error: pagesQueryError } = await supabase
            .from("pages")
            .select("*")
            .eq("website_id", websiteId);

        if (pagesQueryError) {
            console.error("Error fetching source pages:", pagesQueryError);
            // Continue with the cloning process even if we can't fetch pages
        }

        if (sourcePages && sourcePages.length > 0) {
            // Prepare the new pages data - match the actual schema from the sample
            const newPages = sourcePages.map(page => ({
                user_id: user.id, // Include user_id as it's in the sample
                website_id: newWebsite.id,
                title: page.title, // Use 'title' instead of 'page_name'
                content: page.content, // Use 'content' instead of 'page_data'
                created_at: new Date().toISOString()
                // No page_path or is_homepage in the sample
            }));

            // Insert all the cloned pages
            const { error: pagesInsertError } = await supabase
                .from("pages")
                .insert(newPages);

            if (pagesInsertError) {
                console.error("Error cloning pages:", pagesInsertError);
                // Continue anyway, don't return error
            }
        }

        // Increment clone count on the source website
        const { error: incrementError } = await supabase.rpc('increment_clone_count', { website_id: websiteId });

        if (incrementError) {
            console.error("Error incrementing clone count:", incrementError);
            // Continue anyway
        }

        return NextResponse.json({
            success: true,
            newWebsiteId: newWebsite.id,
            message: "Website cloned successfully"
        });

    } catch (error) {
        console.error("Error cloning website:", error);
        return NextResponse.json({ error: "Failed to clone website" }, { status: 500 });
    }
} 