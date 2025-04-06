import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import serverLogger from "@/utils/server-logger";

export async function POST(request: NextRequest) {
    try {
        const { level, message, feature, component, includeError, userId, websiteId } = await request.json();

        if (!level || !message) {
            return NextResponse.json(
                { error: "Missing required fields: level and message" },
                { status: 400 }
            );
        }

        // Create a test error if needed
        const testError = includeError
            ? new Error("This is a test error for server-side logging")
            : undefined;

        // Additional context for the log
        const context = {
            feature,
            component,
            testMode: true,
            timestamp: new Date().toISOString(),
            ip: request.headers.get("x-forwarded-for") || "unknown"
        };

        // Test DB log in Supabase if we have userId and the table exists
        let dbLogId = null;
        if (userId) {
            const supabase = await createClient();

            try {
                // Check if the system_logs table exists
                const { error: checkError } = await supabase
                    .from('system_logs')
                    .select('id')
                    .limit(1);

                // If the table exists and we got no error
                if (!checkError) {
                    // Create the log entry using RPC (assuming the function exists)
                    const { data, error } = await supabase.rpc('rapidsite_log_event', {
                        p_level: level,
                        p_message: message,
                        p_feature: feature,
                        p_component: component,
                        p_user_id: userId,
                        // Only include website_id if you have one
                        p_website_id: websiteId ? Number(websiteId) : null,
                        p_error_name: testError?.name,
                        p_error_message: testError?.message,
                        p_error_stack: testError?.stack,
                        p_context: context
                    });

                    if (error) {
                        console.error("Error creating DB log:", error);
                    } else {
                        dbLogId = data;
                    }
                }
            } catch (dbError) {
                console.error("Database logging error:", dbError);
            }
        }

        // Log with appropriate level using server logger
        if (level === "debug") {
            serverLogger.debug(message, context);
        } else if (level === "info") {
            serverLogger.info(message, { ...context, sendToAnalytics: true });
        } else if (level === "warn") {
            serverLogger.warn(message, context);
        } else if (level === "error") {
            serverLogger.error(message, testError, context);
        }

        // Also track a specific event
        if (userId) {
            serverLogger.track("server_logger_test", userId, {
                level,
                feature,
                component,
                includeError,
                timestamp: new Date().toISOString()
            });
        }

        // Return the details of what was logged
        return NextResponse.json({
            success: true,
            logged: {
                level,
                message,
                feature,
                component,
                includeError,
                timestamp: new Date().toISOString(),
                dbLogId
            },
            consoleOutput: "Check the server logs to see the formatted output",
            posthogEvent: userId ? "Event was sent to PostHog" : "No PostHog event sent (no userId)",
            dbLog: dbLogId ? "Log saved to Supabase" : "No DB log created"
        });
    } catch (error) {
        console.error("Server-side logging test error:", error);

        return NextResponse.json(
            {
                error: "Failed to test server logger",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 