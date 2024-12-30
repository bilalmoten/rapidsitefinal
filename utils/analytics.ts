export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Check if gtag is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, properties);
    }
};

// Website Events
export const EVENTS = {
    WEBSITE: {
        CREATED: 'website_created',
        DEPLOYED: 'website_deployed',
        DELETED: 'website_deleted',
    },
    AI: {
        CHAT_STARTED: 'ai_chat_started',
        CHAT_COMPLETED: 'ai_chat_completed',
        EDIT_MADE: 'ai_edit_made',
    },
    AUTH: {
        SIGN_UP: 'user_signed_up',
        LOGIN: 'user_logged_in',
    }
}; 