import { createClient } from '@/utils/supabase/client';

export async function redirectToCheckout(variantId: string) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Redirect to Lemon Squeezy checkout
        const checkoutUrl = `https://rapidsite.lemonsqueezy.com/checkout/buy/${variantId}?checkout[email]=${user.email}&checkout[custom][user_id]=${user.id}`;
        window.location.href = checkoutUrl;
    } catch (error) {
        console.error('Error redirecting to checkout:', error);
        throw error;
    }
} 