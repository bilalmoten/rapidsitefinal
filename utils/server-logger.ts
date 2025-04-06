import { PostHog } from 'posthog-node';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, any>;

// Initialize PostHog client for server-side
let postHogClient: PostHog | null = null;

// Initialize the PostHog client if API key is available
if (process.env.POSTHOG_API_KEY) {
    try {
        postHogClient = new PostHog(
            process.env.POSTHOG_API_KEY,
            { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
        );
        console.info('✅ Server logger initialized with PostHog');
    } catch (error) {
        console.error('❌ Failed to initialize PostHog server client:', error);
    }
}

export const serverLogger = {
    debug(message: string, context?: LogContext) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[SERVER DEBUG] ${message}`, context);
        }
    },

    info(message: string, context?: LogContext) {
        console.info(`[SERVER INFO] ${message}`, context);

        // Only send to PostHog if specifically requested
        if (postHogClient && context?.sendToAnalytics) {
            try {
                postHogClient.capture({
                    distinctId: context.distinctId || 'server',
                    event: 'server_log',
                    properties: {
                        level: 'info',
                        message,
                        ...context
                    }
                });
            } catch (e) {
                console.info('Failed to log info to PostHog', e);
            }
        }
    },

    warn(message: string, context?: LogContext) {
        console.warn(`[SERVER WARN] ${message}`, context);

        // Send warnings to PostHog with context
        if (postHogClient) {
            try {
                postHogClient.capture({
                    distinctId: context?.distinctId || 'server',
                    event: 'server_log',
                    properties: {
                        level: 'warn',
                        message,
                        ...context
                    }
                });
            } catch (e) {
                console.warn('Failed to log warning to PostHog', e);
            }
        }
    },

    error(message: string, error?: Error, context?: LogContext) {
        // Always log to console
        console.error(`[SERVER ERROR] ${message}`, error, context);

        // Send to PostHog
        if (postHogClient) {
            try {
                const errorDetails = error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : {};

                postHogClient.capture({
                    distinctId: context?.distinctId || 'server',
                    event: 'server_error',
                    properties: {
                        message,
                        error: errorDetails,
                        ...context
                    }
                });
            } catch (e) {
                console.error('Failed to log error to PostHog', e);
            }
        }
    },

    track(eventName: string, distinctId: string, properties?: Record<string, any>) {
        if (postHogClient) {
            try {
                postHogClient.capture({
                    distinctId,
                    event: eventName,
                    properties
                });
            } catch (e) {
                console.error('Failed to track event in PostHog', e);
            }
        }
    },

    // Make sure to flush events before shutting down
    shutdown() {
        if (postHogClient) {
            try {
                postHogClient.shutdown();
            } catch (e) {
                console.error('Error shutting down PostHog client', e);
            }
        }
    }
};

export default serverLogger; 