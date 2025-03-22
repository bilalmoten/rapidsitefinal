import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    try {
        // Get credentials from request body
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Initialize Supabase client
        const supabase = await createClient();

        // Verify that the current user is anonymous
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "No user session found" },
                { status: 401 }
            );
        }

        const isAnonymous = !user.email;

        if (!isAnonymous) {
            return NextResponse.json(
                { error: "Current user is not anonymous" },
                { status: 400 }
            );
        }

        // Convert to permanent user by updating the user with email and password
        console.log("Converting anonymous user to permanent user:", user.id);
        const { data, error } = await supabase.auth.updateUser({
            email,
            password,
        });

        if (error) {
            console.error("Error updating user:", error);
            throw error;
        }

        // Create response with updated user data
        return NextResponse.json(
            { message: "Anonymous user converted successfully", user: data.user },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in convert anonymous user API:", error);

        // Check for specific error cases
        if (error.message?.includes("User already registered")) {
            return NextResponse.json(
                { error: "This email is already registered with another account" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to convert anonymous user" },
            { status: 500 }
        );
    }
} 