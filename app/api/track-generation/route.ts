import { NextResponse } from "next/server";
import { trackWebsiteGeneration } from "@/middleware/usage-tracking";

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
        }

        await trackWebsiteGeneration(userId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === 'Website generation limit reached') {
            return NextResponse.json({
                message: "Website generation limit reached",
                error: "LIMIT_REACHED"
            }, { status: 403 });
        }

        console.error('Error tracking website generation:', error);
        return NextResponse.json({
            message: "Failed to track website generation",
            error: error.message
        }, { status: 500 });
    }
} 