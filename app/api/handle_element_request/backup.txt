// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//     try {
//         const { elementCode, userRequest, creativity = 0.1 } = await request.json();
//         console.log("elementCode", elementCode);

//         const apiKey = "523a50ed7a7444468d1ae5a384f032bf";
//         const endpoint = "https://answerai-bilal.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-09-01-preview";

//         // Craft a specific prompt for modifying HTML
//         const prompt = `As a web developer, modify the following HTML code section based on this request: "${userRequest}"

// Current HTML section:
// ${elementCode}

// Requirements:
// 1. Provide ONLY the modified HTML code - no explanations
// 2. The new code must be a direct replacement for the current code, whether its a full page, a section, or a single element
// 3. You can modify anything including HTML structure, Tailwind classes, content, and styling, as per the users request.
// 4. The code should be complete and valid HTML
// 5. Feel free to add new elements, change layouts, modify colors, or restructure as requested
// 6. Use Tailwind CSS for styling
// 7. Remember this is part of a larger page, so consider the context of the page when making changes, and do not change things that arent requested and keep the original structure as much as possible, unless user aks otherwise.

// Remember: Your response should be just the HTML code that will replace the current section.`;

//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'api-key': apiKey,
//             },
//             body: JSON.stringify({
//                 messages: [{ role: 'user', content: prompt }],
//                 temperature: creativity,
//                 max_tokens: 2000,
//             }),
//         });

//         if (!response.ok) {
//             throw new Error(`Azure API request failed: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const updatedCode = data.choices[0].message.content.trim();

//         // Basic validation to ensure we got HTML code
//         if (!updatedCode.includes('<') || !updatedCode.includes('>')) {
//             throw new Error('Invalid HTML received from AI');
//         }
//         // console.log("elementCode", elementCode);
//         console.log("updatedCode", updatedCode);
//         return NextResponse.json({
//             message: "Request processed",
//             code: elementCode,
//             updatedCode
//         });

//     } catch (error: unknown) {
//         console.error('Error processing request:', error);
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//         return NextResponse.json(
//             { error: 'Failed to process request', details: errorMessage },
//             { status: 500 }
//         );
//     }
// }

// // Original dummy code for reference:
// /*
// export async function POST(request: Request) {
//     const { elementCode, userRequest } = await request.json();

//     // Here, you would typically process the request and generate the updated code
//     // For this example, we're just adding the new button as requested
//     const updatedCode = `<div class="mt-8 flex justify-center gap-4" contenteditable="true">
//         <a href="#products" class="inline-block px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Shop nowww</a>
//         <a href="#philosophy" class="inline-block px-6 py-3 text-sm font-semibold text-green-600 bg-green-100 rounded-md hover:bg-green-200">Learn More</a>
//         <a href="#contact" class="inline-block px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Talk to Us</a>
//     </div>`;

//     return NextResponse.json({
//         message: "Request processed",
//         updatedCode
//     });
// }
// */
