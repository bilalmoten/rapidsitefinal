import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

// AWS Claude model ID for Claude 3.7 Sonnet
const MODEL_ID = "us.anthropic.claude-3-7-sonnet-20250219-v1:0";

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
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        // Check if AWS credentials are configured
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
            console.error("AWS credentials missing:", {
                region: process.env.AWS_REGION ? "set" : "missing",
                key: process.env.AWS_ACCESS_KEY_ID ? "set" : "missing",
                secret: process.env.AWS_SECRET_ACCESS_KEY ? "set" : "missing"
            });

            return NextResponse.json(
                { error: "AWS credentials not configured correctly" },
                { status: 500 }
            );
        }

        console.log("Using AWS Bedrock with Claude 3.7 Sonnet", {
            prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
            modelId: MODEL_ID,
            region: process.env.AWS_REGION
        });

        // Use Claude API via Bedrock
        const { text } = await generateText({
            model: bedrock(MODEL_ID),
            system: "You are a helpful assistant. Provide concise, accurate responses.",
            prompt: prompt,
            maxTokens: 1000,
            temperature: 0.7,
        });

        console.log("Claude response generated", {
            responseLength: text.length,
            preview: text.substring(0, 100) + (text.length > 100 ? "..." : "")
        });

        return NextResponse.json({
            success: true,
            response: text
        });
    } catch (error) {
        console.error("Error in test Claude API:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
} 