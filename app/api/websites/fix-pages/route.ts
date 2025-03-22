import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { fixWebsiteWithEmptyPages } from "@/utils/express-mode";

// Fix a specific website's pages
export async function POST(request: NextRequest) {
    try {
        const { websiteId } = await request.json();

        if (!websiteId) {
            return NextResponse.json({ error: "Website ID is required" }, { status: 400 });
        }

        const supabase = await createClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        // Check if user owns the website
        const { data: website, error: websiteError } = await supabase
            .from("websites")
            .select("user_id")
            .eq("id", websiteId)
            .single();

        if (websiteError) {
            return NextResponse.json({ error: "Website not found" }, { status: 404 });
        }

        if (website.user_id !== user.id) {
            return NextResponse.json({ error: "Not authorized to modify this website" }, { status: 403 });
        }

        // Fix the website
        const result = await fixWebsiteWithEmptyPages(websiteId);

        return NextResponse.json({
            success: true,
            result
        });
    } catch (error: any) {
        console.error("Error fixing website pages:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fix website pages" },
            { status: 500 }
        );
    }
}

// Fix all websites for the current user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        // Get all websites for the user
        const { data: websites, error: websitesError } = await supabase
            .from("websites")
            .select("id, pages")
            .eq("user_id", user.id);

        if (websitesError) {
            throw websitesError;
        }

        if (!websites || websites.length === 0) {
            return NextResponse.json({ message: "No websites found for user" });
        }

        // Find websites with empty pages
        const websitesWithEmptyPages = websites.filter(website => {
            if (!website.pages || !Array.isArray(website.pages)) return true;
            return website.pages.some(page => !page || page.trim() === '');
        });

        if (websitesWithEmptyPages.length === 0) {
            return NextResponse.json({ message: "No websites with empty pages found" });
        }

        // Fix each website
        const results = [];
        for (const website of websitesWithEmptyPages) {
            try {
                const result = await fixWebsiteWithEmptyPages(website.id);
                results.push({ websiteId: website.id, ...result });
            } catch (error) {
                console.error(`Error fixing website ${website.id}:`, error);
                results.push({ websiteId: website.id, fixed: false, error: (error as Error).message });
            }
        }

        return NextResponse.json({
            success: true,
            fixedCount: results.filter(r => r.fixed).length,
            totalProcessed: websitesWithEmptyPages.length,
            results
        });
    } catch (error: any) {
        console.error("Error fixing all website pages:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fix website pages" },
            { status: 500 }
        );
    }
} 