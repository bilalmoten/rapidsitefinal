// types/advanced-chat.ts

import { ComponentType } from 'react';

// Represents a single message in the chat history
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    isTyping?: boolean; // For assistant's loading indicator
    interactiveComponentData?: InteractiveComponentData | null; // Holds data for interactive UI
    interactionProcessed?: boolean; // Flag to prevent re-processing interaction
}

// Data structure for interactive components sent by the AI
export interface InteractiveComponentData {
    type: keyof typeof InteractionComponentsMap; // Type name matching the component map key
    props: any; // Props specific to the component type (e.g., options for ColorPaletteEditor)
    promptKey: string; // Key used to update the ProjectBrief state upon submission
}

// Represents a node in the website structure (page or section)
export interface SiteNode {
    id: string;
    type: 'page' | 'section';
    name: string; // User-editable name (e.g., "Home", "About Us", "Services Section")
    children?: SiteNode[]; // Nested sections or sub-pages (keep flat for initial version?)
}

// Define option types first for clarity
export interface ColorPaletteOption {
    id: string;
    name: string;
    colors: string[];
}

export interface FontPairingOption {
    id: string;
    name: string;
    headingFont: string; // Google Font name or system font stack
    bodyFont: string;   // Google Font name or system font stack
    headingClass?: string; // Optional: Utility class if needed directly
    bodyClass?: string;   // Optional: Utility class if needed directly
}

export interface DesignStyleOption {
    id: string;
    name: string;
    description: string;
    icon: string; // Or React.ReactNode
}

export interface MultipleChoiceOption {
    text: string;
    value: string;
}

// Represents the structured information gathered about the website project
export interface ProjectBrief {
    siteName: string; // From initial step before chat
    purpose: string;
    targetAudience: string;
    designStyle: string; // Changed to simple string (maps to DesignStyleOption['id'])
    colorPalette: {
        id?: string; // Optional ID if predefined
        name?: string; // Optional name
        colors: string[]; // Array of hex codes
    };
    fontPairing: { // Store details needed by preview
        id: string; // Changed to simple string (maps to FontPairingOption['id'])
        headingFont?: string;
        bodyFont?: string;
        headingClass?: string; // Added optional property
        bodyClass?: string;   // Added optional property
    };
    structure: SiteNode[]; // Tree structure for pages/sections
    keyContentSnippets: Record<string, string>; // e.g., { aboutUs: "...", heroHeadline: "..." }
    inspirationUrls: string[];
    inspirationImages: { name: string; url: string }[]; // Store name and URL (maybe data URL initially)
    // Add other relevant fields as needed
}


// Props for individual interactive components
export interface InteractionProps<T = any> {
    onSubmit: (data: T) => void; // Callback with selected/edited data
}

export interface ColorPaletteEditorProps extends InteractionProps<{ colors: string[], id?: string, name?: string }> {
    initialPalette?: { colors: string[], id?: string, name?: string }; // Current/suggested palette
    options?: ColorPaletteOption[]; // Predefined palettes to choose from
}

export interface FontPairSelectorProps extends InteractionProps<{ fontId: string, customPairing?: FontPairingOption }> {
    options: FontPairingOption[];
    currentFontId: string;
    readOnly?: boolean; // Whether to show in read-only mode
}

export interface SiteStructureEditorProps extends InteractionProps<{ structure: SiteNode[] }> {
    initialStructure: SiteNode[];
    readOnly?: boolean; // Whether to show in read-only mode (for displaying finalized selections)
}

export interface SampleSectionPreviewProps { // This might not need an onSubmit, just displays
    projectBrief: Pick<ProjectBrief, 'colorPalette' | 'fontPairing' | 'designStyle'>;
    // Pass full options if needed for lookups within preview itself
    availablePalettes: ColorPaletteOption[];
    availableFontPairings: FontPairingOption[];
}

export interface MultipleChoiceProps extends InteractionProps<{ value: string }> {
    question: string;
    options: MultipleChoiceOption[];
}

// Map component type names to actual components (defined later)
// We declare the type here for use in the store and MessageDisplay
export type InteractionComponentTypeMap = Record<string, ComponentType<any>>;

// Need to declare the map before referencing its keys in InteractiveComponentData
// Will be populated in index.ts, but need the type structure here.
export declare const InteractionComponentsMap: InteractionComponentTypeMap;


// Defines the state structure for the Zustand store
export interface AdvancedChatState {
    messages: ChatMessage[];
    projectBrief: ProjectBrief;
    isLoading: boolean;
    chatState: 'INTRODUCTION' | 'GATHERING_PURPOSE' | 'DEFINING_STYLE' | 'STRUCTURE_CONTENT' | 'REFINEMENT' | 'CONFIRMATION' | 'GENERATING' | 'ERROR';
    error: string | null;
    sessionId: string; // Unique ID for this chat session
    // Consider adding available options to the store if needed by handlers
    // availablePalettes: ColorPaletteOption[];
    // availableFontPairings: FontPairingOption[];

    // Actions
    addMessage: (message: ChatMessage) => void;
    updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
    setMessages: (messages: ChatMessage[]) => void;
    setProjectBrief: (brief: ProjectBrief) => void;
    updateProjectBrief: (updates: Partial<ProjectBrief>) => void;
    setIsLoading: (loading: boolean) => void;
    setChatState: (state: AdvancedChatState['chatState']) => void;
    setError: (error: string | null) => void;
    processAssistantResponse: (response: { text: string; interactiveData?: InteractiveComponentData | null }) => void;
    // Define the structure of the data argument more explicitly if possible
    handleInteractionSubmit: (messageId: string, data: any) => void;
    initChat: (siteName: string) => void;
    triggerWebsiteGeneration: () => Promise<void>;
}