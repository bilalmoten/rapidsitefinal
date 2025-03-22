"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { convertToPermanentUser, mergeAnonymousData } from "@/utils/supabase/anon-auth";


export async function signUp(formData: FormData) {
    const siteUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://rapidai.website';
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
        : 'https://rapidai.website';

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

export async function convertAnonymousUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const newsletter = formData.get("newsletter") === "on";
    const redirectPath = formData.get("redirectPath") as string || "/dashboard";

    const siteUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://rapidai.website';

    const supabase = await createClient();

    try {
        // First get the current user to check if they're anonymous
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
            return {
                error: "No user session found. Please try again."
            };
        }

        // Check if they are anonymous (no email)
        const isAnonymous = !currentUser.email;

        if (!isAnonymous) {
            return {
                error: "This account is not anonymous. Please sign in normally."
            };
        }

        // Save the current user ID to use for data migration
        const anonymousUserId = currentUser.id;

        console.log("Converting anonymous user:", {
            anonymousUserId,
            email,
            redirectPath
        });

        // Prepare redirect URL with the editor path if available
        let emailRedirectTo = `${siteUrl}/auth/callback`;

        // If we have a specific redirectPath like /dashboard/editor/123, 
        // include it in the email verification link
        if (redirectPath && redirectPath !== "/dashboard") {
            emailRedirectTo = `${siteUrl}/auth/callback?redirect_to=${encodeURIComponent(redirectPath)}`;
        }

        console.log("Email redirect URL:", emailRedirectTo);

        // Convert anonymous user to permanent
        const { error } = await supabase.auth.updateUser({
            email,
            password,
            data: {
                newsletter: newsletter,
                redirect_url: emailRedirectTo
            }
        }, {
            emailRedirectTo
        });

        if (error) {
            console.error("Error converting anonymous user:", error);

            if (error.message.includes("already registered")) {
                return {
                    error: "This email is already registered. Please use a different email or log in."
                };
            }

            return {
                error: error.message || "Failed to convert anonymous user"
            };
        }

        // Return success message instead of redirecting
        return {
            success: true,
            message: "Check your email to verify your account. Your Express Mode website has been saved to your account."
        };
    } catch (error: any) {
        console.error("Error in convertAnonymousUser:", error);
        return {
            error: error.message || "An unexpected error occurred"
        };
    }
} 