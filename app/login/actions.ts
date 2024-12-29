"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
        return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

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