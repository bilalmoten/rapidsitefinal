import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Check if user is already signed in
        const { data: { user } } = await supabase.auth.getUser();

        // If already signed in (whether anonymous or not), return the current user
        if (user) {
            return NextResponse.json(
                {
                    message: user.email
                        ? "Already signed in with permanent credentials"
                        : "Already signed in anonymously",
                    user
                },
                { status: 200 }
            );
        }

        // Sign in anonymously using the server client
        console.log("Attempting anonymous sign-in...");
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
            console.error("Error in anonymous sign-in:", error);
            throw error;
        }

        console.log("Anonymous sign-in successful:", data.user?.id);

        // Return success response (cookies are already handled by the server client)
        return NextResponse.json(
            { message: "Signed in anonymously", user: data.user },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in anonymous auth API:", error);
        return NextResponse.json(
            { error: error.message || "Failed to sign in anonymously" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Check if current user is anonymous
        const { data: { user } } = await supabase.auth.getUser();

        // Anonymous users have no email
        const isAnonymous = user && !user.email;

        return NextResponse.json(
            { isAnonymous, user },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error checking anonymous status:", error);
        return NextResponse.json(
            { error: error.message || "Failed to check anonymous status" },
            { status: 500 }
        );
    }
} 