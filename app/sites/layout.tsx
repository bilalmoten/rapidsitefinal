"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";

interface SitesLayoutProps {
  children: React.ReactNode;
  params: {
    subdomain: string;
  };
}

export default function SitesLayout({ children, params }: SitesLayoutProps) {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("🔍 [SitesLayout] Starting PostHog initialization check");
    console.log("🔑 PostHog Config:", {
      key: process.env.NEXT_PUBLIC_POSTHOG_KEY ? "Present" : "Missing",
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ? "Present" : "Missing",
    });

    // Initialize PostHog if not already initialized
    if (!posthog.__loaded) {
      console.log("📥 [SitesLayout] Initializing PostHog");
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
        capture_pageview: false,
        capture_pageleave: true,
      });
      console.log("✅ [SitesLayout] PostHog initialized:", posthog.__loaded);
    } else {
      console.log("ℹ️ [SitesLayout] PostHog already initialized");
    }

    // Get the full URL including search params
    let fullPath = pathname;
    if (searchParams?.toString()) {
      fullPath += `?${searchParams.toString()}`;
    }

    // Extract subdomain from path if not available in params
    let subdomain = params.subdomain;
    if (!subdomain && pathname.startsWith("/sites/")) {
      const matches = pathname.match(/^\/sites\/([^\/]+)/);
      if (matches && matches[1]) {
        subdomain = matches[1];
        console.log(
          "🔍 [SitesLayout] Extracted subdomain from path:",
          subdomain
        );
      }
    }

    // Log the event data before capture
    const eventData = {
      subdomain: subdomain,
      path: fullPath,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      language: navigator.language,
      is_returning: posthog.get_distinct_id() ? true : false,
    };

    console.log("📊 [SitesLayout] Capturing pageview event:", eventData);

    // Only capture if we have a subdomain
    if (subdomain) {
      // Capture detailed pageview data
      posthog.capture("site_pageview", eventData);

      // Track time spent on page when user leaves
      return () => {
        const timeSpent = Date.now() - performance.now();
        const leaveData = {
          subdomain: subdomain,
          path: fullPath,
          time_spent_ms: timeSpent,
        };
        console.log("👋 [SitesLayout] Capturing page leave event:", leaveData);
        posthog.capture("site_pageleave", leaveData);
      };
    } else {
      console.warn(
        "⚠️ [SitesLayout] No subdomain found, skipping analytics capture"
      );
    }
  }, [params.subdomain, pathname, searchParams]);

  return <>{children}</>;
}
