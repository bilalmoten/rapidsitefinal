import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { prompt } = await request.json();

    const apiKey = "523a50ed7a7444468d1ae5a384f032bf";
    const endpoint = "https://answerai-bilal.openai.azure.com/openai/deployments/o1-mini/chat/completions?api-version=2024-09-01-preview";
    const deploymentName = "o1-mini";
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
        return NextResponse.json({ error: 'Azure API request failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
}
