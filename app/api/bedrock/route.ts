// import { NextRequest, NextResponse } from "next/server";
// import { bedrock } from '@ai-sdk/amazon-bedrock';
// import { generateText } from 'ai';

// // Claude 3.7 Sonnet model ID
// const MODEL_ID = "us.anthropic.claude-3-7-sonnet-20250219-v1:0";

// export async function POST(request: NextRequest) {
//     try {
//         // Parse the request body
//         const { message } = await request.json();

//         if (!message) {
//             return NextResponse.json(
//                 { error: "Message is required" },
//                 { status: 400 }
//             );
//         }

//         // Check if AWS credentials are configured
//         if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
//             console.error("AWS credentials missing:", {
//                 region: process.env.AWS_REGION ? "set" : "missing",
//                 key: process.env.AWS_ACCESS_KEY_ID ? "set" : "missing",
//                 secret: process.env.AWS_SECRET_ACCESS_KEY ? "set" : "missing"
//             });

//             return NextResponse.json(
//                 { error: "AWS credentials not configured correctly" },
//                 { status: 500 }
//             );
//         }

//         console.log("Using AWS region:", process.env.AWS_REGION);

//         // Use the Vercel AI SDK with direct model reference
//         const { text } = await generateText({
//             model: bedrock(MODEL_ID),
//             system: "You are a helpful assistant. Provide brief, clear responses.",
//             prompt: message,
//             maxTokens: 1000,
//             temperature: 0.7,
//         });

//         // Return the model's response
//         return NextResponse.json({
//             response: text
//         });
//     } catch (error) {
//         console.error("Error in Bedrock API:", error);

//         // More detailed error logging
//         if (error instanceof Error) {
//             console.error("Error details:", {
//                 message: error.message,
//                 name: error.name,
//                 stack: error.stack,
//                 cause: (error as any).cause,
//             });
//         }

//         return NextResponse.json(
//             {
//                 error: "Failed to process request",
//                 details: error instanceof Error ? error.message : "Unknown error"
//             },
//             { status: 500 }
//         );
//     }
// }




///////
///////
///////
///////
///////
///////
///////
///////
///////
///////


import { NextRequest, NextResponse } from "next/server";
// import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

// AWS Claude model ID for Claude 3.7 Sonnet - note the 'us.' prefix is required
const MODEL_ID = "us.anthropic.claude-3-7-sonnet-20250219-v1:0";

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Check if AWS credentials are configured
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
            console.log("AWS credentials missing - check your environment variables");
            return NextResponse.json(
                { error: "AWS credentials not configured" },
                { status: 500 }
            );
        }

        // Log credentials presence (don't log actual values)
        console.log("AWS credentials check:", {
            region: process.env.AWS_REGION,
            accessKeyPresent: !!process.env.AWS_ACCESS_KEY_ID,
            secretKeyPresent: !!process.env.AWS_SECRET_ACCESS_KEY
        });

        // Use the Vercel AI SDK with direct model reference
        const { text } = await generateText({
            model: bedrock(MODEL_ID),
            system: "You are a helpful assistant. Keep your responses very brief for this test.",
            prompt: message,
            maxTokens: 500,
            temperature: 0.7,
        });

        console.log("Response received from Claude:", text.substring(0, 50) + "...");

        // Return the model's response
        return NextResponse.json({
            response: text
        });
    } catch (error) {
        console.error("Error in Bedrock API:", error);

        // More detailed error logging
        if (error instanceof Error) {
            console.error("Error details:", {
                message: error.message,
                name: error.name
            });

            // Check if it's an AWS-specific error
            if (error.message.includes("security token")) {
                console.error("This appears to be an authentication error with AWS. Please verify your credentials.");
            }
        }

        return NextResponse.json(
            {
                error: "Failed to process request",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
} 