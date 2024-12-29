"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
    const siteUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://aiwebsitebuilder.tech';
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    console.log("Signup attempt with:", {
        email,
        redirectUrl: `${siteUrl}/auth/callback`,
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

    return redirect("/signup?message=Check your email to verify your account");
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const siteUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://aiwebsitebuilder.tech';

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/auth/callback?redirect_to=/dashboard`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            }
        }
    });

    if (error) {
        return redirect(`/signup?message=${encodeURIComponent(error.message)}`);
    }

    return redirect(data.url);
} 