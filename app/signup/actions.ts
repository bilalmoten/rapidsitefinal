"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
    const siteUrl = "https://aiwebsitebuilder.tech";
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
            emailRedirectTo: `${siteUrl}/auth/callback`,
            data: {
                redirect_url: `${siteUrl}/auth/callback`,
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