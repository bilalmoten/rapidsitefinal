import posthog from 'posthog-js';

export interface PageViewStats {
    total_views: number;
    unique_visitors: number;
    average_time_per_page: number;
    pages: Array<{
        path: string;
        views: number;
        unique_visitors: number;
        average_time: number;
    }>;
    recent_views: Array<{
        timestamp: string;
        path: string;
    }>;
}

export interface VisitorStats {
    total_visitors: number;
    returning_visitors: number;
    devices: {
        desktop: number;
        mobile: number;
        tablet: number;
    };
    browsers: Record<string, number>;
    countries: Record<string, number>;
}

// Note: These functions should be called from a server component or API route
export async function getSitePageViews(
    subdomain: string,
    dateFrom: string,
    dateTo: string
): Promise<PageViewStats> {
    // This should be implemented in an API route using PostHog's server-side API
    const response = await fetch(`/api/analytics/pageviews?subdomain=${subdomain}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    const data = await response.json();
    return data;
}

export async function getVisitorStats(
    subdomain: string,
    dateFrom: string,
    dateTo: string
): Promise<VisitorStats> {
    // This should be implemented in an API route using PostHog's server-side API
    const response = await fetch(`/api/analytics/visitors?subdomain=${subdomain}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    const data = await response.json();
    return data;
}

// Helper function to format the analytics data for display
export function formatAnalyticsData(data: PageViewStats) {
    return {
        totalViews: data.total_views.toLocaleString(),
        uniqueVisitors: data.unique_visitors.toLocaleString(),
        averageTime: formatTime(data.average_time_per_page),
        topPages: data.pages.slice(0, 5).map(page => ({
            path: page.path,
            views: page.views.toLocaleString(),
            uniqueVisitors: page.unique_visitors.toLocaleString(),
            averageTime: formatTime(page.average_time)
        }))
    };
}

// Helper function to format time in milliseconds to readable format
function formatTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
} 