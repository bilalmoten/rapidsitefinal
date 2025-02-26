import { NextRequest, NextResponse } from 'next/server';
import { PostHog } from 'posthog-node';

// Initialize PostHog client
const client = new PostHog(
    process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
);

export async function GET(request: NextRequest) {
    console.log('📨 [Analytics API] Received request for analytics');

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

        const pageviewsUrl = `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/@current/events/?event=site_pageview&properties=[{"key":"subdomain","value":"${subdomain}","operator":"exact"}]&date_from=${dateFrom || '-30d'}&date_to=${dateTo || 'now'}`;
        console.log('📡 [Analytics API] Pageviews URL:', pageviewsUrl);

        const pageviewsResponse = await fetch(pageviewsUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}`
            }
        });

        console.log('🔄 [Analytics API] Fetching page leave data from PostHog');
        const pageLeavesResponse = await fetch(`${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/@current/events/?event=site_pageleave&properties=[{"key":"subdomain","value":"${subdomain}","operator":"exact"}]&date_from=${dateFrom || '-30d'}&date_to=${dateTo || 'now'}`, {
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}`
            }
        });

        const pageviews = await pageviewsResponse.json();
        const pageleaves = await pageLeavesResponse.json();

        console.log('📊 [Analytics API] Raw data received:', {
            pageviewsCount: pageviews.results?.length || 0,
            pageLeavesCount: pageleaves.results?.length || 0
        });

        // Process the data
        const pageStats = processPageViewData(pageviews.results || [], pageleaves.results || []);

        console.log('✅ [Analytics API] Processed data:', {
            total_views: pageStats.total_views,
            unique_visitors: pageStats.unique_visitors,
            pages_count: pageStats.pages.length
        });

        return NextResponse.json(pageStats);
    } catch (error) {
        console.error('❌ [Analytics API] Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}

function processPageViewData(pageviews: any[], pageleaves: any[]) {
    const pages = new Map();
    const visitors = new Set();

    // Process pageviews
    for (const view of pageviews) {
        const path = view.properties.path;
        visitors.add(view.distinct_id);

        if (!pages.has(path)) {
            pages.set(path, {
                path,
                views: 0,
                unique_visitors: new Set(),
                total_time: 0,
                visit_count: 0
            });
        }

        const pageStats = pages.get(path);
        pageStats.views++;
        pageStats.unique_visitors.add(view.distinct_id);
    }

    // Process page leave events to calculate time spent
    for (const leave of pageleaves) {
        const path = leave.properties.path;
        if (pages.has(path)) {
            const pageStats = pages.get(path);
            pageStats.total_time += leave.properties.time_spent_ms || 0;
            pageStats.visit_count++;
        }
    }

    // Convert the data to the required format
    const pagesArray = Array.from(pages.values()).map(page => ({
        path: page.path,
        views: page.views,
        unique_visitors: page.unique_visitors.size,
        average_time: page.visit_count > 0 ? page.total_time / page.visit_count : 0
    }));

    // Sort pages by views
    pagesArray.sort((a, b) => b.views - a.views);

    return {
        total_views: pageviews.length,
        unique_visitors: visitors.size,
        average_time_per_page: calculateAverageTime(pagesArray),
        pages: pagesArray,
        recent_views: pageviews
            .slice(0, 10)
            .map(view => ({
                timestamp: view.timestamp,
                path: view.properties.path
            }))
    };
}

function calculateAverageTime(pages: any[]) {
    if (pages.length === 0) return 0;
    const totalTime = pages.reduce((sum, page) => sum + page.average_time, 0);
    return totalTime / pages.length;
} 