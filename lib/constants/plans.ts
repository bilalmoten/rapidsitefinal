export const PLAN_LIMITS = {
    free: {
        websites: 1,
        aiEdits: 10,
        websitesGenerated: 3
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
    pro_monthly: 'your_variant_id_here',
    pro_yearly: 'your_variant_id_here',
    enterprise_monthly: 'your_variant_id_here',
    enterprise_yearly: 'your_variant_id_here'
}; 