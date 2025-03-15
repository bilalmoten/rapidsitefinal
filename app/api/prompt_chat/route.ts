import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // const apiKey = "523a50ed7a7444468d1ae5a384f032bf";

        const apiKey = "d67fc89afb7a44aeb2fd7800aa3cadab";
        // const deploymentName = "o1-mini";
        const deploymentName = "gpt-4o-mini";
        // const deploymentName = "o1-preview";
        // const endpoint = `https://answerai-bilal.openai.azure.com/openai/deployments/${deploymentName}/chat/completions?api-version=2024-09-01-preview`;
        const endpoint = "https://ai-wbmulticrew715014556590.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview"
        const enhanced_prompt = `Please make a plan for the website of the user. A simple short plan detailing the website's purpose, pages, sections, design, color scheme, and any other relevant details. 1 page max.
    USER REQUEST: ${prompt}`;

        const response = await fetch(`${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey as string,
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: enhanced_prompt }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Azure API Error:', response.status, errorData);
            return NextResponse.json({
                error: 'Azure API request failed',
                status: response.status,
                details: errorData
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ text: data.choices[0].message.content });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
