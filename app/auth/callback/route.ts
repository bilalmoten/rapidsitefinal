import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // If there's a next parameter, redirect to that path
  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Default redirect to dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}