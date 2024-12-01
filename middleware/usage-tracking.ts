import { createClient } from '@/utils/supabase/server';
import { PLAN_LIMITS, PlanType } from '@/lib/constants/plans';

function getPlanLimits(plan: PlanType) {
    return PLAN_LIMITS[plan];
}

export async function trackAIEdit(userId: string) {
    const supabase = await createClient();

    const { data: usage, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) throw new Error('Failed to fetch usage data');

    if (usage.ai_edits_count >= getPlanLimits(usage.plan as PlanType).aiEdits) {
        throw new Error('AI edit limit reached');
    }

    await supabase
        .from('user_usage')
        .update({
            ai_edits_count: usage.ai_edits_count + 1
        })
        .eq('user_id', userId);
}

export async function trackWebsiteGeneration(userId: string) {
    const supabase = await createClient();

    const { data: usage, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) throw new Error('Failed to fetch usage data');

    if (usage.websites_generated >= getPlanLimits(usage.plan as PlanType).websitesGenerated) {
        throw new Error('Website generation limit reached');
    }

    await supabase
        .from('user_usage')
        .update({
            websites_generated: usage.websites_generated + 1,
            websites_active: usage.websites_active + 1
        })
        .eq('user_id', userId);
} 