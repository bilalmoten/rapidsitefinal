import { createClient } from './client';
import { User } from '@supabase/supabase-js';

// Sign in anonymously (client-side only)
export async function signInAnonymously() {
    try {
        const supabase = createClient();

        // Use Supabase's signInAnonymously method
        const { data, error } = await supabase.auth.signInAnonymously();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error in anonymous sign-in:', error);
        throw error;
    }
}

// Convert anonymous user to permanent user (client-side only)
export async function convertToPermanentUser(email: string, password: string) {
    try {
        const supabase = createClient();

        // First, check if the user is currently signed in anonymously
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user || userData.user.email) {
            throw new Error('No anonymous session found or user already has an email');
        }

        // Link email and password to the anonymous account
        const { data, error } = await supabase.auth.updateUser({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error converting to permanent user:', error);
        throw error;
    }
}

// Check if current user is anonymous (client-side only)
export async function isAnonymousUser(): Promise<boolean> {
    try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
            return false;
        }

        // Anonymous users have no email
        return !data.user.email;
    } catch (error) {
        console.error('Error checking anonymous status:', error);
        return false;
    }
}

// Merge data from anonymous user to existing user (should be called server-side)
export async function mergeAnonymousData(anonymousUserId: string, permanentUserId: string) {
    try {
        const supabase = createClient();

        // Get all websites created by the anonymous user
        const { data: anonymousWebsites, error: fetchError } = await supabase
            .from('websites')
            .select('*')
            .eq('user_id', anonymousUserId);

        if (fetchError) {
            throw fetchError;
        }

        if (!anonymousWebsites || anonymousWebsites.length === 0) {
            return { mergedCount: 0 };
        }

        // Update user_id of all websites to the permanent user ID
        const { error: updateError } = await supabase
            .from('websites')
            .update({ user_id: permanentUserId })
            .eq('user_id', anonymousUserId);

        if (updateError) {
            throw updateError;
        }

        return {
            mergedCount: anonymousWebsites.length,
            websites: anonymousWebsites
        };
    } catch (error) {
        console.error('Error merging anonymous data:', error);
        throw error;
    }
} 