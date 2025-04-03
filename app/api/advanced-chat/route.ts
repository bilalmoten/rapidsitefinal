// app/api/advanced-chat/route.ts
import { NextResponse } from 'next/server';
import type { ChatMessage, InteractiveComponentData, ProjectBrief } from '@/types/advanced-chat'; // Adjust path
import { constructSystemPrompt } from './systemPrompt'; // Your system prompt logic
import { generateContent } from '@/utils/gemini'; // Import your working utility

const MODEL_NAME = 'gemini-2.0-flash-001'; // Use the appropriate model name supported by your setup

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const messages: ChatMessage[] = body.messages;
        // Optional context data you might pass from frontend
        // const currentBrief: ProjectBrief = body.currentBrief;
        // const currentChatState: string = body.currentChatState;

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
        }

        // Construct the system prompt dynamically if needed
        const systemInstruction = constructSystemPrompt(
            // currentBrief,
            // currentChatState
        );

        // --- Construct the Prompt from Message History ---
        // Your `generateContent` takes a single string prompt.
        // We need to format the chat history into a single string prompt.
        // A common way is alternating roles. Ensure the last message is implicitly the user's input.
        let promptString = "";
        messages.forEach(msg => {
            // Map roles for clarity in the text prompt
            let rolePrefix = "";
            if (msg.role === 'user') rolePrefix = "User:";
            else if (msg.role === 'assistant') rolePrefix = "Assistant:";
            else if (msg.role === 'system') rolePrefix = "System Note:"; // Include system notes? Optional.

            if (rolePrefix && msg.content) { // Only include messages with content
                promptString += `${rolePrefix}\n${msg.content}\n\n`;
            }
        });
        // Add a final prompt for the assistant to respond
        promptString += "Assistant:\n"; // Gemini usually responds after this marker


        console.log(`Constructed Prompt Length: ${promptString.length}`);
        // console.log(`Constructed Prompt Preview:\n${promptString.substring(0, 500)}...`); // Log more preview if needed

        // --- Call your Gemini Utility ---
        const text = await generateContent(
            promptString,
            {
                temperature: 0.7,
                maxOutputTokens: 1024, // Adjust as needed
                systemInstruction: systemInstruction,
            },
            MODEL_NAME // Pass the model name
        );

        // --- Parse AI response for potential interactive component data ---
        let responseText = text;
        let interactiveData: InteractiveComponentData | null = null;
        const interactiveMarker = "INTERACTIVE_COMPONENT:";
        const interactiveStartIndex = text.indexOf(interactiveMarker);

        if (interactiveStartIndex !== -1) {
            const interactiveJsonString = text.substring(interactiveStartIndex + interactiveMarker.length).trim();
            responseText = text.substring(0, interactiveStartIndex).trim();
            try {
                const parsedData = JSON.parse(interactiveJsonString);
                if (parsedData && typeof parsedData === 'object' && parsedData.type && parsedData.props && parsedData.promptKey) {
                    interactiveData = parsedData as InteractiveComponentData;
                    console.log("Parsed Interactive Component Data:", interactiveData);
                } else {
                    console.warn("Failed to parse valid interactive component structure:", interactiveJsonString);
                }
            } catch (e) {
                console.error("Error parsing interactive component JSON:", e, "\nJSON String:", interactiveJsonString);
                responseText = text; // Fallback to full text
            }
        }

        console.log(`Final Response Text Length: ${responseText.length}`);
        console.log(`Interactive Data Found: ${!!interactiveData}`);
        console.log(`======================================\n`);

        const responsePayload = {
            response: responseText,
            interactiveComponentData: interactiveData,
        };

        return NextResponse.json(responsePayload);

    } catch (error) {
        console.error("Error in advanced-chat API:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: `Internal Server Error: ${errorMsg}` }, { status: 500 });
    }
}