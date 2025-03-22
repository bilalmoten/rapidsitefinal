import { vertex } from '@ai-sdk/google-vertex';
import { generateText } from 'ai';

// Default model to use
const DEFAULT_MODEL = 'gemini-2.0-flash-001';

// Configure Vertex AI with environment variables
// These variables should be set in your environment:
// - GOOGLE_VERTEX_PROJECT_ID
// - GOOGLE_VERTEX_LOCATION (optional, defaults to us-central1)

/**
 * Generate content using Google's Gemini model via Vertex AI
 * @param prompt The prompt to generate content from
 * @param options Configuration options for the generation
 * @param modelName Optional model name to override the default
 * @returns The generated content text
 */
export async function generateContent(
    prompt: string,
    options: {
        temperature?: number;
        maxOutputTokens?: number;
        systemInstruction?: string;
    } = {},
    modelName: string = DEFAULT_MODEL
) {
    try {
        const { temperature = 0.7, maxOutputTokens = 1024, systemInstruction } = options;

        // Log the API call parameters
        console.log(`\n====== GEMINI API CALL (${modelName}) ======`);
        console.log(`Temperature: ${temperature}`);
        console.log(`Max Output Tokens: ${maxOutputTokens}`);
        console.log(`System Instruction: ${systemInstruction ? 'Provided' : 'None'}`);
        console.log(`Prompt Length: ${prompt.length} characters`);
        console.log(`Prompt Preview: ${prompt.substring(0, 200)}...`);

        const callStartTime = Date.now();

        // Using any type assertion to avoid TypeScript errors with module compatibility
        const model = vertex(modelName) as any;

        console.log(`Model initialized: ${modelName}`);

        // Prepare and log the configuration
        const config = {
            model,
            prompt,
            temperature,
            maxTokens: maxOutputTokens,
            system: systemInstruction,
        };

        console.log(`API call config prepared`);

        // Generate the content
        const result = await generateText(config);

        const callEndTime = Date.now();
        const callDuration = (callEndTime - callStartTime) / 1000;

        console.log(`API call completed in ${callDuration.toFixed(2)} seconds`);
        console.log(`Response length: ${result.text.length} characters`);
        console.log(`Response preview: ${result.text.substring(0, 200)}...`);
        console.log(`======================================\n`);

        return result.text;
    } catch (error) {
        console.error('Error generating content with Gemini:', error);
        throw error;
    }
}

/**
 * Generate content with continuation support for handling longer outputs
 * Used for longer content generation that may exceed token limits
 * 
 * @param prompt The prompt to generate content from
 * @param options Configuration options for the generation
 * @param modelName The model to use (defaults to gemini-2.0-flash-001)
 * @returns The generated content text, potentially continued across multiple requests
 */
export async function generateContentWithContinuation(
    prompt: string,
    options: {
        temperature?: number;
        maxOutputTokens?: number;
        systemInstruction?: string;
    } = {},
    modelName: string = DEFAULT_MODEL
) {
    try {
        const { temperature = 0.7, maxOutputTokens = 1024, systemInstruction } = options;

        console.log(`\n====== GEMINI API CALL WITH CONTINUATION (${modelName}) ======`);
        console.log(`Temperature: ${temperature}`);
        console.log(`Max Output Tokens: ${maxOutputTokens}`);
        console.log(`System Instruction: ${systemInstruction ? 'Provided' : 'None'}`);
        console.log(`Prompt Length: ${prompt.length} characters`);
        console.log(`Prompt Preview: ${prompt.substring(0, 200)}...`);

        const callStartTime = Date.now();

        // Using any type assertion to avoid TypeScript errors with module compatibility
        const model = vertex(modelName) as any;

        console.log(`Model initialized: ${modelName}`);

        // Prepare and log the configuration
        const config = {
            model,
            prompt,
            temperature,
            maxTokens: maxOutputTokens,
            system: systemInstruction,
            maxSteps: 3, // Enable up to 3 continuation steps
            experimental_continueSteps: true  // Enable continuation
        };

        console.log(`API call config prepared with continuation enabled (maxSteps: 3)`);

        const result = await generateText(config);

        const callEndTime = Date.now();
        const callDuration = (callEndTime - callStartTime) / 1000;

        console.log(`API call completed in ${callDuration.toFixed(2)} seconds`);
        console.log(`Response length: ${result.text.length} characters`);
        console.log(`Response preview: ${result.text.substring(0, 200)}...`);
        console.log(`======================================\n`);

        return result.text;
    } catch (error) {
        console.error('Error generating content with Gemini (with continuation):', error);
        throw error;
    }
}
