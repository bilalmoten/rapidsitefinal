import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Update the Supabase session
  await updateSession(request);

  const url = request.nextUrl;
  let hostname = request.headers.get("host")!;

  // Check if we're in a local environment
  const isLocalhost = hostname.includes("localhost");

  const searchParams = request.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

  // Handle main app routes
  if (isLocalhost || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    // For login, dashboard, and API routes, continue as normal
    if (path.startsWith('/login') || path.startsWith('/dashboard') || path.startsWith('/api')) {
      return res;
    }

    // For the root path, show the landing page
    if (path === '/') {
      return NextResponse.rewrite(new URL(`/home${path}`, request.url));
    }
  }

  // Handle user subdomains
  const subdomain = isLocalhost ? hostname.split('.')[0] : hostname.split('.')[0];

  if (subdomain && subdomain !== "www") {
    // Rewrite to the root level for user sites
    return NextResponse.rewrite(new URL(`/${subdomain}${path}`, request.url));
  }

  // For any other cases, continue as normal
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
