"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
    const supabase = await createClient();
    console.log("Signing in with Google");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    const siteUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://rapidai.website';
    console.log("Site URL:", siteUrl);
    console.log("Starting OAuth flow with options:", {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: {
            access_type: 'offline',
            prompt: 'consent',
        }
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            }
        }
    });

    if (error) {
        console.error("Google sign-in error:", error.message, error);
        return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    console.log("OAuth flow initiated, redirecting to:", data.url);
    return redirect(data.url);
}

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        let errorMessage = "Could not authenticate user";

        if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
            errorMessage = "Please verify your email before logging in";
        } else if (error.message.includes("Too many requests")) {
            errorMessage = "Too many login attempts. Please try again later";
        }

        console.error("Login error:", error.message);
        return redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
    }

    return redirect("/dashboard");
} 