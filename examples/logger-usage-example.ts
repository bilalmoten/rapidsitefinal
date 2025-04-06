// BEFORE: Component with traditional console logging
export function beforeExample() {
    try {
        // Some operation that might fail
        const result = fetchDataFromAPI();

        console.log("Data fetched successfully", result);

        if (result.hasWarnings) {
            console.warn("API returned warnings", result.warnings);
        }

        return result;
    } catch (error) {
        console.error("Error fetching data:", error);

        // Additional error context logging
        console.error("Request context:", {
            userId: "user-123",
            component: "DataFetcher",
            timestamp: new Date().toISOString()
        });

        return null;
    }
}

// ------------------------------------------------------------

// AFTER: Using the new logger system
import { logger } from "@/utils/logger";
// Import the server logger
import serverLogger from "@/utils/server-logger";

export function afterExample() {
    try {
        // Some operation that might fail
        const result = fetchDataFromAPI();

        // Replace console.log with logger.info
        // Only send to analytics when it's important enough
        logger.info("Data fetched successfully", {
            component: "DataFetcher",
            feature: "data-fetching",
            resultStatus: result.status
        });

        if (result.hasWarnings) {
            // Replace console.warn with logger.warn
            // Will automatically be sent to PostHog
            logger.warn("API returned warnings", {
                component: "DataFetcher",
                feature: "data-fetching",
                warnings: result.warnings
            });
        }

        // Track specific events for analytics
        logger.track("data_fetch_complete", {
            success: true,
            duration: result.timing,
            dataSize: result.data.length
        });

        return result;
    } catch (error) {
        // Replace console.error with logger.error
        // Note how we pass the error object separately
        logger.error(
            "Error fetching data",
            error instanceof Error ? error : new Error(String(error)),
            {
                component: "DataFetcher",
                feature: "data-fetching",
                userId: "user-123",
            }
        );

        // Track error events specifically
        logger.track("data_fetch_error", {
            errorType: error instanceof Error ? error.name : "unknown",
            errorMessage: error instanceof Error ? error.message : String(error)
        });

        return null;
    }
}

// For server components, use serverLogger instead:
export async function serverComponentExample(userId: string) {
    try {
        // Server operation
        const result = await fetchDataFromDatabase();

        // Server logger with the same API
        serverLogger.info("Database query successful", {
            component: "ServerDataProvider",
            query: "getUserData",
            rows: result.length
        });

        // Track a server-side event
        // Note: serverLogger.track requires distinctId
        if (userId) {
            serverLogger.track("server_data_fetch", userId, {
                success: true,
                query: "getUserData"
            });
        }

        return result;
    } catch (error) {
        serverLogger.error("Database query failed", error as Error, {
            component: "ServerDataProvider",
            query: "getUserData",
            userId
        });

        return null;
    }
}

// Mock functions (not real implementations)
function fetchDataFromAPI() {
    return { status: 'success', data: [], timing: 123, hasWarnings: false, warnings: [] };
}

async function fetchDataFromDatabase() {
    return [];
} 