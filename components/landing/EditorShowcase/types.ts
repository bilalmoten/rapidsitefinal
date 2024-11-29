export interface ChatMessage {
    role: "ai" | "user";
    content: string;
}

export interface Message extends ChatMessage {
    isComplete: boolean;
    displayedContent: string;
    progress?: number;
}

export type WorkflowState = "chat" | "generating" | "editing";
export type EditingMode = "manual" | "ai" | null;

export const chatSequence: ChatMessage[] = [
    {
        role: "ai",
        content: "Hi! I'm your AI assistant. What would you like to build today?",
    },
    {
        role: "user",
        content:
            "I need a hero section for my SaaS website. Something modern with gradients and floating elements.",
    },
    {
        role: "ai",
        content:
            "I can help with that! A few quick questions:\n1. Any specific color scheme in mind?\n2. Would you like a prominent CTA button?\n3. Should we include product screenshots?",
    },
    {
        role: "user",
        content:
            "I'd like purple and blue gradients, yes to the CTA, and maybe some floating 3D elements instead of screenshots.",
    },
    {
        role: "ai",
        content:
            "Perfect! I'll create a hero section with:\n- Purple to blue gradient background\n- Large headline with gradient text\n- Engaging subheadline\n- Prominent CTA button\n- Floating 3D elements for visual interest\n\nShall I start generating?",
    },
    {
        role: "user",
        content: "Yes, that sounds exactly what I need!",
    },
    {
        role: "ai",
        content: "Great! Starting the generation process now...",
    },
    // ... rest of the chat sequence
];

export const TYPING_SPEED_AI = 30;
export const TYPING_SPEED_USER = 50; 