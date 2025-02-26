import { NextRequest, NextResponse } from 'next/server';
import { PostHog } from 'posthog-node';

// Initialize PostHog client
const client = new PostHog(
    process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
);

export async function GET(request: NextRequest) {
    console.log('📨 [Visitors API] Received request for visitor analytics');

    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    console.log('🔍 [Visitors API] Request params:', { subdomain, dateFrom, dateTo });

    if (!subdomain) {
        console.error('❌ [Visitors API] Missing subdomain parameter');
        return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
    }

    try {
        console.log('🔄 [Visitors API] Fetching visitor data from PostHog');

        // Fetch pageview events to analyze visitors
        const pageviewsUrl = `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/@current/events/?event=site_pageview&properties=[{"key":"subdomain","value":"${subdomain}","operator":"exact"}]&date_from=${dateFrom || '-30d'}&date_to=${dateTo || 'now'}`;

        const pageviewsResponse = await fetch(pageviewsUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}`
            }
        });

        const pageviews = await pageviewsResponse.json();

        console.log('📊 [Visitors API] Processing visitor data from', pageviews.results?.length || 0, 'events');

        // Process visitor data
        const visitorStats = processVisitorData(pageviews.results || []);

        console.log('✅ [Visitors API] Processed visitor stats:', visitorStats);

        return NextResponse.json(visitorStats);
    } catch (error) {
        console.error('❌ [Visitors API] Error fetching visitor analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch visitor analytics data' },
            { status: 500 }
        );
    }
}

function processVisitorData(events: any[]) {
    const visitors = new Set();
    const returningVisitors = new Set();
    const devices = {
        desktop: 0,
        mobile: 0,
        tablet: 0
    };
    const browsers: Record<string, number> = {};
    const countries: Record<string, number> = {};

    for (const event of events) {
        const visitorId = event.distinct_id;
        const properties = event.properties || {};

        // Track unique and returning visitors
        if (properties.is_returning) {
            returningVisitors.add(visitorId);
        }
        visitors.add(visitorId);

        // Determine device type based on screen size
        // Basic classification - can be made more sophisticated
        const screenWidth = properties.screen_width || 0;
        if (screenWidth >= 1024) {
            devices.desktop++;
        } else if (screenWidth >= 768) {
            devices.tablet++;
        } else {
            devices.mobile++;
        }

        // Track browser info
        const userAgent = properties.$browser || 'Unknown';
        browsers[userAgent] = (browsers[userAgent] || 0) + 1;

        // Track country info if available
        const country = properties.$geoip_country_name || 'Unknown';
        countries[country] = (countries[country] || 0) + 1;
    }

    return {
        total_visitors: visitors.size,
        returning_visitors: returningVisitors.size,
        devices,
        browsers,
        countries
    };
} 