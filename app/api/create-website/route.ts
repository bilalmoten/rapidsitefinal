// api/create-website/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PLAN_LIMITS, PlanType } from '@/lib/constants/plans';

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

    // Check against plan limits
    if (currentUsage.websites_generated >= PLAN_LIMITS[currentUsage.plan as PlanType].websitesGenerated) {
        return NextResponse.json({
            message: "Website generation limit reached for your plan",
            error: "LIMIT_REACHED"
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
        })
        .select("id");

    if (error) {
        return NextResponse.json({ message: "Error creating website", error });
    }

    // Update usage counts with the current usage values
    const { error: updateError } = await supabase
        .from('user_usage')
        .update({
            websites_active: currentUsage.websites_active + 1,
            websites_generated: currentUsage.websites_generated + 1
        })
        .eq('user_id', userId);

    if (updateError) {
        console.error("Error updating usage counts:", updateError);
        // Website was created but usage wasn't updated
        // You might want to handle this case
    }

    return NextResponse.json({
        id: data[0].id,
    });
}
