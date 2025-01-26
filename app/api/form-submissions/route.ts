import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Log the raw request body for debugging
        const rawBody = await request.text();
        console.log('Raw request body:', rawBody);

        // Parse the JSON body
        let websiteId, formId, data;
        try {
            const body = JSON.parse(rawBody);
            websiteId = body.websiteId;
            formId = body.formId;
            data = body.data;
        } catch (parseError) {
            console.error('Error parsing request body:', parseError);
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        console.log('Parsed form data:', { websiteId, formId, data });

        // Get headers from the request object
        const userAgent = request.headers.get("user-agent") || "";
        const ip = request.headers.get("x-forwarded-for") || "unknown";

        if (!websiteId || !data) {
            console.error('Missing required fields:', { websiteId, data });
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate website_id is a valid UUID or number
        if (typeof websiteId === 'string') {
            // Convert string to number if possible
            const websiteIdNum = parseInt(websiteId, 10);
            if (isNaN(websiteIdNum)) {
                console.error('Invalid website_id: not a valid number:', websiteId);
                return NextResponse.json(
                    { error: "Invalid website_id format - must be a number" },
                    { status: 400 }
                );
            }
            websiteId = websiteIdNum;
        } else if (typeof websiteId !== 'number') {
            console.error('Invalid website_id type:', typeof websiteId);
            return NextResponse.json(
                { error: "Invalid website_id format - must be a number" },
                { status: 400 }
            );
        }

        // Ensure form_data is an object
        if (typeof data !== 'object' || data === null) {
            console.error('Invalid form_data type:', typeof data);
            return NextResponse.json(
                { error: "Invalid form_data format" },
                { status: 400 }
            );
        }

        console.log('Attempting to insert form submission:', {
            website_id: websiteId,
            form_id: formId || "default",
            form_data: data,
            user_agent: userAgent,
            ip_address: ip,
        });

        const { error } = await supabase
            .from("user_websites_form_submissions")
            .insert([
                {
                    website_id: websiteId,
                    form_id: formId || "default",
                    form_data: data,
                    user_agent: userAgent,
                    ip_address: ip,
                },
            ]);

        if (error) {
            console.error("Supabase error details:", {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            return NextResponse.json(
                {
                    error: "Failed to save submission",
                    details: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        // Log the full error object
        console.error("Unhandled error in form submission:", {
            name: error?.name,
            message: error?.message,
            stack: error?.stack,
            details: error
        });
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error?.message || "Unknown error occurred"
            },
            { status: 500 }
        );
    }
} 