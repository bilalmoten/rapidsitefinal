import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get("next");
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // If this is a password reset and we have a next URL
    if (type === "recovery" && next) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Default redirect to dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}