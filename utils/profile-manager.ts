import { createClient } from '@/utils/supabase/client';

export async function updateProfile({
    firstName,
    lastName,
    avatarUrl
}: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Update user table
        const { error } = await supabase
            .from('users')
            .update({
                first_name: firstName,
                last_name: lastName,
                avatar_url: avatarUrl,
                name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
}

export async function uploadAvatar(file: File) {
    const supabase = createClient();

    try {
        // Log file details
        console.log('Starting avatar upload with file:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('No authenticated user found');
            throw new Error('No user found');
        }

        // Upload file
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        console.log('Attempting to upload file:', fileName);

        // First, upload to profile_avatars bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile_avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw uploadError;
        }

        console.log('File uploaded successfully:', uploadData);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('profile_avatars')
            .getPublicUrl(fileName);

        console.log('Generated public URL:', publicUrl);

        // Update user table with new avatar URL
        const { error: updateError } = await supabase
            .from('users')
            .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating user profile with avatar URL:', updateError);
            throw updateError;
        }

        console.log('Profile updated with new avatar URL');
        return publicUrl;
    } catch (error: any) {
        console.error('Error in uploadAvatar:', error);
        if (error && typeof error === 'object') {
            console.error('Full error details:', {
                message: error.message || 'Unknown error',
                code: error.code,
                details: error.details,
                hint: error.hint
            });
        }
        throw error;
    }
} 