import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Get the hostname and url
  const url = request.nextUrl;
  const hostname = request.headers.get('host')!;

  // Handle session update first
  const res = NextResponse.next();
  await updateSession(request);

  // Get hostname (e.g. subdomain.aiwebsitebuilder.tech)
  let host = hostname.replace(
    `.localhost:3000`,
    `.aiwebsitebuilder.tech`
  );

  // Special case for Vercel preview deployments
  if (
    hostname.includes('---') &&
    hostname.endsWith('.vercel.app')
  ) {
    host = `${hostname.split('---')[0]}.aiwebsitebuilder.tech`;
  }

  // If it's the main domain, just return the session-updated response
  if (
    host === 'aiwebsitebuilder.tech' ||
    host === 'www.aiwebsitebuilder.tech' ||
    host === 'localhost:3000' ||
    host.endsWith('.localhost:3000')
  ) {
    return res;
  }

  // Handle subdomains
  const subdomain = host.replace('.aiwebsitebuilder.tech', '');

  // Prevent direct access to /sites folder
  if (url.pathname.startsWith(`/sites`)) {
    url.pathname = `/404`;
    return NextResponse.rewrite(url);
  }

  // Rewrite subdomain requests to the sites dynamic route
  return NextResponse.rewrite(
    new URL(`/sites/${subdomain}${url.pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    // Keep your existing matchers and add the subdomain matcher
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Add matcher for root path when accessed via subdomain
    "/"
  ],
};
