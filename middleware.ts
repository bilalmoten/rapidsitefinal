import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  // Get the hostname and url
  const url = request.nextUrl;
  const hostname = request.headers.get('host')!;

  console.log('Incoming request:', {
    hostname,
    pathname: url.pathname,
    url: request.url
  });

  // Check for auth callback at root level and redirect if needed
  const code = url.searchParams.get('code');
  if (code && url.pathname === '/') {
    console.log('Detected auth callback at root, redirecting to /auth/callback');
    url.pathname = '/auth/callback';
    return NextResponse.redirect(url);
  }

  // Handle session update first
  const res = NextResponse.next();
  await updateSession(request);

  // Get hostname (e.g. subdomain.aiwebsitebuilder.tech)
  let host = hostname.replace(
    `.localhost:3000`,
    `.aiwebsitebuilder.tech`
  );

  console.log('Processed host:', host);

  // Special case for Vercel preview deployments
  if (
    hostname.includes('---') &&
    hostname.endsWith('.vercel.app')
  ) {
    host = `${hostname.split('---')[0]}.aiwebsitebuilder.tech`;
  }

  // Don't rewrite paths that should be public
  if (url.pathname.startsWith('/blog') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register') ||
    url.pathname.startsWith('/auth')) {
    return res;
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

  // Check custom domains first
  const supabase = await createClient();

  // Try different variations of the domain
  const domainVariations = [
    hostname,
    hostname.replace('www.', ''),
    `www.${hostname}`
  ];

  console.log('Checking domain variations:', domainVariations);

  const { data: customDomain, error: domainError } = await supabase
    .from('custom_domains')
    .select('website_id, status, domain')
    .in('domain', domainVariations)
    .eq('status', 'active')
    .single();

  console.log('Custom domain lookup:', {
    hostname,
    customDomain,
    error: domainError
  });

  if (customDomain) {
    console.log('Custom domain found:', customDomain.domain, 'for website:', customDomain.website_id);

    // Get the website details to ensure it exists
    const { data: website } = await supabase
      .from('websites')
      .select('id, subdomain')
      .eq('id', customDomain.website_id)
      .single();

    if (website) {
      console.log('Website found:', website);
      // Rewrite to the internal site route
      return NextResponse.rewrite(
        new URL(`/sites/${website.subdomain}${url.pathname}`, request.url)
      );
    }
  }

  // Only handle subdomains for aiwebsitebuilder.tech
  if (!host.endsWith('.aiwebsitebuilder.tech')) {
    console.log('Unknown domain:', hostname, 'redirecting to main site');
    return NextResponse.redirect(new URL('https://aiwebsitebuilder.tech'));
  }

  // Handle subdomains
  const subdomain = host.replace('.aiwebsitebuilder.tech', '');
  console.log('Processing subdomain:', subdomain);

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
    // Add routes that need auth
    '/dashboard/:path*',
    '/settings/:path*',
    // But exclude /sites routes
    '/((?!sites|api|_next/static|_next/image|favicon.ico).*)',
  ],
};
