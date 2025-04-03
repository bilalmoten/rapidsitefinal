import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/utils/gemini";

// System prompt for the website design chat
const SYSTEM_PROMPT = `You are a helpful AI assistant specialized in website design and development.
Your job is to help users plan their website by gathering requirements and preferences.
Be friendly, conversational, and ask thoughtful follow-up questions to get more information when needed.

IMPORTANT CAPABILITIES LIMITATIONS:
- The websites you design CANNOT include any backend functionality or databases
- E-commerce functionality with shopping carts or payments is NOT possible
- Dynamic blogs with CMS capabilities are NOT possible
- Only static sites with basic contact forms can be created
- No user authentication or login systems are possible
- You should ONLY suggest functionality that can be implemented with HTML, CSS and basic JavaScript
- Always suggest a simple, elegant solution rather than complex functionality

WEBSITE TYPES THAT ARE POSSIBLE:
- Personal portfolios
- Simple business websites
- Landing pages
- Contact/information pages
- Basic brochure sites
- Simple showcase websites

VISUALIZATION CAPABILITIES:
You can provide structured data that will be automatically visualized in the chat interface.
Use these formats only when appropriate and when the user would benefit from visual representation,
NOT randomly or in every message. Your structured data will be rendered as interactive components.

IMPORTANT: Do NOT use markdown formatting like **bold** or *italic* in your responses.
Instead, use plain text with clear structure.

When you want to show specific visual elements, use EXACTLY these structured formats:

1. For color palettes (use when discussing color schemes):
COLOR_PALETTE:
{
  "primary": "#HEX_CODE",
  "secondary": "#HEX_CODE",
  "accent": "#HEX_CODE",
  "background": "#HEX_CODE",
  "text": "#HEX_CODE"
}

2. For typography suggestions (use when discussing fonts):
TYPOGRAPHY:
{
  "headingFont": "Font Name",
  "bodyFont": "Font Name",
  "sampleHeading": "Sample Heading Text",
  "sampleBody": "Sample paragraph text to demonstrate how body content would look with this typography selection."
}

3. For layout structure (use when discussing page organization):
LAYOUT:
{
  "type": "classic|modern|grid|blog|landing|shop",
  "description": "Brief description of the layout",
  "sections": ["Header", "Hero", "Features", "About", "Contact", etc.]
}

4. For design style examples (use when discussing overall aesthetic):
DESIGN_STYLE:
{
  "name": "Minimalist/Modern/etc.",
  "description": "Brief description of the style",
  "keyElements": ["Clean lines", "Ample white space", "Bold typography", etc.],
  "colorScheme": "Description of typical color scheme"
}

RESPONSE STYLE GUIDELINES:
- Always use a conversational, helpful tone
- Include individual color hex codes in #XXXXXX format when discussing specific colors
- Describe visual elements clearly and concretely 
- Use the structured formats above ONLY when it makes sense in the conversation
- Do not use the structured formats randomly or in every message
- Do not use markdown formatting like **bold** or *italic*
- Offer multiple suggestions rather than just one option when appropriate

For each response, provide 3-4 potential reply options for the user to help guide the conversation. 
Format these options at the end of your response using this exact format:

QUICK_REPLIES:
[
  {"text": "Short button text", "value": "Full response text", "isMultiSelect": false},
  {"text": "Short button text", "value": "Full response text", "isMultiSelect": true}
]

For the "isMultiSelect" field:
- Set to TRUE if this option could be combined with other options
- Set to FALSE if this option should be selected exclusively

Remember that you are gathering information for eventual website generation, but you are not generating the actual website code yet.`;

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid messages format" },
                { status: 400 }
            );
        }

        // Make sure we have at least one user message
        if (messages.length === 0 || (messages.length === 1 && messages[0].role === "assistant")) {
            return NextResponse.json(
                { error: "At least one user message is required" },
                { status: 400 }
            );
        }

        // Ensure we have a proper user -> assistant conversation flow
        const processedMessages: Message[] = [];
        let lastRole: string | null = null;

        // Process messages to ensure proper structure
        for (const msg of messages) {
            if (msg.role !== lastRole) {
                processedMessages.push(msg);
                lastRole = msg.role;
            }
        }

        // If the first message is not from a user, prepend a user message
        if (processedMessages.length > 0 && processedMessages[0].role !== "user") {
            processedMessages.unshift({
                role: "user",
                content: "Hello, I need help with my website design.",
            });
        }

        // Build the conversation history for the prompt
        let conversationHistory = "";

        for (const msg of processedMessages) {
            const roleLabel = msg.role === "user" ? "User" : "Assistant";
            conversationHistory += `${roleLabel}: ${msg.content}\n\n`;
        }

        // Prepare the full prompt with system instructions and conversation history
        const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation history:\n${conversationHistory}Assistant:`;

        // Use the existing generateContent function from utils/gemini
        const responseText = await generateContent(
            fullPrompt,
            {
                temperature: 0.7,
                maxOutputTokens: 4096,
                systemInstruction: SYSTEM_PROMPT
            },
            "gemini-2.0-flash-001" // Explicitly specify the model
        );

        // Extract quick reply options if they exist
        let options: any[] = [];
        const optionsMatch = responseText.match(/QUICK_REPLIES:\s*\[([\s\S]*?)\]/);

        if (optionsMatch) {
            try {
                let optionsJSON = `[${optionsMatch[1]}]`;

                // More robust JSON cleaning
                // Replace single quotes with double quotes
                optionsJSON = optionsJSON.replace(/'/g, '"');

                // Fix property names to be in double quotes
                optionsJSON = optionsJSON.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');

                // Handle trailing commas that would cause JSON.parse to fail
                optionsJSON = optionsJSON.replace(/,\s*([}\]])/g, '$1');

                // If JSON still fails to parse, try a simpler extraction approach
                try {
                    options = JSON.parse(optionsJSON);
                } catch (innerError) {
                    console.error("First parsing attempt failed:", innerError);

                    // Fallback: extract each option individually with regex
                    const optionRegex = /{\s*"text"\s*:\s*"([^"]+)"\s*,\s*"value"\s*:\s*"([^"]+)"\s*(?:,\s*"isMultiSelect"\s*:\s*(true|false))?\s*}/g;
                    let match;
                    options = [];

                    while ((match = optionRegex.exec(optionsJSON)) !== null) {
                        options.push({
                            text: match[1],
                            value: match[2],
                            isMultiSelect: match[3] === 'true'
                        });
                    }

                    if (options.length === 0) {
                        console.error("Fallback parsing also failed. No options extracted.");
                    }
                }
            } catch (error) {
                console.error("Error parsing options:", error);
            }
        }

        // Remove the QUICK_REPLIES section from the response text
        let cleanResponse = responseText.replace(/QUICK_REPLIES:\s*\[([\s\S]*?)\]/, "").trim();

        return NextResponse.json({
            response: cleanResponse,
            options: options,
        });
    } catch (error: any) {
        console.error("Gemini API error:", error.message);
        return NextResponse.json(
            { error: "Failed to get response from AI: " + error.message },
            { status: 500 }
        );
    }
} 