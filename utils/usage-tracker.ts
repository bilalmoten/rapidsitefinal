import { createClient } from '@/utils/supabase/client';
import { PLAN_LIMITS, PlanType } from '@/lib/constants/plans';

export async function checkAndUpdateAIEdits(userId: string): Promise<boolean> {
    const supabase = createClient();

    try {
        const { data: usage, error } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        if (usage.ai_edits_count >= PLAN_LIMITS[usage.plan as PlanType].aiEdits) {
            return false; // Limit reached
        }

        // Update count
        await supabase
            .from('user_usage')
            .update({ ai_edits_count: usage.ai_edits_count + 1 })
            .eq('user_id', userId);

        return true; // Success
    } catch (error) {
        console.error('Error tracking AI edits:', error);
        return false;
    }
}

export async function checkWebsiteGenerationLimit(userId: string): Promise<boolean> {
    const supabase = createClient();

    try {
        const { data: usage, error } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return usage.websites_generated < PLAN_LIMITS[usage.plan as PlanType].websitesGenerated;
    } catch (error) {
        console.error('Error checking website limit:', error);
        return false;
    }
}

export async function checkAIEditsLimit(userId: string): Promise<{
    canEdit: boolean;
    remaining: number;
}> {
    const supabase = createClient();

    try {
        const { data: usage, error } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        const limit = PLAN_LIMITS[usage.plan as PlanType].aiEdits;
        const remaining = limit - usage.ai_edits_count;

        return {
            canEdit: usage.ai_edits_count < limit,
            remaining
        };
    } catch (error) {
        console.error('Error checking AI edits limit:', error);
        return { canEdit: false, remaining: 0 };
    }
}

export async function incrementAIEdits(userId: string): Promise<boolean> {
    const supabase = createClient();

    try {
        const { data: usage, error } = await supabase
            .from('user_usage')
            .select('ai_edits_count')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        await supabase
            .from('user_usage')
            .update({ ai_edits_count: usage.ai_edits_count + 1 })
            .eq('user_id', userId);

        return true;
    } catch (error) {
        console.error('Error incrementing AI edits:', error);
        return false;
    }
} 