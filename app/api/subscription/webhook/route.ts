import { NextResponse } from "next/server";
import crypto from "crypto";
import serverLogger from "@/utils/server-logger";
import { createClient } from "@/utils/supabase/server";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    try {
        const hmac = crypto.createHmac("sha256", secret);
        const digest = hmac.update(payload).digest("hex");
        return signature === digest;
    } catch (error) {
        console.error("Error verifying signature:", error);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        // Get signature from headers
        const signature = request.headers.get("x-signature");

        if (!signature || !WEBHOOK_SECRET) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const payload = await request.text();
        console.log('Received webhook payload:', payload);

        const isValid = verifyWebhookSignature(payload, signature, WEBHOOK_SECRET);

        if (!isValid) {
            console.error("Invalid webhook signature");
            return new NextResponse("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(payload);
        const { event_name: type, custom_data } = event.meta;
        const userId = custom_data?.user_id;

        if (!userId) {
            console.error("No user ID in webhook payload:", event);
            return new Response("No user ID in custom data", { status: 400 });
        }

        console.log('Processing webhook event:', { type, userId });

        // Track subscription events with PostHog
        if (userId) {
            const data = event.data.attributes;

            switch (type) {
                case 'subscription_created':
                    serverLogger.track('subscription_created', userId, {
                        plan: data.product_name || 'unknown',
                        price: data.total,
                        currency: data.currency,
                        interval: data.billing_frequency,
                        status: data.status,
                        timestamp: new Date().toISOString()
                    });
                    break;
                case 'subscription_updated':
                    serverLogger.track('subscription_updated', userId, {
                        plan: data.product_name || 'unknown',
                        price: data.total,
                        currency: data.currency,
                        interval: data.billing_frequency,
                        status: data.status,
                        timestamp: new Date().toISOString()
                    });
                    break;
                case 'subscription_cancelled':
                    serverLogger.track('subscription_cancelled', userId, {
                        plan: data.product_name || 'unknown',
                        timestamp: new Date().toISOString()
                    });
                    break;
                case 'order_created':
                    serverLogger.track('payment_successful', userId, {
                        amount: data.total,
                        currency: data.currency,
                        order_id: data.order_id,
                        timestamp: new Date().toISOString()
                    });
                    break;
                case 'subscription_payment_failed':
                    serverLogger.track('payment_failed', userId, {
                        amount: data.total,
                        currency: data.currency,
                        order_id: data.order_id,
                        timestamp: new Date().toISOString()
                    });
                    break;
            }
        }

        const supabase = await createClient();

        // First check if user exists
        const { data: user, error: userError } = await supabase
            .from("user_usage")
            .select("user_id")
            .eq("user_id", userId)
            .single();

        if (userError || !user) {
            // Create user_usage record if it doesn't exist
            const { error: createError } = await supabase
                .from("user_usage")
                .insert({
                    user_id: userId,
                    plan: "free",
                    subscription_status: "inactive"
                });

            if (createError) {
                console.error("Error creating user_usage:", createError);
                return new Response("Error creating user usage record", { status: 500 });
            }
        }

        // Process the webhook event
        switch (type) {
            case "order_created": {
                // Log the order but wait for subscription confirmation
                console.log('New order created:', event.data.id);
                break;
            }

            case "subscription_created":
            case "subscription_updated":
            case "subscription_payment_success": {
                const { status, variant_id, order_id } = event.data.attributes;
                console.log('Subscription event:', { status, variant_id, order_id });

                // Default to free plan
                let plan = "free";

                // Map variant_id to plan
                if (status === "active") {
                    // Test mode variants
                    // if (variant_id === 393389) {
                    //     plan = "pro";
                    // }
                    // } else if (variant_id === "393390") {
                    //     plan = "enterprise";
                    // }

                    // Live mode variants (uncomment in production)
                    if (variant_id === 617721 || variant_id === 617722) { // pro monthly/yearly
                        plan = "pro";
                    } else if (variant_id === 617723 || variant_id === 617725) { // enterprise monthly/yearly
                        plan = "enterprise";
                    }
                }

                console.log('Updating subscription:', { userId, plan, status });

                // Update user's plan in user_usage table
                const { error: updateError } = await supabase
                    .from("user_usage")
                    .update({
                        plan,
                        subscription_id: event.data.id,
                        subscription_status: status,
                        updated_at: new Date().toISOString()
                    })
                    .eq("user_id", userId);

                if (updateError) {
                    console.error("Error updating user_usage:", updateError);
                    return new NextResponse("Error updating user plan", { status: 500 });
                }

                // Add to billing history
                const { error: billingError } = await supabase
                    .from("billing_history")
                    .insert({
                        user_id: userId,
                        subscription_id: event.data.id,
                        status: status,
                        order_id: order_id
                    });

                if (billingError) {
                    console.error("Error updating billing history:", billingError);
                }

                break;
            }

            case "subscription_payment_failed": {
                // Mark subscription as failed but don't downgrade yet
                const { error: updateError } = await supabase
                    .from("user_usage")
                    .update({
                        subscription_status: "failed",
                        updated_at: new Date().toISOString()
                    })
                    .eq("user_id", userId);

                if (updateError) {
                    console.error("Error updating user_usage:", updateError);
                    return new NextResponse("Error updating user plan", { status: 500 });
                }
                break;
            }

            case "subscription_cancelled":
            case "subscription_expired": {
                console.log('Subscription ended:', { userId, type });

                // Revert to free plan
                const { error: updateError } = await supabase
                    .from("user_usage")
                    .update({
                        plan: "free",
                        subscription_id: null,
                        subscription_status: "inactive",
                        updated_at: new Date().toISOString()
                    })
                    .eq("user_id", userId);

                if (updateError) {
                    console.error("Error updating user_usage:", updateError);
                    return new NextResponse("Error updating user plan", { status: 500 });
                }

                break;
            }

            default: {
                console.log("Unhandled webhook event type:", type);
                return new NextResponse("Unhandled event type", { status: 200 });
            }
        }

        return new NextResponse("Webhook processed", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new NextResponse(
            `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { status: 500 }
        );
    }
} 