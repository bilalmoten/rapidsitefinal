import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const newsletter = requestUrl.searchParams.get("newsletter") === "true";
    const redirect_to = requestUrl.searchParams.get("redirect_to");
    const origin = requestUrl.origin;

    console.log("Auth Callback Debug:", {
      code: code ? "present" : "missing",
      newsletter,
      redirect_to,
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
        if (data.user?.email && newsletter) {
          // Add to newsletter subscribers
          try {
            const { error: dbError } = await supabase
              .from("newsletter_subscribers")
              .insert([{
                email: data.user.email,
                status: 'active'
              }]);

            if (dbError) {
              console.error("Newsletter subscription error:", dbError);
            }

            // Send welcome email through our API
            const response = await fetch(`${requestUrl.origin}/api/newsletter-signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: data.user.email }),
            });

            if (!response.ok) {
              console.error('Failed to send welcome email:', await response.text());
            }
          } catch (err) {
            console.error("Failed to handle newsletter subscription:", err);
          }
        }

        // Determine the redirect URL
        let redirectUrl = `${origin}/dashboard`;

        // If we have a specific redirect_to parameter, use it
        if (redirect_to) {
          // Ensure redirect_to starts with a slash
          const normalizedRedirectTo = redirect_to.startsWith('/')
            ? redirect_to
            : `/${redirect_to}`;

          // Prioritize redirect to editor paths
          if (normalizedRedirectTo.includes('/editor/')) {
            console.log("Redirecting to editor path:", normalizedRedirectTo);
            redirectUrl = `${origin}${normalizedRedirectTo}`;
          } else {
            console.log("Redirecting to custom path:", normalizedRedirectTo);
            redirectUrl = `${origin}${normalizedRedirectTo}`;
          }
        }

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