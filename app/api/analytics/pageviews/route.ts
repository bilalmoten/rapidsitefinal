import { NextRequest, NextResponse } from 'next/server';
import { PostHog } from 'posthog-node';

// Initialize PostHog client
const client = new PostHog(
    process.env.POSTHOG_API_KEY!,
    { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
);

// Function to fetch paginated events
async function fetchAllEvents(subdomain: string, dateFrom: string | null, dateTo: string | null) {
    let allEvents: any[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    // Build the query for both event types with proper properties
    const eventsQuery = [
        {
            event: '$pageview',
            properties: {
                site_subdomain: subdomain
            }
        },
        {
            event: 'site_visit',
            properties: {
                site_subdomain: subdomain
            }
        }
    ];

    while (hasMore) {
        // Construct the URL with proper encoding and pagination
        const pageviewsUrl = new URL(`${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/@current/events/`);
        pageviewsUrl.searchParams.append('date_from', dateFrom || '-30d');
        pageviewsUrl.searchParams.append('date_to', dateTo || 'now');
        pageviewsUrl.searchParams.append('events', JSON.stringify(eventsQuery));
        pageviewsUrl.searchParams.append('properties', JSON.stringify([
            { key: 'site_subdomain', value: subdomain, operator: 'exact' }
        ]));
        if (cursor) {
            pageviewsUrl.searchParams.append('after', cursor);
        }

        const response = await fetch(pageviewsUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.POSTHOG_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PostHog API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        allEvents = allEvents.concat(data.results || []);

        // Check if there are more events to fetch
        cursor = data.next;
        hasMore = !!cursor;

        // Log progress
        console.log(`📊 [Analytics API] Fetched ${allEvents.length} events so far...`);
    }

    return allEvents;
}

export async function GET(request: NextRequest) {
    console.log('📨 [Analytics API] Received request for analytics');
    console.log('🔑 [Analytics API] Server config:', {
        apiKeyPresent: !!process.env.POSTHOG_API_KEY,
        hostPresent: !!process.env.NEXT_PUBLIC_POSTHOG_HOST,
        apiKeyPrefix: process.env.POSTHOG_API_KEY?.substring(0, 8)
    });

    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    console.log('🔍 [Analytics API] Request params:', { subdomain, dateFrom, dateTo });

    if (!subdomain) {
        console.error('❌ [Analytics API] Missing subdomain parameter');
        return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 });
    }

    try {
        console.log('🔄 [Analytics API] Fetching pageview data from PostHog');

        // Fetch all events
        const allEvents = await fetchAllEvents(subdomain, dateFrom, dateTo);
        console.log(`✅ [Analytics API] Successfully fetched ${allEvents.length} total events`);

        // Extract unique visitors and device info
        const visitors = new Set();
        const devices = { desktop: 0, mobile: 0, tablet: 0 };
        const browsers = new Map();
        const paths = new Map();
        const dailyStats = new Map();

        allEvents.forEach((event: any) => {
            const props = event.properties || {};
            const timestamp = new Date(event.timestamp);
            const dateKey = timestamp.toISOString().split('T')[0];

            // Track daily stats
            if (!dailyStats.has(dateKey)) {
                dailyStats.set(dateKey, {
                    date: dateKey,
                    views: 0,
                    unique_visitors: new Set()
                });
            }
            const dayStats = dailyStats.get(dateKey);
            dayStats.views++;
            dayStats.unique_visitors.add(event.distinct_id);

            // Track unique visitors
            visitors.add(event.distinct_id);

            // Track device types
            const deviceType = props.$device_type || 'unknown';
            if (devices.hasOwnProperty(deviceType)) {
                devices[deviceType as keyof typeof devices]++;
            }

            // Track browsers
            const browser = props.$browser || 'unknown';
            browsers.set(browser, (browsers.get(browser) || 0) + 1);

            // Track paths
            const path = props.path || '/';
            if (!paths.has(path)) {
                paths.set(path, {
                    path,
                    views: 0,
                    unique_visitors: new Set(),
                    total_time: 0
                });
            }
            const pathStats = paths.get(path);
            pathStats.views++;
            pathStats.unique_visitors.add(event.distinct_id);
            if (props.time_spent_ms) {
                pathStats.total_time += props.time_spent_ms;
            }
        });

        // Convert daily stats to array and sort by date
        const dailyData = Array.from(dailyStats.values())
            .map(day => ({
                date: day.date,
                views: day.views,
                unique_visitors: day.unique_visitors.size
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Process the data
        const pageStats = {
            total_views: allEvents.length,
            unique_visitors: visitors.size,
            pages: Array.from(paths.values())
                .map(stats => ({
                    path: stats.path,
                    views: stats.views,
                    unique_visitors: stats.unique_visitors.size,
                    average_time: stats.total_time / stats.views || 0
                }))
                .sort((a, b) => b.views - a.views),
            visitor_stats: {
                total_visitors: visitors.size,
                devices,
                browsers: Object.fromEntries(browsers),
                recent_visitors: allEvents.slice(0, 10).map((event: any) => ({
                    timestamp: event.timestamp,
                    device: event.properties?.$device_type || 'unknown',
                    browser: event.properties?.$browser || 'unknown',
                    path: event.properties?.path || '/'
                }))
            },
            daily_stats: dailyData
        };

        return NextResponse.json(pageStats);
    } catch (error) {
        console.error('❌ [Analytics API] Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

function processPageViews(events: any[]) {
    const pageStats = new Map();

    events.forEach(event => {
        const path = event.properties?.path || '/';
        if (!pageStats.has(path)) {
            pageStats.set(path, {
                path,
                views: 0,
                unique_visitors: new Set(),
                total_time: 0
            });
        }

        const stats = pageStats.get(path);
        stats.views++;
        stats.unique_visitors.add(event.distinct_id);
        if (event.properties?.time_spent_ms) {
            stats.total_time += event.properties.time_spent_ms;
        }
    });

    return Array.from(pageStats.values()).map(stats => ({
        path: stats.path,
        views: stats.views,
        unique_visitors: stats.unique_visitors.size,
        average_time: stats.total_time / stats.views || 0
    }));
} 