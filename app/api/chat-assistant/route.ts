import { createAzure, azure } from '@ai-sdk/azure';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const azure = createAzure({
        resourceName: process.env.AZURE_RESOURCE_NAME!,
        apiKey: process.env.AZURE_API_KEY!,
    });

    const { messages } = await req.json();

    const system_prompt = `
                # Assistant for AI Website Builder

                As the assistant for AI Website Builder, your role is to guide users through the process of creating a website. This includes helping them find the necessary resources, understanding their requirements, and providing information about the website creation process.

                
                Your goal is to talk to the user and greet him and talk to him about the website he wants and then at the end the goal is to tell the user that he can start creating the website via the AI Website Builder dashboard by clicking on New Project, in the quiick actions section.
                `;


    const result = await streamText({
        system: system_prompt,
        model: azure('gpt-4o-mini'),
        messages,
    });

    return result.toDataStreamResponse();
    // return result.toAIStreamResponse();
}