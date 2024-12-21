import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get user's subscription data
        const { data: usageData, error: usageError } = await supabase
            .from("user_usage")
            .select("subscription_id")
            .eq("user_id", user.id)
            .single();

        if (usageError || !usageData?.subscription_id) {
            return new NextResponse("No active subscription", { status: 404 });
        }

        // Get subscription details from Lemon Squeezy
        const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${usageData.subscription_id}`, {
            headers: {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch subscription");
        }

        const data = await response.json();
        const portalUrl = data.data.attributes.urls.customer_portal;

        return NextResponse.json({ url: portalUrl });
    } catch (error) {
        console.error("Error getting portal URL:", error);
        return new NextResponse(
            `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { status: 500 }
        );
    }
} 