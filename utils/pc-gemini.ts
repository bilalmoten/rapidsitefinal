import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerativeModel,
} from "@google/generative-ai";

export type GenerationConfig = {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
};

/**
 * Generate content using Google's Gemini API
 * @param prompt The prompt to generate content from
 * @param config Optional configuration parameters for generation
 * @param model The Gemini model to use (default: gemini-1.5-flash-latest)
 * @returns The generated text
 */
export async function generateContent(
    prompt: string,
    config: GenerationConfig = {},
    model = "gemini-1.5-flash-latest"
): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is required in environment variables');
    }

    try {
        // Initialize the Google Generative AI with API key
        const genAI = new GoogleGenerativeAI(apiKey);

        // Get the model
        const genModel: GenerativeModel = genAI.getGenerativeModel({
            model,
            generationConfig: {
                temperature: config.temperature ?? 0.7,
                topK: config.topK ?? 40,
                topP: config.topP ?? 0.95,
                maxOutputTokens: config.maxOutputTokens ?? 8192,
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });

        // Generate content
        const result = await genModel.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating content with Gemini:', error);
        throw error;
    }
} 