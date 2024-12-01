import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { LEMON_VARIANT_IDS, PlanType } from '@/lib/constants/plans';

function getPlanFromVariantId(variantId: string): PlanType {
    const variantMap = {
        [LEMON_VARIANT_IDS.pro_monthly]: 'pro',
        [LEMON_VARIANT_IDS.pro_yearly]: 'pro',
        [LEMON_VARIANT_IDS.enterprise_monthly]: 'enterprise',
        [LEMON_VARIANT_IDS.enterprise_yearly]: 'enterprise'
    };
    return (variantMap[variantId] || 'free') as PlanType;
}

async function handleSubscriptionUpdate(supabase: any, payload: any) {
    const { user_id, variant_id, status } = payload.data;
    await supabase
        .from('user_usage')
        .update({
            plan: getPlanFromVariantId(variant_id),
            status: status
        })
        .eq('user_id', user_id);
}

async function handleSubscriptionCancel(supabase: any, payload: any) {
    const { user_id } = payload.data;
    await supabase
        .from('user_usage')
        .update({
            plan: 'free',
            status: 'cancelled'
        })
        .eq('user_id', user_id);
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const payload = await req.json();

    // Verify webhook signature
    // Handle different event types
    switch (payload.event_name) {
        case 'subscription_created':
            await handleNewSubscription(supabase, payload);
            break;
        case 'subscription_updated':
            await handleSubscriptionUpdate(supabase, payload);
            break;
        case 'subscription_cancelled':
            await handleSubscriptionCancel(supabase, payload);
            break;
    }

    return NextResponse.json({ received: true });
}

async function handleNewSubscription(supabase: any, payload: any) {
    const { user_id, variant_id, status } = payload.data;

    await supabase
        .from('user_usage')
        .update({
            plan: getPlanFromVariantId(variant_id),
            // Reset usage counts if needed
        })
        .eq('user_id', user_id);
} 