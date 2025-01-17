// api/create-website/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PLAN_LIMITS, PlanType } from '@/lib/constants/plans';
import { updateActiveWebsitesCount } from '@/middleware/usage-tracking';

export async function POST(request: Request) {
    const supabase = await createClient();
    const requestBody = await request.json();
    const { userId, title, subdomain, description } = requestBody;

    if (!userId || !title || !subdomain || !description) {
        return NextResponse.json({ message: "Missing required fields" });
    }

    // First fetch current usage
    const { data: currentUsage, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (usageError) {
        return NextResponse.json({
            message: "Error checking usage limits",
            error: usageError
        });
    }

    // Get current active websites count
    const { count: activeWebsitesCount } = await supabase
        .from('websites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('isdeleted', 'yes');

    const activeWebsites = activeWebsitesCount || 0;

    // Check against plan limits
    if (currentUsage.websites_generated >= PLAN_LIMITS[currentUsage.plan as PlanType].websitesGenerated) {
        return NextResponse.json({
            message: "Website generation limit reached for your plan",
            error: "LIMIT_REACHED"
        });
    }

    // Check active websites limit
    if (activeWebsites >= PLAN_LIMITS[currentUsage.plan as PlanType].websites) {
        return NextResponse.json({
            message: "Active websites limit reached for your plan. Please upgrade your plan or delete some websites.",
            error: "ACTIVE_LIMIT_REACHED"
        });
    }

    // Create website
    const { data, error } = await supabase
        .from("websites")
        .insert({
            user_id: userId,
            website_name: title,
            website_description: description,
            subdomain,
            thumbnail_url: "https://example.com/placeholder.jpg",
            pages: [],
            is_public: true,
            seo_indexed: requestBody.seoIndexed || false,
            last_updated_at: new Date().toISOString(),
        })
        .select("id");

    if (error) {
        return NextResponse.json({ message: "Error creating website", error });
    }

    // Update websites_generated count
    const { error: updateError } = await supabase
        .from('user_usage')
        .update({
            websites_generated: currentUsage.websites_generated + 1
        })
        .eq('user_id', userId);

    if (updateError) {
        console.error("Error updating usage counts:", updateError);
    }

    // Update active websites count
    await updateActiveWebsitesCount(userId);

    return NextResponse.json({
        id: data[0].id,
    });
}
