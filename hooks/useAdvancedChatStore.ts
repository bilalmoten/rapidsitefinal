// hooks/useAdvancedChatStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer'; // Use immer for easier state updates
import { v4 as uuidv4 } from 'uuid';
import type {
    AdvancedChatState,
    ChatMessage,
    ProjectBrief,
    SiteNode,
    InteractiveComponentData,
    FontPairingOption // Import Option type
} from '@/types/advanced-chat';

// Helper to create empty node
const createEmptyNode = (type: 'page' | 'section' = 'page', name: string = ''): SiteNode => ({
    id: uuidv4(), type, name: name || (type === 'page' ? 'New Page' : 'New Section'), children: [],
});

// --- Temporary/Placeholder Data for Font Pairing Logic ---
// In a real app, this data should ideally come from a config file, API, or be part of the store state itself.
const availableFontPairings: FontPairingOption[] = [
    { id: 'inter-roboto', name: 'Modern Sans', headingFont: 'Inter', bodyFont: 'Roboto', headingClass: 'font-sans', bodyClass: 'font-sans' },
    { id: 'playfair-lato', name: 'Elegant Serif', headingFont: 'Playfair Display', bodyFont: 'Lato', headingClass: 'font-serif', bodyClass: 'font-sans' },
    { id: 'montserrat-opensans', name: 'Bold & Friendly', headingFont: 'Montserrat', bodyFont: 'Open Sans', headingClass: 'font-sans', bodyClass: 'font-sans' },
];
// --- End Placeholder Data ---


const initialProjectBrief: ProjectBrief = {
    siteName: 'My Awesome Site',
    purpose: '',
    targetAudience: '',
    // Use default ID from actual options if available, otherwise fallback string
    designStyle: availableFontPairings[0]?.id ?? 'modern',
    colorPalette: {
        id: 'default-light',
        name: 'Default Light',
        colors: ['#FFFFFF', '#F8F9FA', '#6C757D', '#343A40', '#0D6EFD']
    },
    // Use details from default font option if available, otherwise fallback structure
    fontPairing: {
        id: availableFontPairings[0]?.id ?? 'inter-roboto',
        headingFont: availableFontPairings[0]?.headingFont ?? 'Inter',
        bodyFont: availableFontPairings[0]?.bodyFont ?? 'Roboto',
        headingClass: availableFontPairings[0]?.headingClass ?? 'font-sans',
        bodyClass: availableFontPairings[0]?.bodyClass ?? 'font-sans',
    },
    structure: [createEmptyNode('page', 'Home'),],
    keyContentSnippets: {},
    inspirationUrls: [],
    inspirationImages: [],
};

export const useAdvancedChatStore = create(
    immer<AdvancedChatState>((set, get) => ({
        messages: [],
        projectBrief: initialProjectBrief,
        isLoading: false,
        chatState: 'INTRODUCTION',
        error: null,
        sessionId: uuidv4(),

        initChat: (siteName: string) => {
            set((state) => {
                const defaultBrief = { ...initialProjectBrief, siteName: siteName || 'Untitled Site', structure: [createEmptyNode('page', 'Home')] };
                state.projectBrief = defaultBrief;
                state.messages = [{ id: uuidv4(), role: 'assistant', content: `👋 Hi there! I'm your AI website design partner. Let's create an amazing website for **${siteName || 'your project'}**. To start, could you tell me a bit about the main purpose of this site?`, timestamp: new Date() }];
                state.chatState = 'GATHERING_PURPOSE';
                state.isLoading = false; state.error = null; state.sessionId = uuidv4();
            });
        },

        addMessage: (message) => {
            set((state) => { state.messages.push(message); if (state.messages.length > 50) state.messages.shift(); });
        },

        updateMessage: (id, updates) => {
            set((state) => {
                const messageIndex = state.messages.findIndex((m: ChatMessage) => m.id === id);
                if (messageIndex !== -1) state.messages[messageIndex] = { ...state.messages[messageIndex], ...updates };
            });
        },

        setMessages: (messages) => set({ messages }),
        setProjectBrief: (brief) => set({ projectBrief: brief }),
        updateProjectBrief: (updates) => set((state) => { state.projectBrief = { ...state.projectBrief, ...updates }; }),
        setIsLoading: (loading) => set({ isLoading: loading }),
        setChatState: (stateValue) => { set({ chatState: stateValue }); console.log("Chat State Updated:", stateValue); },
        setError: (error) => set({ error }),
        processAssistantResponse: (response) => {
            set((state) => {
                state.isLoading = false;
                const assistantMessage: ChatMessage = {
                    id: uuidv4(), role: 'assistant', content: response.text, timestamp: new Date(),
                    interactiveComponentData: response.interactiveData ?? null, interactionProcessed: !response.interactiveData,
                };
                state.messages.push(assistantMessage);
                // State transition logic (keep as is for now)
                const responseLower = response.text.toLowerCase();
                if (state.chatState === 'GATHERING_PURPOSE' && (responseLower.includes('style') || responseLower.includes('look and feel'))) state.chatState = 'DEFINING_STYLE';
                else if (state.chatState === 'DEFINING_STYLE' && (responseLower.includes('structure') || responseLower.includes('pages'))) state.chatState = 'STRUCTURE_CONTENT';
                else if (state.chatState === 'STRUCTURE_CONTENT' && (responseLower.includes('refine') || responseLower.includes('details'))) state.chatState = 'REFINEMENT';
                else if (responseLower.includes('ready to generate') || responseLower.includes('final confirmation')) state.chatState = 'CONFIRMATION';
            });
        },

        // Called by page component after interactive components onSubmit
        handleInteractionSubmit: (messageId, data) => {
            console.log("Store: handleInteractionSubmit called with data:", data);

            set((state) => {
                // Get the message to determine the prompt key
                const messageIndex = state.messages.findIndex((m) => m.id === messageId);
                if (messageIndex === -1) {
                    console.warn("Message not found for ID:", messageId);
                    return state;
                }

                const message = state.messages[messageIndex];
                const promptKey = message.interactiveComponentData?.promptKey;

                if (!promptKey) {
                    console.warn("No promptKey found in message:", messageId);
                    return state;
                }

                console.log(`Updating store with ${promptKey} data:`, data[promptKey]);

                // Handle different prompt types
                if (promptKey === "colorPalette" && data.colorPalette) {
                    state.projectBrief.colorPalette = data.colorPalette;
                    console.log("Updated colorPalette in store:", state.projectBrief.colorPalette);
                }
                else if (promptKey === "fontPairing") {
                    // Extract data directly from the submitted data
                    const fontId = data.fontId;
                    const customPairingData = data.customPairing; // Renamed for clarity

                    if (fontId === "custom" && customPairingData) {
                        // Use the custom font pairing details directly
                        const customHeadingFont = customPairingData.headingFont || "Montserrat";
                        const customBodyFont = customPairingData.bodyFont || "Open Sans";

                        // Save the complete custom pairing to the main brief state
                        state.projectBrief.fontPairing = {
                            id: "custom",
                            headingFont: customHeadingFont,
                            bodyFont: customBodyFont,
                            headingClass: "font-custom", // Keep generic class
                            bodyClass: "font-custom",  // Keep generic class
                        };

                        // *** Crucial Fix: Update the message's component data for read-only display ***
                        if (message.interactiveComponentData?.props) {
                            message.interactiveComponentData.props.currentFontId = "custom";
                            // Store the actual selected custom fonts directly in props
                            message.interactiveComponentData.props.customPairingDetails = {
                                headingFont: customHeadingFont,
                                bodyFont: customBodyFont,
                            };
                        }

                        console.log("Updated fontPairing with custom fonts in store:", state.projectBrief.fontPairing);
                    } else if (fontId) {
                        // Find the full font details from the original message options
                        const options = message.interactiveComponentData?.props?.options || [];
                        const selectedFont = options.find((opt: FontPairingOption) => opt.id === fontId);

                        if (selectedFont) {
                            // Use the full font details for the main brief state
                            state.projectBrief.fontPairing = {
                                id: fontId,
                                headingFont: selectedFont.headingFont,
                                bodyFont: selectedFont.bodyFont,
                                headingClass: selectedFont.headingClass,
                                bodyClass: selectedFont.bodyClass,
                            };

                            // Update the message's component data for read-only display
                            if (message.interactiveComponentData?.props) {
                                message.interactiveComponentData.props.currentFontId = fontId;
                                // Clear any previous custom details if switching back
                                delete message.interactiveComponentData.props.customPairingDetails;
                            }

                            console.log("Updated fontPairing in store:", state.projectBrief.fontPairing);
                        } else {
                            // Fallback if font details not found (should be rare)
                            state.projectBrief.fontPairing = { id: fontId };
                            if (message.interactiveComponentData?.props) {
                                message.interactiveComponentData.props.currentFontId = fontId;
                                delete message.interactiveComponentData.props.customPairingDetails;
                            }
                            console.warn("Font details not found for ID:", fontId);
                        }
                    }
                }
                else if (promptKey === "structure" && data.structure) {
                    if (Array.isArray(data.structure)) {
                        console.log("STORE: Updating structure with:", data.structure);

                        // Create a deep copy to ensure reactivity
                        const structureCopy = JSON.parse(JSON.stringify(data.structure));

                        // 1. Update the main store
                        state.projectBrief.structure = structureCopy;

                        // 2. CRUCIAL FIX: Also update the message's component data
                        if (message.interactiveComponentData?.props) {
                            message.interactiveComponentData.props.initialStructure = structureCopy;
                        }

                        console.log("STORE: Structure updated, now has", structureCopy.length, "top-level items");
                        console.log("STORE: Updated structure:", state.projectBrief.structure);

                        // 3. VALIDATION: Make sure the structure is actually in the store
                        if (!state.projectBrief.structure || state.projectBrief.structure.length === 0) {
                            console.error("STORE: Structure is empty after update! Forcing fallback structure.");
                            // Force a minimal fallback structure if somehow the update failed
                            state.projectBrief.structure = [
                                {
                                    id: uuidv4(),
                                    type: "page",
                                    name: "Home",
                                    children: [
                                        { id: uuidv4(), type: "section", name: "Hero Section", children: [] }
                                    ]
                                }
                            ];
                        }
                    } else {
                        console.warn("Invalid structure data format:", data.structure);
                    }
                }
                else if (promptKey === "primaryGoal" && data.primaryGoal) {
                    state.projectBrief.purpose = data.primaryGoal;
                }

                // Mark message as processed (preserving component data for display)
                if (messageIndex !== -1) {
                    state.messages[messageIndex].interactionProcessed = true;
                    console.log("STORE: Marked message as processed with id:", messageId);
                    console.log("STORE: InteractionProcessed =", state.messages[messageIndex].interactionProcessed);
                    console.log("STORE: Component data preserved =", !!state.messages[messageIndex].interactiveComponentData);
                }

                return state;
            });
        },

        triggerWebsiteGeneration: async () => { /* ... no change needed here based on error ... */ },

    }))
);