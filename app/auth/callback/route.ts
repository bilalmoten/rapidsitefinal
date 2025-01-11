import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next");
    const origin = requestUrl.origin;

    console.log("Auth Callback Debug:", {
      code: code ? "present" : "missing",
      next,
      origin,
      fullUrl: request.url,
      allParams: Object.fromEntries(requestUrl.searchParams)
    });

    if (code) {
      const supabase = await createClient();
      console.log("Attempting to exchange code for session...");

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      console.log("Session Exchange Result:", {
        hasData: !!data,
        hasSession: !!data?.session,
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null,
        sessionInfo: data?.session ? {
          userId: data.session.user.id,
          expiresAt: data.session.expires_at
        } : null
      });

      if (!error && data.session) {
        const redirectUrl = next ? `${origin}${next}` : `${origin}/dashboard`;
        console.log("Auth successful, redirecting to:", redirectUrl);
        return NextResponse.redirect(redirectUrl);
      }
    }

    console.error("Auth callback failed:", code ? "Code exchange failed" : "No code provided");
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication failed")}`);
  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Unexpected error during authentication")}`);
  }
}