import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

export type PCMessage = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    options?: {
        text: string;
        value: string;
        isMultiSelect: boolean;
    }[];
    hidden?: boolean;
    isLoading?: boolean;
    interactiveComponent?: {
        type: string;
        props: any;
        promptKey: string;
    };
    interactionProcessed?: boolean;
};

export type PCColorPalette = {
    id: string;
    name: string;
    colors: string[];
};

export type PCFontPairing = {
    id: string;
    name: string;
    headingFont: string;
    bodyFont: string;
    headingClass: string;
    bodyClass: string;
};

export type PCDesignStyle = {
    id: string;
    name: string;
    description: string;
    icon: string;
    keyElements: string[];
};

export type PCUploadedAsset = {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document' | 'reference';
    label?: string;
    description?: string;
};

export type PCProjectBrief = {
    siteName: string;
    purpose: string;
    targetAudience: string;
    designStyle: string;
    colorPalette: PCColorPalette;
    fontPairing: PCFontPairing;
    contentReferences: string[];
    assets: PCUploadedAsset[];
    webStructure?: any;
    progress: number;
    designNotes?: string;
    contentNotes?: string;
};

export interface PCChatState {
    messages: PCMessage[];
    projectBrief: PCProjectBrief;
    isLoading: boolean;
    chatState: 'INTRODUCTION' | 'GATHERING_PURPOSE' | 'DEFINING_STYLE' | 'CONTENT_PLANNING' | 'REFINEMENT' | 'CONFIRMATION' | 'GENERATING' | 'COMPLETE';
    error: string | null;
    sessionId: string;

    // Actions
    initChat: (siteName: string) => void;
    addMessage: (message: PCMessage) => void;
    resetMessages: () => void;
    sendMessage: (content: string) => Promise<void>;
    processOption: (option: string) => Promise<void>;
    updateProjectBrief: (updates: Partial<PCProjectBrief>) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setChatState: (state: PCChatState['chatState']) => void;
    updateMessage: (id: string, updates: Partial<PCMessage>) => void;
    processInteractiveComponent: (messageId: string, data: any) => Promise<void>;
    triggerWebsiteGeneration: () => Promise<void>;
    addAsset: (asset: PCUploadedAsset) => void;
    removeAsset: (assetId: string) => void;
    addContentReference: (reference: string) => void;
    removeContentReference: (index: number) => void;
    saveChatState: (userId: string, websiteId: string) => Promise<void>;
}

// Default values
const defaultColorPalette: PCColorPalette = {
    id: 'default',
    name: 'Default',
    colors: ['#4F46E5', '#10B981', '#F59E0B', '#6366F1', '#FFFFFF', '#111827']
};

const defaultFontPairing: PCFontPairing = {
    id: 'modern',
    name: 'Modern & Clean',
    headingFont: 'Inter',
    bodyFont: 'Roboto',
    headingClass: 'font-sans',
    bodyClass: 'font-sans'
};

const initialProjectBrief: PCProjectBrief = {
    siteName: 'My Awesome Site',
    purpose: '',
    targetAudience: '',
    designStyle: 'minimalist',
    colorPalette: { ...defaultColorPalette },
    fontPairing: { ...defaultFontPairing },
    contentReferences: [],
    assets: [],
    progress: 10,
    designNotes: '',
    contentNotes: '',
    webStructure: null
};

// Helper function to ensure proper object serialization
function ensureProperSerialization<T>(obj: T): T {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        console.error('Serialization error:', e);
        return obj;
    }
}

// Helper function to create a safe copy of project brief
function createSafeProjectBrief(brief: Partial<PCProjectBrief>): PCProjectBrief {
    return {
        siteName: brief.siteName || "",
        purpose: brief.purpose || "",
        targetAudience: brief.targetAudience || "",
        designStyle: typeof brief.designStyle === 'string' ? brief.designStyle :
            brief.designStyle ? ensureProperSerialization(brief.designStyle) : "minimalist",
        colorPalette: brief.colorPalette ? ensureProperSerialization(brief.colorPalette) : defaultColorPalette,
        fontPairing: brief.fontPairing ? ensureProperSerialization(brief.fontPairing) : defaultFontPairing,
        contentReferences: Array.isArray(brief.contentReferences) ? [...brief.contentReferences] : [],
        assets: Array.isArray(brief.assets) ? brief.assets.map(asset => ({ ...asset })) : [],
        webStructure: brief.webStructure ? ensureProperSerialization(brief.webStructure) : null,
        progress: typeof brief.progress === 'number' ? brief.progress : 0,
        designNotes: brief.designNotes || "",
        contentNotes: brief.contentNotes || ""
    };
}

export const useProChatStore = create(
    immer<PCChatState>((set, get) => ({
        messages: [
            {
                id: "welcome-message",
                role: "assistant",
                content:
                    "👋 Welcome to Pro Chat! I'm your AI design partner, here to help you create your perfect website. Let's start with understanding your vision and goals.",
                timestamp: new Date(),
                options: [
                    {
                        text: "I need a business website",
                        value: "I need a business website",
                        isMultiSelect: false,
                    },
                    {
                        text: "I want a personal portfolio",
                        value: "I want a personal portfolio",
                        isMultiSelect: false,
                    },
                    {
                        text: "I need an e-commerce store",
                        value: "I need an e-commerce store",
                        isMultiSelect: false,
                    },
                    {
                        text: "I'd like to explore options",
                        value:
                            "Can you tell me about the different types of websites you can create?",
                        isMultiSelect: false,
                    },
                ],
            }
        ],
        projectBrief: initialProjectBrief,
        isLoading: false,
        chatState: 'INTRODUCTION',
        error: null,
        sessionId: uuidv4(),

        initChat: (siteName: string) => {
            set((state) => {
                const newBrief = { ...initialProjectBrief, siteName: siteName || 'My Awesome Site' };
                state.projectBrief = newBrief;
                state.messages = [{
                    id: uuidv4(),
                    role: 'assistant',
                    content: `👋 Welcome to Pro Chat! I'm your AI design partner, here to help you create your perfect website for **${siteName || 'your project'}**. Let's start with understanding your vision and goals.`,
                    timestamp: new Date(),
                    options: [
                        {
                            text: "I need a business website",
                            value: "I need a business website",
                            isMultiSelect: false,
                        },
                        {
                            text: "I want a personal portfolio",
                            value: "I want a personal portfolio",
                            isMultiSelect: false,
                        },
                        {
                            text: "I need an e-commerce store",
                            value: "I need an e-commerce store",
                            isMultiSelect: false,
                        },
                        {
                            text: "I'd like to explore options",
                            value: "Can you tell me about the different types of websites you can create?",
                            isMultiSelect: false,
                        },
                    ]
                }];
                state.chatState = 'INTRODUCTION';
                state.isLoading = false;
                state.error = null;
                state.sessionId = uuidv4();
            });
        },

        addMessage: (message) => {
            set((state) => {
                state.messages.push(message);
                // Keep last 50 messages at most
                if (state.messages.length > 50) {
                    state.messages.shift();
                }
            });
        },

        resetMessages: () => {
            set((state) => {
                state.messages = [];
            });
        },

        sendMessage: async (content) => {
            if (!content.trim()) return;

            // Add user message
            const userMessageId = uuidv4();
            const userMessage: PCMessage = {
                id: userMessageId,
                role: 'user',
                content: content.trim(),
                timestamp: new Date()
            };

            set((state) => {
                state.messages.push(userMessage);
                state.isLoading = true;
                state.error = null;
            });

            try {
                const currentMessages = get().messages;
                const currentProjectBrief = get().projectBrief;

                // Add temporary loading message
                const loadingMessageId = uuidv4();
                set((state) => {
                    state.messages.push({
                        id: loadingMessageId,
                        role: 'assistant',
                        content: '',
                        timestamp: new Date(),
                        isLoading: true
                    });
                });

                // Call API
                const response = await fetch('/api/pro-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: currentMessages,
                        projectBrief: currentProjectBrief
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `API Error: ${response.statusText}`);
                }

                const data = await response.json();

                // Remove loading message
                set((state) => {
                    state.messages = state.messages.filter(m => m.id !== loadingMessageId);
                    state.isLoading = false;
                });

                // Process any project brief updates if available
                if (data.briefUpdates) {
                    console.log('Received brief updates:', data.briefUpdates);
                    set((state) => {
                        // Update the purpose if provided
                        if (data.briefUpdates.purpose) {
                            state.projectBrief.purpose = data.briefUpdates.purpose;
                        }

                        // Update the target audience if provided
                        if (data.briefUpdates.targetAudience) {
                            state.projectBrief.targetAudience = data.briefUpdates.targetAudience;
                        }

                        // Store any design or content notes in a new field
                        if (data.briefUpdates.designNotes) {
                            state.projectBrief.designNotes = data.briefUpdates.designNotes;
                        }

                        if (data.briefUpdates.contentNotes) {
                            state.projectBrief.contentNotes = data.briefUpdates.contentNotes;
                        }
                    });
                }

                // Process response
                const assistantMessage: PCMessage = {
                    id: uuidv4(),
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date(),
                    options: Array.isArray(data.options) ? data.options.map((option: string) => ({
                        text: option,
                        value: option,
                        isMultiSelect: false
                    })) : [],
                    interactiveComponent: data.interactiveComponent || null
                };

                set((state) => {
                    state.messages.push(assistantMessage);

                    // Update chat state based on content
                    const content = data.response.toLowerCase();
                    const userContent = userMessage.content.toLowerCase();

                    if (state.chatState === 'INTRODUCTION' && content.includes('purpose')) {
                        state.chatState = 'GATHERING_PURPOSE';
                        state.projectBrief.progress = 20;
                    } else if (state.chatState === 'GATHERING_PURPOSE' &&
                        (content.includes('style') || content.includes('design'))) {
                        state.chatState = 'DEFINING_STYLE';
                        state.projectBrief.progress = 40;
                    } else if (state.chatState === 'DEFINING_STYLE' &&
                        (content.includes('content') || content.includes('pages'))) {
                        state.chatState = 'CONTENT_PLANNING';
                        state.projectBrief.progress = 60;
                    } else if (state.chatState === 'CONTENT_PLANNING' &&
                        (content.includes('refine') || content.includes('details'))) {
                        state.chatState = 'REFINEMENT';
                        state.projectBrief.progress = 80;
                    } else if (content.includes('ready to generate') ||
                        content.includes('final confirmation')) {
                        state.chatState = 'CONFIRMATION';
                        state.projectBrief.progress = 90;
                    }

                    // Process any updates to the project brief based on the response and user message
                    // Detect purpose information
                    if (content.includes('business') && state.chatState === 'GATHERING_PURPOSE') {
                        state.projectBrief.purpose = 'Business';
                    } else if (content.includes('portfolio') && state.chatState === 'GATHERING_PURPOSE') {
                        state.projectBrief.purpose = 'Portfolio';
                    } else if (content.includes('e-commerce') && state.chatState === 'GATHERING_PURPOSE') {
                        state.projectBrief.purpose = 'E-commerce';
                    }

                    // More sophisticated target audience detection
                    // Check both the AI response and the user's message
                    if ((content.includes('audience') || content.includes('target')) &&
                        state.projectBrief.targetAudience === '') {
                        // Extract potential audience from user's message
                        // Look for patterns like "my audience is X" or "targeting X"
                        const targetPattern = /target(?:ed|ing)?\s+(?:audience|users|customers|market|demographic)?\s*(?:is|are|:)?\s*([^.!?]+)/i;
                        const audiencePattern = /(?:my|our|the)\s+(?:target\s+)?audience\s+(?:is|are|:)?\s*([^.!?]+)/i;
                        const forPattern = /(?:website|site|page)\s+for\s+([^.!?]+)/i;

                        let audienceMatch = userContent.match(targetPattern) ||
                            userContent.match(audiencePattern) ||
                            userContent.match(forPattern);

                        if (audienceMatch && audienceMatch[1]) {
                            const audience = audienceMatch[1].trim();
                            if (audience.length > 3 && !audience.includes('http')) {
                                state.projectBrief.targetAudience = audience;
                            }
                        }

                        // If we couldn't extract from patterns, try to use the whole message if it's 
                        // a direct response to an audience question
                        if (state.projectBrief.targetAudience === '' &&
                            (content.includes('who is your target audience') ||
                                content.includes('who are you targeting'))) {
                            if (userContent.length < 150 && userContent.length > 5) {
                                state.projectBrief.targetAudience = userMessage.content;
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error sending message:', error);

                set((state) => {
                    // Remove any loading messages
                    state.messages = state.messages.filter(m => !m.isLoading);

                    // Add error message
                    state.messages.push({
                        id: uuidv4(),
                        role: 'system',
                        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
                        timestamp: new Date()
                    });

                    state.isLoading = false;
                    state.error = error instanceof Error ? error.message : 'Unknown error';
                });
            }
        },

        processOption: async (optionValue) => {
            // Simulate user selecting an option
            await get().sendMessage(optionValue);
        },

        updateProjectBrief: (updates) => {
            set((state) => {
                try {
                    // Create a safe copy of the current brief
                    const currentBrief = createSafeProjectBrief(state.projectBrief);

                    // Create a safe copy of the updates
                    const safeUpdates = createSafeProjectBrief({
                        ...currentBrief,
                        ...updates
                    });

                    // Verify the result can be properly serialized
                    const test = JSON.stringify(safeUpdates);
                    JSON.parse(test); // This will throw if there's an issue

                    // Update the state with the safe copy
                    state.projectBrief = safeUpdates;
                } catch (e) {
                    console.error('Error updating project brief:', e);
                    // Keep the current state if there's an error
                }
            });
        },

        setIsLoading: (loading) => set((state) => { state.isLoading = loading }),
        setError: (error) => set((state) => { state.error = error }),
        setChatState: (chatState) => set((state) => { state.chatState = chatState }),

        updateMessage: (id, updates) => {
            set((state) => {
                const messageIndex = state.messages.findIndex(m => m.id === id);
                if (messageIndex !== -1) {
                    state.messages[messageIndex] = {
                        ...state.messages[messageIndex],
                        ...updates
                    };
                }
            });
        },

        processInteractiveComponent: async (messageId, data) => {
            // Find the message with the interactive component
            const message = get().messages.find(m => m.id === messageId);

            if (!message || !message.interactiveComponent) {
                console.error('No interactive component found for message:', messageId);
                return;
            }

            const { promptKey, type } = message.interactiveComponent;

            // Update the message to mark the interaction as processed
            set((state) => {
                const messageIndex = state.messages.findIndex(m => m.id === messageId);
                if (messageIndex !== -1) {
                    state.messages[messageIndex].interactionProcessed = true;
                }
            });

            // Prepare detailed confirmation message based on component type
            let selectedItem;
            let confirmationText = '';

            // Update project brief based on component type
            if (promptKey === 'colorPalette') {
                selectedItem = data.colorPalette;
                set((state) => {
                    state.projectBrief.colorPalette = data.colorPalette;
                });
                confirmationText = `I've selected the "${selectedItem.name}" color palette with colors: ${selectedItem.colors.join(', ')}`;
            } else if (promptKey === 'fontPairing') {
                selectedItem = data.fontPairing;
                set((state) => {
                    state.projectBrief.fontPairing = data.fontPairing;
                });
                confirmationText = `I've selected the "${selectedItem.name}" font pairing with ${selectedItem.headingFont} for headings and ${selectedItem.bodyFont} for body text`;
            } else if (promptKey === 'designStyle') {
                selectedItem = data.designStyle;
                set((state) => {
                    state.projectBrief.designStyle = data.designStyle;
                });
                confirmationText = `I've selected the "${selectedItem.name}" design style - ${selectedItem.description}`;
            } else if (promptKey === 'webStructure') {
                selectedItem = data.webStructure;
                set((state) => {
                    state.projectBrief.webStructure = data.webStructure;
                });
                confirmationText = `I've selected the "${selectedItem.name}" website structure with ${selectedItem.pages.length} pages`;
            } else {
                // Generic confirmation for other component types
                confirmationText = `I've updated my ${promptKey} preference`;
            }

            // Add the confirmation as a user message
            const userConfirmation: PCMessage = {
                id: uuidv4(),
                role: 'user',
                content: confirmationText,
                timestamp: new Date(),
            };

            set((state) => {
                state.messages.push(userConfirmation);
            });

            // Send the confirmation to get an AI response
            // Use sendMessage directly with a flag to indicate it's a follow-up
            // to avoid generating a duplicate user message
            try {
                // Add loading indicator
                const loadingMessageId = uuidv4();
                set((state) => {
                    state.isLoading = true;
                    state.messages.push({
                        id: loadingMessageId,
                        role: 'assistant',
                        content: '',
                        timestamp: new Date(),
                        isLoading: true
                    });
                });

                // Call API directly without creating another user message
                const currentMessages = get().messages;
                const currentProjectBrief = get().projectBrief;

                const response = await fetch('/api/pro-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: currentMessages,
                        projectBrief: currentProjectBrief
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `API Error: ${response.statusText}`);
                }

                const data = await response.json();

                // Remove loading message
                set((state) => {
                    state.messages = state.messages.filter(m => m.id !== loadingMessageId);
                    state.isLoading = false;
                });

                // Process any project brief updates
                if (data.briefUpdates) {
                    console.log('Received brief updates:', data.briefUpdates);
                    set((state) => {
                        // Update relevant fields if provided
                        if (data.briefUpdates.purpose) {
                            state.projectBrief.purpose = data.briefUpdates.purpose;
                        }
                        if (data.briefUpdates.targetAudience) {
                            state.projectBrief.targetAudience = data.briefUpdates.targetAudience;
                        }
                        if (data.briefUpdates.designNotes) {
                            state.projectBrief.designNotes = data.briefUpdates.designNotes;
                        }
                        if (data.briefUpdates.contentNotes) {
                            state.projectBrief.contentNotes = data.briefUpdates.contentNotes;
                        }
                        if (data.briefUpdates.webStructure) {
                            state.projectBrief.webStructure = data.briefUpdates.webStructure;
                        }
                    });
                }

                // Add AI response
                const assistantMessage: PCMessage = {
                    id: uuidv4(),
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date(),
                    options: Array.isArray(data.options) ? data.options.map((option: string) => ({
                        text: option,
                        value: option,
                        isMultiSelect: false
                    })) : [],
                    interactiveComponent: data.interactiveComponent || null
                };

                set((state) => {
                    state.messages.push(assistantMessage);
                });
            } catch (error) {
                console.error('Error processing interaction:', error);
                set((state) => {
                    state.isLoading = false;
                    state.error = error instanceof Error ? error.message : 'Unknown error';

                    // Add error message
                    state.messages.push({
                        id: uuidv4(),
                        role: 'system',
                        content: `Error: ${error instanceof Error ? error.message : 'Failed to process selection'}`,
                        timestamp: new Date()
                    });
                });
            }
        },

        triggerWebsiteGeneration: async () => {
            set((state) => {
                state.chatState = 'GENERATING';
                state.projectBrief.progress = 95;

                // Add a system message indicating generation has started
                state.messages.push({
                    id: uuidv4(),
                    role: 'system',
                    content: '🚀 Starting website generation. This may take a few minutes...',
                    timestamp: new Date()
                });

                state.isLoading = true;
            });

            try {
                // Simulate API call for website generation
                // In a real implementation, this would call the actual generation endpoint
                await new Promise(resolve => setTimeout(resolve, 5000));

                set((state) => {
                    state.projectBrief.progress = 100;
                    state.chatState = 'COMPLETE';
                    state.isLoading = false;

                    // Add completion message
                    state.messages.push({
                        id: uuidv4(),
                        role: 'system',
                        content: '✅ Website generation complete! Your site is now ready to view and edit.',
                        timestamp: new Date()
                    });
                });

                return Promise.resolve();
            } catch (error) {
                console.error('Error generating website:', error);

                set((state) => {
                    state.isLoading = false;
                    state.error = error instanceof Error ? error.message : 'Failed to generate website';

                    // Add error message
                    state.messages.push({
                        id: uuidv4(),
                        role: 'system',
                        content: `❌ Error generating website: ${state.error}`,
                        timestamp: new Date()
                    });
                });

                return Promise.reject(error);
            }
        },

        // Asset management
        addAsset: (asset) => {
            set((state) => {
                state.projectBrief.assets.push(asset);
            });
        },

        removeAsset: (assetId) => {
            set((state) => {
                state.projectBrief.assets = state.projectBrief.assets.filter(
                    (asset) => asset.id !== assetId
                );
            });
        },

        // Content reference management
        addContentReference: (reference) => {
            set((state) => {
                state.projectBrief.contentReferences.push(reference);
            });
        },

        removeContentReference: (index) => {
            set((state) => {
                state.projectBrief.contentReferences = state.projectBrief.contentReferences.filter(
                    (_, i) => i !== index
                );
            });
        },

        saveChatState: async (userId: string, websiteId: string) => {
            try {
                if (!userId || !websiteId) {
                    console.error("Missing userId or websiteId for saving chat state");
                    return;
                }

                const state = get();

                // Create safe serializable copies of the data
                const safeMessages = state.messages.map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
                    options: msg.options || [],
                    hidden: msg.hidden || false,
                    interactiveComponent: msg.interactiveComponent ? ensureProperSerialization(msg.interactiveComponent) : null,
                    interactionProcessed: msg.interactionProcessed || false
                }));

                // Create a safe copy of the project brief
                const safeProjectBrief = createSafeProjectBrief(state.projectBrief);

                // Verify the data is valid JSON before sending
                const payload = {
                    userId,
                    websiteId,
                    messages: safeMessages,
                    projectBrief: safeProjectBrief,
                    chatState: state.chatState
                };

                // Final verification of the entire payload
                const test = JSON.stringify(payload);
                JSON.parse(test); // This will throw if there's an issue

                // Make API call to save chat state
                const response = await fetch('/api/save-pro-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: test, // Use the verified JSON string
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Invalid JSON response' }));
                    throw new Error(errorData.message || 'Failed to save chat state');
                }

                console.log('Pro Chat state saved successfully');
            } catch (error) {
                console.error('Error saving Pro Chat state:', error);
                set(state => {
                    state.error = error instanceof Error ? error.message : 'Failed to save chat state';
                });
                throw error;
            }
        }
    }))
); 