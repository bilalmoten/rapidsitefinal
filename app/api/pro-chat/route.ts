import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/utils/gemini';
import { PCMessage } from '@/hooks/useProChatStore';

// Define a system prompt that clearly outlines the AI assistant's role
const SYSTEM_PROMPT = `You are Pro Chat, an AI assistant specialized in helping users create beautiful, modern, and professional websites with RapidSite.

## Your Role and Approach
You act as a high-level business development executive or consultant when gathering requirements. Focus first on understanding:
- Business goals and objectives
- Target audience and their needs
- Key messaging and value proposition
- Brand identity and positioning

Only dive into specific design details and technical specifications when the fundamental business requirements are clear. Ask probing, strategic questions that help define the business case before moving to implementation details.

## Project Brief Updates
You can update the project brief directly by including a JSON command in your response. This allows you to capture key information even when it's expressed in natural language. Use the following format:

\`\`\`project-brief-update
{
  "purpose": "string (optional) - The website's main purpose",
  "targetAudience": "string (optional) - Description of the target audience",
  "designNotes": "string (optional) - Notes about design preferences",
  "contentNotes": "string (optional) - Notes about content requirements",
  "webStructure": "object (optional) - The entire website structure object when selected by the user"
}
\`\`\`

Include this in your response when you identify key information about the project. Only include fields that you have information for - leave out fields if you're not yet confident about them. The user won't see this JSON block; it will be processed automatically.

When a user selects a website structure from the interactive component, ALWAYS include the full structure object in the project-brief-update.

## Quick Reply Options
When offering multiple choice options to the user, please use the following JSON format to ensure they are properly displayed as clickable buttons:

\`\`\`quick-replies
[
  "Option 1",
  "Option 2",
  "Option 3"
]
\`\`\`

Or for more complex options:

\`\`\`quick-replies
[
  {"text": "Option 1", "value": "value1"},
  {"text": "Option 2", "value": "value2"}
]
\`\`\`

The user won't see this JSON block; it will be processed automatically and displayed as buttons.

## Website Capabilities
You can help create STATIC WEBSITES ONLY, with the following limitations:
- NO backend functionality (user authentication, databases, etc.)
- NO e-commerce or payment processing
- NO dynamic content that requires server-side processing
- NO user accounts or login systems

### WEBSITES YOU CAN CREATE:
- Portfolios and personal websites
- Business landing pages and brochures
- Professional services websites
- Event and conference websites
- Simple blogs (with static content)
- Restaurant and local business websites
- Non-profit organization websites

### WEBSITES YOU CANNOT CREATE:
- E-commerce stores with shopping carts
- Membership sites with login areas
- Online courses with user accounts
- Social networks or forums
- Web applications with complex functionality
- Websites requiring database integration
- Sites needing financial transactions

## Interactive Components
You can use several interactive components to gather user input efficiently:

### 1. Color Palette Selector
Suggest 3-5 color palettes based on brand personality, industry standards, and user preferences.

\`\`\`json
{
  "type": "interactive",
  "promptKey": "colorPalette",
  "props": {
    "options": [
      {
        "id": "1",
        "name": "Modern Tech",
        "description": "Clean, minimal palette with blue accent",
        "colors": ["#FFFFFF", "#F5F7FA", "#0F172A", "#3B82F6", "#1D4ED8"]
      }
    ]
  }
}
\`\`\`

### 2. Font Pairing Selector
Suggest 3-5 font combinations that match the brand style.

\`\`\`json
{
  "type": "interactive",
  "promptKey": "fontPairing",
  "props": {
    "options": [
      {
        "id": "1",
        "name": "Modern Sans",
        "description": "Clean and professional",
        "headingFont": "Inter",
        "bodyFont": "Roboto",
        "headingClass": "font-sans",
        "bodyClass": "font-sans",
        "sample": "The quick brown fox jumps over the lazy dog."
      }
    ]
  }
}
\`\`\`

### 3. Design Style Selector
Suggest 3-5 visual design styles.

\`\`\`json
{
  "type": "interactive",
  "promptKey": "designStyle",
  "props": {
    "options": [
      {
        "id": "1",
        "name": "Minimalist",
        "description": "Clean design with ample whitespace and subtle details",
        "icon": "✨",
        "keyElements": ["Simple layouts", "Limited color palette", "Focus on typography", "Subtle animations"]
      }
    ]
  }
}
\`\`\`

### 4. Website Structure Selector
Suggest website structure with pages and sections.

\`\`\`json
{
  "type": "interactive",
  "promptKey": "webStructure",
  "props": {
    "options": [
      {
        "id": "1",
        "name": "Business Standard",
        "pages": [
          {
            "id": "home",
            "title": "Home",
            "path": "/",
            "isHome": true,
            "sections": [
              {
                "id": "hero",
                "title": "Hero Section",
                "type": "Hero"
              },
              {
                "id": "features",
                "title": "Features",
                "type": "Features Grid"
              },
              {
                "id": "testimonials",
                "title": "Testimonials",
                "type": "Testimonials"
              },
              {
                "id": "cta",
                "title": "Call to Action",
                "type": "CTA"
              }
            ]
          },
          {
            "id": "about",
            "title": "About",
            "path": "/about",
            "sections": [
              {
                "id": "story",
                "title": "Our Story",
                "type": "Content"
              },
              {
                "id": "team",
                "title": "Team",
                "type": "Team Grid"
              }
            ]
          },
          {
            "id": "contact",
            "title": "Contact",
            "path": "/contact",
            "sections": [
              {
                "id": "contactForm",
                "title": "Contact Form",
                "type": "Contact Form"
              },
              {
                "id": "map",
                "title": "Location",
                "type": "Map"
              }
            ]
          }
        ]
      }
    ]
  }
}
\`\`\`

## Important Guidelines
1. Begin with understanding the business context and target audience before diving into specifics
2. GUIDE the user through the website creation process step-by-step
3. EDUCATE the user throughout the process about best practices
4. Users can share references and upload images that you can use to inform your suggestions
5. Users can generate their website at ANY point (even without completing all steps)
6. ASK clarifying questions when user requirements are vague or unclear
7. If the user requests something not possible (e.g., e-commerce), politely explain the limitations
8. Focus on understanding business GOALS first, then recommend solutions
9. ACTIVELY use the project-brief-update JSON to capture important information

Be conversational, friendly, and guide the user to create a website that meets their business needs without overwhelming them with technical details.
`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const messages: PCMessage[] = body.messages || [];
        const projectBrief = body.projectBrief || {};

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Invalid request: messages array is required' },
                { status: 400 }
            );
        }

        // Filter out system and hidden messages
        const visibleMessages = messages.filter(
            (msg) => msg.role !== 'system' && !msg.hidden
        );

        // Format messages for the API
        const formattedMessages = visibleMessages.map((msg) => {
            // Extract just the text content
            return {
                role: msg.role,
                content: msg.content
            };
        });

        // Create a prompt that includes the system instructions, project brief, and conversation history
        const projectBriefText = JSON.stringify({
            siteName: projectBrief.siteName || "",
            purpose: projectBrief.purpose || "",
            targetAudience: projectBrief.targetAudience || "",
            // Only include design elements if they've been selected
            designStyle: projectBrief.designStyle && projectBrief.designStyle !== "minimalist" ? projectBrief.designStyle : "",
            colorPalette: projectBrief.colorPalette && projectBrief.colorPalette.id !== "default" ? projectBrief.colorPalette.name : "",
            fontPairing: projectBrief.fontPairing && projectBrief.fontPairing.id !== "modern" ? projectBrief.fontPairing.name : "",
            hasWebStructure: !!projectBrief.webStructure,
            contentReferences: projectBrief.contentReferences?.length || 0,
            assetsCount: projectBrief.assets?.length || 0
        });

        const conversationText = formattedMessages.map(msg =>
            `${msg.role.toUpperCase()}: ${msg.content}`
        ).join('\n\n');

        const fullPrompt = `${SYSTEM_PROMPT}\n\nCURRENT PROJECT BRIEF:\n${projectBriefText}\n\nCONVERSATION HISTORY:\n${conversationText}\n\nASSISTANT:`;

        // Generate a response using the Gemini API
        const response = await generateContent(fullPrompt, {
            temperature: 0.7,
            maxOutputTokens: 2048
        }, "gemini-2.0-flash-001");

        // Process the response to identify any interactive components or options
        const interactiveComponentMatch = response.match(/```json\n({[\s\S]*?})\n```/);
        let interactiveComponent = null;
        let cleanedResponse = response;

        if (interactiveComponentMatch) {
            try {
                // Try to parse the JSON block
                const parsedJson = JSON.parse(interactiveComponentMatch[1]);
                interactiveComponent = parsedJson;

                // Remove the JSON block from the response
                cleanedResponse = response.replace(/```json\n[\s\S]*?\n```/, '').trim();
            } catch (e) {
                console.error('Error parsing interactive component:', e);
            }
        }

        // Extract any project brief updates
        const briefUpdateMatch = response.match(/```project-brief-update\n({[\s\S]*?})\n```/);
        let briefUpdates = null;

        if (briefUpdateMatch) {
            try {
                // Try to parse the project brief update JSON
                briefUpdates = JSON.parse(briefUpdateMatch[1]);

                // Remove the project brief update JSON from the response
                cleanedResponse = cleanedResponse.replace(/```project-brief-update\n[\s\S]*?\n```/, '').trim();
            } catch (e) {
                console.error('Error parsing project brief updates:', e);
            }
        }

        // Extract quick reply options using the new format
        let options: any[] = [];
        const quickRepliesMatch = response.match(/```quick-replies\n([\s\S]*?)\n```/);

        if (quickRepliesMatch) {
            try {
                // Try to parse the quick replies
                const quickReplies = JSON.parse(quickRepliesMatch[1]);
                if (Array.isArray(quickReplies)) {
                    options = quickReplies;
                }

                // Remove the quick replies JSON from the response
                cleanedResponse = cleanedResponse.replace(/```quick-replies\n[\s\S]*?\n```/, '').trim();
            } catch (e) {
                console.error('Error parsing quick replies:', e);
            }
        }

        // If we didn't find structured quick replies, fall back to parsing from text
        if (options.length === 0) {
            // Format 1: "Options:" followed by dash-prefixed list
            const optionsRegex1 = /Options:\s*\n\s*-(.+?)(?=\n\n|\n[^-]|$)/gm;
            const optionsMatch1 = cleanedResponse.match(optionsRegex1);

            if (optionsMatch1) {
                // Extract options from the response
                for (const optionsSection of optionsMatch1) {
                    const optionLines = optionsSection.split('\n')
                        .filter(line => line.trim().startsWith('-'))
                        .map(line => line.replace(/^-\s*/, '').trim());
                    options = [...options, ...optionLines];
                }

                // Remove the options sections from the response
                cleanedResponse = cleanedResponse.replace(optionsRegex1, '').trim();
            }

            // Format 2: Numbered list with options
            const optionsRegex2 = /(\d+\.\s+.+)(?=\n\d+\.|\n\n|$)/g;
            const optionsMatch2 = cleanedResponse.match(optionsRegex2);

            if (optionsMatch2 && !options.length) {
                // Check if this seems like a list of options rather than just a numbered list
                // Only treat as options if preceded by something that indicates they are options
                const prevText = cleanedResponse.substring(0, cleanedResponse.indexOf(optionsMatch2[0]));
                const isOptionsList = /options|choose|select|pick|choice|prefer/i.test(prevText.slice(-50));

                if (isOptionsList) {
                    options = optionsMatch2.map(option =>
                        option.replace(/^\d+\.\s+/, '').trim()
                    );

                    // Remove the options from the response if they form a consecutive block
                    const optionsText = optionsMatch2.join('\n');
                    if (cleanedResponse.includes(optionsText)) {
                        cleanedResponse = cleanedResponse.replace(optionsText, '').trim();
                    }
                }
            }

            // Format 3: Options within asterisks or bullet points
            // Only process these if explicitly marked as options
            if (!options.length) {
                const optionsHeaderMatch = cleanedResponse.match(/(?:options|choices|select from|pick from)[ \t:]*\r?\n/i);

                if (optionsHeaderMatch && optionsHeaderMatch.index !== undefined) {
                    const startIdx = optionsHeaderMatch.index + optionsHeaderMatch[0].length;
                    const textAfterHeader = cleanedResponse.substring(startIdx);

                    const optionsRegex3 = /^[\*•]\s+([^*\n]+)(?=\n[\*•]|\n\n|$)/gm;
                    let match;
                    const bulletOptions = [];
                    let optionsText = '';

                    // Create a copy of the regex to measure the full matching text
                    const measureRegex = /^[\*•]\s+([^*\n]+)(?=\n[\*•]|\n\n|$)/gm;
                    const allMatches = textAfterHeader.match(measureRegex);

                    if (allMatches) {
                        optionsText = allMatches.join('\n');

                        // Reset and collect individual options
                        while ((match = optionsRegex3.exec(textAfterHeader)) !== null) {
                            bulletOptions.push(match[1].trim());
                        }

                        if (bulletOptions.length > 1) {
                            options = bulletOptions;

                            // Remove the options section including the header
                            const fullOptionsText = optionsHeaderMatch[0] + optionsText;
                            cleanedResponse = cleanedResponse.replace(fullOptionsText, '').trim();
                        }
                    }
                }
            }
        }

        // Clean up the response further - remove empty lines at the beginning/end
        cleanedResponse = cleanedResponse.replace(/^\s*\n+|\n+\s*$/g, '');

        return NextResponse.json({
            response: cleanedResponse,
            options,
            interactiveComponent,
            briefUpdates
        });

    } catch (error) {
        console.error('Error processing chat request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
} 