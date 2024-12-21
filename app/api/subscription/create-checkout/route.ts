import { createClient } from "@/utils/supabase/server";
import { LEMON_VARIANT_IDS } from "@/lib/constants/plans";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { variantId } = await request.json();

        // Validate variant ID
        if (!Object.values(LEMON_VARIANT_IDS).includes(variantId)) {
            return new NextResponse("Invalid variant ID", { status: 400 });
        }

        // Get user data for checkout
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email, first_name, last_name")
            .eq("id", user.id)
            .single();

        if (userError || !userData) {
            console.error("Error fetching user data:", userError);
            return new NextResponse("Error fetching user data", { status: 500 });
        }

        // Create checkout session with Lemon Squeezy
        const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
            method: "POST",
            headers: {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    attributes: {
                        checkout_data: {
                            email: userData.email,
                            name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "User",
                            custom: {
                                user_id: user.id
                            }
                        },
                        product_options: {
                            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscription=success`,
                            enabled_variants: [variantId]

                            // enabled_variants: ["393389"]
                        },
                        // checkout_options: {
                        //     dark: true,
                        //     success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?subscription=success`,
                        //     cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings`
                        // }
                    },
                    relationships: {
                        store: {
                            data: {
                                type: "stores",
                                id: process.env.LEMONSQUEEZY_STORE_ID
                            }
                        },
                        variant: {
                            data: {
                                type: "variants",
                                // Test mode variant IDs
                                // id: "393389" // pro test

                                // Live mode variant IDs (uncomment in production)
                                id: variantId
                            }
                        }
                    }
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Lemon Squeezy API error response:", {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return new NextResponse(`Error creating checkout: ${errorText}`, { status: response.status });
        }

        const checkoutData = await response.json();
        console.log('Lemon Squeezy response:', JSON.stringify(checkoutData, null, 2));

        if (!checkoutData?.data?.attributes?.url) {
            console.error("Invalid checkout response:", checkoutData);
            return new NextResponse("Invalid checkout response", { status: 500 });
        }

        return NextResponse.json({
            url: checkoutData.data.attributes.url
        });
    } catch (error) {
        console.error("Error creating checkout:", error);
        return new NextResponse(
            `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { status: 500 }
        );
    }
} 