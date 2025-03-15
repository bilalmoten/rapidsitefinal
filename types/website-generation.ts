// Type definitions for website generation visualizations

// SaaS Website Data based on sample_reqs_2.json
export interface SaaSWebsiteData {
    websiteName?: string;
    description?: string;
    businessGoals?: string[];
    targetAudience?: string;
    websiteStructure?: {
        pages: {
            name: string;
            sections: {
                sectionName: string;
                contentType: string;
                content?: any; // This can be different for each section
                designNotes?: string;
            }[];
        }[];
    };
    designPreferences?: {
        overallStyle?: string;
        font?: string;
        imagesGraphics?: string;
        colorScheme?: {
            primaryColors: string[];
            accentColors: string[];
        };
    };
    contentRequirements?: {
        features?: Array<{
            title: string;
            description: string;
            icon?: string;
        }>;
        testimonials?: Array<{
            name: string;
            role: string;
            quote: string;
        }>;
        integrations?: Array<{
            name: string;
            icon?: string;
        }>;
    };
    additionalDetails?: string[];
    summary?: string;
}

// More specific content types
export interface NavbarContent {
    type: "logo" | "link";
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
}

export interface HeroContent {
    headline: string;
    subheadline: string;
    callToAction: {
        text: string;
        link: string;
    };
    callToAction2?: {
        text: string;
        link: string;
    };
}

export interface FeatureContent {
    title: string;
    icon?: string;
    description: string;
}

export interface PricingPlan {
    planName: string;
    price: string;
    features: string[];
    callToAction: string;
}

export interface Integration {
    name: string;
    icon?: string;
}

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
}

export interface DemoContent {
    description: string;
    callToAction: {
        text: string;
        link: string;
    };
    videoUrl?: string;
} 