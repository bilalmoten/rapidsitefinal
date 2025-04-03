import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Helper function to sanitize project brief
function sanitizeProjectBrief(brief: any) {
    if (!brief) return null;

    // Create a clean copy with only the essential fields
    return {
        siteName: brief.siteName || "",
        purpose: brief.purpose || "",
        targetAudience: brief.targetAudience || "",
        designStyle: brief.designStyle || "",
        colorPalette: brief.colorPalette ? {
            id: brief.colorPalette.id,
            name: brief.colorPalette.name,
            colors: brief.colorPalette.colors
        } : null,
        fontPairing: brief.fontPairing ? {
            id: brief.fontPairing.id,
            name: brief.fontPairing.name,
            headingFont: brief.fontPairing.headingFont,
            bodyFont: brief.fontPairing.bodyFont,
            headingClass: brief.fontPairing.headingClass,
            bodyClass: brief.fontPairing.bodyClass
        } : null,
        contentReferences: Array.isArray(brief.contentReferences) ? brief.contentReferences : [],
        assets: Array.isArray(brief.assets) ? brief.assets.map((asset: any) => ({
            id: asset.id,
            name: asset.name,
            url: asset.url,
            type: asset.type,
            label: asset.label || "",
            description: asset.description || ""
        })) : [],
        progress: typeof brief.progress === 'number' ? brief.progress : 0,
        webStructure: brief.webStructure || null,
        designNotes: brief.designNotes || "",
        contentNotes: brief.contentNotes || ""
    };
}

// Helper function to sanitize messages
function sanitizeMessages(messages: any[]) {
    if (!Array.isArray(messages)) return [];

    return messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        options: msg.options || [],
        hidden: msg.hidden || false,
        interactiveComponent: msg.interactiveComponent || null,
        interactionProcessed: msg.interactionProcessed || false
    }));
}

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        const requestBody = await request.json();
        const { userId, websiteId, messages, projectBrief, chatState } = requestBody;

        console.log("Saving Pro Chat data:");
        console.log(`userId: ${userId}, websiteId: ${websiteId}, chatState: ${chatState}`);
        console.log(`Messages count: ${messages?.length || 0}`);

        if (!userId || !websiteId) {
            return NextResponse.json({
                message: "Missing required fields: userId or websiteId"
            }, { status: 400 });
        }

        // Sanitize and validate data
        const sanitizedMessages = sanitizeMessages(messages);
        const sanitizedBrief = sanitizeProjectBrief(projectBrief);

        // Convert to JSON strings to check size
        const messagesJson = JSON.stringify(sanitizedMessages);
        const briefJson = JSON.stringify(sanitizedBrief);

        // Check sizes
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (messagesJson.length + briefJson.length > MAX_SIZE) {
            return NextResponse.json({
                message: "Data too large, exceeds 5MB limit"
            }, { status: 413 });
        }

        // Update the website record
        const { error } = await supabase
            .from("websites")
            .update({
                chat_conversation: sanitizedMessages,
                project_brief: sanitizedBrief,
                chat_state: chatState,
                last_updated_at: new Date().toISOString()
            })
            .eq("id", websiteId)
            .eq("user_id", userId);

        if (error) {
            console.error("Error updating Pro Chat data:", error);
            return NextResponse.json({
                message: "Error saving Pro Chat data",
                error: error.message,
                details: error.details || "No details provided"
            }, { status: 500 });
        }

        console.log(`Pro Chat data saved successfully for website: ${websiteId}`);
        return NextResponse.json({
            message: "Pro Chat data saved successfully",
            websiteId,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("Exception saving Pro Chat data:", error);
        return NextResponse.json({
            message: "Exception saving Pro Chat data",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 