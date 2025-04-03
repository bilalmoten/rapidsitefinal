import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendWebsiteGenerationCompleteEmail } from "@/utils/email";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check if user is authorized
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Only allow authorized emails (developer only)
        if (user.email !== "bilalmoten2@gmail.com") {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }

        // Parse request body
        const { websiteName, websiteId } = await request.json();

        if (!websiteName) {
            return NextResponse.json(
                { error: "Website name is required" },
                { status: 400 }
            );
        }

        if (!websiteId) {
            return NextResponse.json(
                { error: "Website ID is required" },
                { status: 400 }
            );
        }

        // Send test email
        const success = await sendWebsiteGenerationCompleteEmail(
            user.email,
            websiteName,
            websiteId
        );

        if (!success) {
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Test email sent to ${user.email}`
        });
    } catch (error) {
        console.error("Error in test email API:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
} 