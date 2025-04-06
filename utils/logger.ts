import posthog from 'posthog-js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, any>;

// Simple logger that integrates with PostHog
export const logger = {
    debug(message: string, context?: LogContext) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[DEBUG] ${message}`, context);
        }
    },

    info(message: string, context?: LogContext) {
        console.info(`[INFO] ${message}`, context);

        // Don't send info logs to PostHog unless in specific circumstances
        if (context?.sendToAnalytics) {
            posthog.capture('app_log', {
                level: 'info',
                message,
                ...context
            });
        }
    },

    warn(message: string, context?: LogContext) {
        console.warn(`[WARN] ${message}`, context);

        // Send warnings to PostHog with context
        try {
            posthog.capture('app_log', {
                level: 'warn',
                message,
                ...context
            });
        } catch (e) {
            console.warn('Failed to log warning to PostHog', e);
        }
    },

    error(message: string, error?: Error, context?: LogContext) {
        // Always log to console
        console.error(`[ERROR] ${message}`, error, context);

        // Send to PostHog
        try {
            const errorDetails = error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : {};

            posthog.capture('app_error', {
                message,
                error: errorDetails,
                ...context
            });
        } catch (e) {
            console.error('Failed to log error to PostHog', e);
        }
    },

    track(eventName: string, properties?: Record<string, any>) {
        try {
            posthog.capture(eventName, properties);
        } catch (e) {
            console.error('Failed to track event in PostHog', e);
        }
    }
};

// For server-side usage where posthog-js isn't available
export const serverLogger = {
    debug(message: string, context?: LogContext) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`[SERVER DEBUG] ${message}`, context);
        }
    },

    info(message: string, context?: LogContext) {
        console.info(`[SERVER INFO] ${message}`, context);
    },

    warn(message: string, context?: LogContext) {
        console.warn(`[SERVER WARN] ${message}`, context);
    },

    error(message: string, error?: Error, context?: LogContext) {
        console.error(`[SERVER ERROR] ${message}`, error, context);
    }
};

export default logger; 