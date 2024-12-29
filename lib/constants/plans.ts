export const PLAN_LIMITS = {
    free: {
        websites: 1,
        aiEdits: 10,
        websitesGenerated: 3
        // websites: 0,
        // aiEdits: 0,
        // websitesGenerated: 0
    },
    pro: {
        websites: 5,
        aiEdits: 100,
        websitesGenerated: 20
    },
    enterprise: {
        websites: 999,
        aiEdits: 999,
        websitesGenerated: 999
    }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export const LEMON_VARIANT_IDS = {
    pro_monthly: '617721',
    pro_yearly: '617722',
    pro_max_monthly: '617723',
    pro_max_yearly: '617725',
    starter: '393389'
};

export type VariantId = keyof typeof LEMON_VARIANT_IDS; 