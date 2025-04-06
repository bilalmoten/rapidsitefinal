import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/utils/gemini';

export const runtime = 'nodejs';

// Log environment variables when this module loads to help with debugging
console.log('=== Gemini API Route Environment Variables ===');
console.log('GOOGLE_VERTEX_LOCATION:', process.env.GOOGLE_VERTEX_LOCATION || 'not set');
console.log('GOOGLE_VERTEX_PROJECT_ID:', process.env.GOOGLE_VERTEX_PROJECT_ID || 'not set');
console.log('GOOGLE_APPLICATION_CREDENTIALS is set:', !!process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('==============================================');

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Add a simple test prompt for debugging
        console.log(`Using test prompt: "${prompt.substring(0, 50)}..."`);

        // Call the Gemini API with the provided prompt
        try {
            const response = await generateContent(
                prompt,
                {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
                'gemini-2.0-flash-001'
            );

            // Return the generated content
            return NextResponse.json({ response });
        } catch (apiError: any) {
            console.error('Detailed Gemini API error:', {
                message: apiError.message,
                code: apiError.code,
                statusCode: apiError.statusCode,
                details: apiError.details,
            });

            // Check for common auth issues
            if (apiError.message && apiError.message.includes('JWT') || apiError.message.includes('token')) {
                console.error('This appears to be an authentication issue with the Google credentials');
                console.error('Please verify that your service account has proper permissions');
            }

            throw apiError;
        }
    } catch (error: any) {
        console.error('Error in Gemini test API:', error);

        return NextResponse.json(
            { error: error.message || 'Failed to generate content' },
            { status: 500 }
        );
    }
} 