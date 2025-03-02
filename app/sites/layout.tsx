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
      console.log("📥 [SitesLayout] Initializing PostHog with config:", {
        key: process.env.NEXT_PUBLIC_POSTHOG_KEY?.substring(0, 8) + "...",
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: posthog.__loaded,
        distinctId: posthog.get_distinct_id(),
      });
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
        capture_pageview: false,
        capture_pageleave: true,
        debug: true, // Enable debug mode to see PostHog logs
      });
      console.log("✅ [SitesLayout] PostHog initialized. Status:", {
        loaded: posthog.__loaded,
        distinctId: posthog.get_distinct_id(),
        config: posthog.config,
      });
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
      posthog_status: {
        loaded: posthog.__loaded,
        distinctId: posthog.get_distinct_id(),
        config: posthog.config,
      },
    };

    console.log(
      "📊 [SitesLayout] Attempting to capture pageview event:",
      eventData
    );

    // Only capture if we have a subdomain
    if (subdomain) {
      try {
        // Log the full PostHog state
        console.log("🔍 [SitesLayout] Full PostHog state:", {
          loaded: posthog.__loaded,
          config: posthog.config,
          distinctId: posthog.get_distinct_id(),
          host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
          hasKey: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
          currentUrl: window.location.href,
        });

        // Capture standard pageview with more properties
        const pageviewEvent = {
          $current_url: window.location.href,
          $referrer: document.referrer,
          $browser: navigator.userAgent,
          $device_type:
            window.innerWidth <= 768
              ? "mobile"
              : window.innerWidth <= 1024
                ? "tablet"
                : "desktop",
          $screen_height: window.screen.height,
          $screen_width: window.screen.width,
          $viewport_height: window.innerHeight,
          $viewport_width: window.innerWidth,
          $browser_language: navigator.language,
          site_subdomain: subdomain,
          path: fullPath,
          title: document.title,
        };

        console.log("📤 [SitesLayout] Sending pageview event:", pageviewEvent);
        posthog.capture("$pageview", pageviewEvent);
        console.log("✅ [SitesLayout] Successfully sent $pageview event");

        // Also capture our custom event with additional properties
        const siteVisitEvent = {
          ...pageviewEvent,
          event_type: "site_visit",
          visit_timestamp: new Date().toISOString(),
          is_returning: posthog.get_distinct_id() ? true : false,
          distinct_id: posthog.get_distinct_id(),
          $set: {
            last_visit: new Date().toISOString(),
            device_type: pageviewEvent.$device_type,
            browser: pageviewEvent.$browser,
          },
        };

        console.log(
          "📤 [SitesLayout] Sending site_visit event:",
          siteVisitEvent
        );
        posthog.capture("site_visit", siteVisitEvent);
        console.log("✅ [SitesLayout] Successfully sent site_visit event");

        // Debug PostHog status
        console.log("📋 [SitesLayout] PostHog status:", {
          loaded: posthog.__loaded,
          distinctId: posthog.get_distinct_id(),
          config: posthog.config,
        });

        // Track time spent on page when user leaves
        return () => {
          const timeSpent = Date.now() - performance.now();
          const leaveData = {
            $current_url: window.location.href,
            site_subdomain: subdomain,
            path: fullPath,
            time_spent_ms: timeSpent,
            distinct_id: posthog.get_distinct_id(),
            $set: {
              last_page_leave: new Date().toISOString(),
              last_time_spent: timeSpent,
            },
          };
          console.log(
            "👋 [SitesLayout] Attempting to capture page leave event:",
            leaveData
          );
          try {
            posthog.capture("site_pageleave", leaveData);
            console.log(
              "✅ [SitesLayout] Successfully captured page leave event"
            );
          } catch (error) {
            console.error(
              "❌ [SitesLayout] Error capturing page leave event:",
              error
            );
          }
        };
      } catch (error) {
        console.error(
          "❌ [SitesLayout] Error capturing pageview event:",
          error
        );
      }
    } else {
      console.warn(
        "⚠️ [SitesLayout] No subdomain found, skipping analytics capture"
      );
    }
  }, [params.subdomain, pathname, searchParams]);

  return <>{children}</>;
}
