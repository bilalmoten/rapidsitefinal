"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export async function signUp(formData: FormData) {
    const siteUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://aiwebsitebuilder.tech';
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const newsletter = formData.get("newsletter") === "on";

    const supabase = await createClient();

    console.log("Signup attempt with:", {
        email,
        redirectUrl: `${siteUrl}/auth/callback`,
        newsletter,
    });

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback?redirect_to=/dashboard`,
            data: {
                redirect_url: `${siteUrl}/auth/callback?redirect_to=/dashboard`,
            },
        },
    });

    if (error) {
        console.error("Signup error:", error);
        return redirect(
            `/signup?message=${encodeURIComponent(
                error.message || "Sorry, we couldn't create your account"
            )}`
        );
    }

    // If user opted in for newsletter, add them to subscribers
    if (newsletter) {
        try {
            // Let the API handle both the database insert and email sending
            const response = await fetch(`${siteUrl}/api/newsletter-signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                console.error('Newsletter subscription failed:', await response.text());
                // Optionally redirect with an additional message
                return redirect("/signup?message=Account created! Newsletter subscription failed, please try again later.");
            }
        } catch (err) {
            console.error("Failed to handle newsletter subscription:", err);
            // Optionally redirect with an additional message
            return redirect("/signup?message=Account created! Newsletter subscription failed, please try again later.");
        }
    }

    return redirect("/signup?message=Check your email to verify your account");
}

export async function signInWithGoogle(formData?: FormData) {
    const supabase = await createClient();
    const siteUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://aiwebsitebuilder.tech';

    const newsletter = formData?.get("newsletter") === "on";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/auth/callback?redirect_to=/dashboard`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
                newsletter: newsletter ? 'true' : 'false'
            }
        }
    });

    if (error) {
        return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
    }

    // Note: For Google sign-in, we'll need to handle the newsletter subscription
    // in the auth callback route since we don't have immediate access to the email

    return redirect(data.url);
} 