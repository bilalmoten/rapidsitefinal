// app/dashboard/advanced-chat/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // Use Suspense for searchParams
import { useAdvancedChatStore } from "@/hooks/useAdvancedChatStore";
import ChatInterface from "@/components/advanced-chat/ChatInterface";
import ProjectSummarySidebar from "@/components/advanced-chat/ProjectSummarySidebar";
import { Button } from "@/components/ui/button";
import { PanelRight, PanelLeftClose } from "lucide-react";
import { Toaster } from "@/components/ui/toaster"; // Make sure you have a Toaster setup

// Wrapper component to handle Suspense for useSearchParams
const AdvancedChatPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const siteNameParam = searchParams?.get("siteName"); // Get siteName from URL query param

  const initChat = useAdvancedChatStore((state) => state.initChat);
  const messages = useAdvancedChatStore((state) => state.messages);
  const projectBrief = useAdvancedChatStore((state) => state.projectBrief);
  const isLoading = useAdvancedChatStore((state) => state.isLoading);
  const chatState = useAdvancedChatStore((state) => state.chatState);
  const error = useAdvancedChatStore((state) => state.error);
  const sessionId = useAdvancedChatStore((state) => state.sessionId);
  const addMessage = useAdvancedChatStore((state) => state.addMessage);
  const setIsLoading = useAdvancedChatStore((state) => state.setIsLoading);
  const setError = useAdvancedChatStore((state) => state.setError);
  const processAssistantResponse = useAdvancedChatStore(
    (state) => state.processAssistantResponse
  );
  const handleInteractionSubmitStore = useAdvancedChatStore(
    (state) => state.handleInteractionSubmit
  );
  const triggerWebsiteGeneration = useAdvancedChatStore(
    (state) => state.triggerWebsiteGeneration
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMode, setIsMobileMode] = useState(false);

  // Initialize chat when component mounts or siteName changes
  useEffect(() => {
    const siteName = siteNameParam || "Untitled Project";
    console.log("Initializing chat for site:", siteName);
    initChat(siteName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteNameParam]); // Dependency array includes siteNameParam

  // Mobile detection effect
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // Adjust breakpoint for sidebar visibility
      setIsMobileMode(mobile);
      if (mobile) {
        setIsSidebarOpen(false); // Close sidebar on mobile by default
      } else {
        setIsSidebarOpen(true); // Open sidebar on desktop by default
      }
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handler for interactive component submissions (updates store AND sends confirmation)
  const handleInteractionSubmit = async (messageId: string, data: any) => {
    console.log(
      "DEBUG [handleInteractionSubmit] START - Called with:",
      messageId,
      data
    );

    try {
      // 1. Update the store (this handles projectBrief update)
      handleInteractionSubmitStore(messageId, data);
      console.log("DEBUG [handleInteractionSubmit] Store updated successfully");

      // 2. Determine confirmation text (logic similar to store, maybe refactor to a util?)
      const originalMessage = useAdvancedChatStore
        .getState()
        .messages.find((m) => m.id === messageId);

      console.log(
        "DEBUG [handleInteractionSubmit] Original message found:",
        !!originalMessage
      );
      console.log(
        "DEBUG [handleInteractionSubmit] Has interactiveComponentData:",
        !!originalMessage?.interactiveComponentData
      );

      if (!originalMessage || !originalMessage.interactiveComponentData) {
        console.error(
          "DEBUG [handleInteractionSubmit] ERROR: Original message or interactiveComponentData not found!",
          messageId
        );
        return;
      }

      const { promptKey, type, props } =
        originalMessage.interactiveComponentData;
      console.log("DEBUG [handleInteractionSubmit] PromptKey:", promptKey);

      // *** Get the actual submitted data using the promptKey ***
      const submittedData = data[promptKey];
      console.log(
        "DEBUG [handleInteractionSubmit] Submitted data:",
        submittedData
      );

      // Create the user message content - both human-readable and with JSON data for the AI
      let confirmationText = `Okay, I've processed the selection for ${promptKey}.`; // Default generic message
      let jsonDataForContext = JSON.stringify(submittedData);

      // Create more descriptive confirmation text based on data...
      try {
        if (promptKey === "colorPalette") {
          // Submitted data could be { colors: [], id?, name? } or just { colors: [] }
          const palette = submittedData;
          if (palette && palette.colors && palette.colors.length > 0) {
            if (palette.name) {
              confirmationText = `I've selected the '${palette.name}' color palette.`;
            } else {
              confirmationText = `Okay, I've updated the color palette with ${palette.colors.length} colors.`;
            }
          } else if (palette && Array.isArray(palette) && palette.length > 0) {
            // case where only colors array submitted
            confirmationText = `Okay, I've updated the color palette with ${palette.length} colors.`;
          }
        } else if (promptKey === "fontPairing") {
          const fontId = submittedData?.fontId;
          if (fontId) {
            // Find the *name* from the original options for better confirmation text
            const fontOptions =
              originalMessage?.interactiveComponentData?.props?.options || [];
            const selectedFontOption = fontOptions.find(
              (opt: any) => opt.id === fontId
            );

            if (selectedFontOption) {
              confirmationText = `I've selected the "${selectedFontOption.name}" font pairing.`; // Keep it simpler
            } else {
              // Fallback if option not found in original message (should be rare)
              confirmationText = `I've selected the font pairing with ID: ${fontId}.`;
            }
          }
        } else if (promptKey === "structure") {
          const updatedStructure = submittedData; // submittedData should be SiteNode[]
          if (
            updatedStructure &&
            Array.isArray(updatedStructure) &&
            updatedStructure.length > 0
          ) {
            // First, create a deep copy to ensure reactivity
            const structureCopy = JSON.parse(JSON.stringify(updatedStructure));

            console.log(
              "DEBUG [handleInteractionSubmit]: About to update structure in store:",
              JSON.stringify(structureCopy, null, 2)
            );

            // Force update the state to ensure immediate UI refresh with explicit typing
            useAdvancedChatStore.setState((state) => {
              // Deep clone to ensure new reference that will trigger reactivity
              state.projectBrief.structure = structureCopy;
              console.log(
                "DEBUG [handleInteractionSubmit]: Structure updated in store, new structure has",
                structureCopy.length,
                "top-level items"
              );
              return state;
            });

            // Double-check the structure was updated
            const currentStructure =
              useAdvancedChatStore.getState().projectBrief.structure;
            console.log(
              "DEBUG [handleInteractionSubmit]: Structure update verification:",
              "Current structure has",
              currentStructure.length,
              "top-level items",
              "First page:",
              currentStructure[0]?.name || "unnamed"
            );

            // Generate textual representation for the AI
            const structureText = generateStructureText(updatedStructure);
            confirmationText = `I've updated the website structure.`;

            // For better verification, log the structure again
            console.log(
              "DEBUG [handleInteractionSubmit]: Structure text representation:\n",
              structureText
            );

            // Check if the structure in the user message will be correct
            console.log(
              "DEBUG [handleInteractionSubmit]: Structure for user message:",
              JSON.stringify(submittedData, null, 2)
            );
          } else {
            confirmationText = `Okay, I've updated the website structure.`;
            console.warn(
              "DEBUG [handleInteractionSubmit]: Empty or invalid structure submitted"
            );
          }
        } else if (promptKey === "primaryGoal") {
          // submittedData should be a string
          if (submittedData && typeof submittedData === "string") {
            confirmationText = `I've set the primary goal to: "${submittedData}".`;
          }
        } else if (submittedData) {
          // Generic fallback for other types if needed
          confirmationText = `Okay, I've selected: ${JSON.stringify(submittedData)}.`;
        }
      } catch (error) {
        console.error("Error generating confirmation text:", error);
        confirmationText = `Okay, I've processed the selection for ${promptKey}. (Error generating details)`; // Fallback on error
      }

      console.log(
        "DEBUG [handleInteractionSubmit] Confirmation text generated:",
        confirmationText
      );

      // Mark message processed in the store (moved from store itself)
      const messageIndex = useAdvancedChatStore
        .getState()
        .messages.findIndex((m) => m.id === messageId);
      if (messageIndex !== -1) {
        useAdvancedChatStore.setState((state) => {
          // Mark as processed but preserve the component data
          state.messages[messageIndex].interactionProcessed = true;

          console.log(
            "DEBUG [handleInteractionSubmit] Marked message as processed. interactionProcessed =",
            state.messages[messageIndex].interactionProcessed,
            "componentData preserved =",
            !!state.messages[messageIndex].interactiveComponentData
          );

          return state;
        });
      } else {
        console.warn(
          "DEBUG [handleInteractionSubmit] Could not find message to mark as processed:",
          messageId
        );
      }

      // Combine visible text and hidden JSON for the AI
      const userMessageContent = `${confirmationText}\n\n<!-- Selected ${promptKey} data: ${jsonDataForContext} -->`;

      // Create a user message that includes a copy of the interactive component data
      // but marked as processed so it renders in read-only mode
      const userMessageId = uuidv4();
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: userMessageContent,
        timestamp: new Date(),
        // Include the interactive component data for visual display, marked as processed
        interactiveComponentData: {
          ...originalMessage.interactiveComponentData,
          promptKey,
          // Update props with selected data if needed
          props:
            type === "fontPairSelector"
              ? { ...props, currentFontId: submittedData.fontId }
              : type === "colorPaletteEditor"
                ? { ...props, initialPalette: submittedData }
                : type === "siteStructureEditor"
                  ? { ...props, initialStructure: submittedData }
                  : props,
        },
        interactionProcessed: true, // Mark as processed so it renders read-only
      };

      // Add message to the store directly
      addMessage(userMessage);

      // 3. Send this message content to the API to get AI response
      console.log(
        "DEBUG [handleInteractionSubmit] About to call sendMessageToApi with:",
        userMessageContent
      );

      // Now trigger the AI response (this will only send the text, not render the component again)
      setIsLoading(true);
      setError(null);

      const currentMessages = useAdvancedChatStore.getState().messages;

      try {
        const response = await fetch("/api/advanced-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: currentMessages,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `API Error: ${response.statusText}`
          );
        }

        const data = await response.json();

        processAssistantResponse({
          text: data.response,
          interactiveData: data.interactiveComponentData ?? null,
        });
      } catch (err) {
        console.error("Error sending message to API:", err);
        const errorMsg =
          err instanceof Error ? err.message : "Unknown API error";
        setError(`Failed to get response: ${errorMsg}`);

        addMessage({
          id: uuidv4(),
          role: "system",
          content: `❌ Error communicating with AI: ${errorMsg}`,
          timestamp: new Date(),
        });
        setIsLoading(false);
      }

      console.log(
        "DEBUG [handleInteractionSubmit] sendMessageToApi called. END of handleInteractionSubmit"
      );
    } catch (error) {
      console.error("Error in handleInteractionSubmit:", error);
      setIsLoading(false);
    }
  };

  // Function to send user message to backend API
  const sendMessageToApi = async (
    content: string,
    imageUrl?: string | null
  ) => {
    console.log("DEBUG [sendMessageToApi] START with content:", content);

    if (!content.trim() && !imageUrl) {
      console.warn(
        "DEBUG [sendMessageToApi] Empty content and no image, returning without sending"
      );
      return;
    }

    const userMessageId = uuidv4();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      // Attach imageUrl if provided (needs handling for actual upload later)
      // imageUrl: imageUrl,
    };

    console.log("DEBUG [sendMessageToApi] Created user message:", userMessage);

    addMessage(userMessage);
    console.log("DEBUG [sendMessageToApi] Added message to store");

    setIsLoading(true);
    setError(null);
    console.log("DEBUG [sendMessageToApi] Set loading state to true");

    // Prepare message history for API (get latest state)
    const currentMessages = useAdvancedChatStore.getState().messages;
    console.log(
      "DEBUG [sendMessageToApi] Current message count:",
      currentMessages.length
    );

    try {
      console.log("DEBUG [sendMessageToApi] About to make API request");
      const response = await fetch("/api/advanced-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages, // Send current history
          // Include project brief context if needed by AI? (optional)
          // currentBrief: useAdvancedChatStore.getState().projectBrief,
          // currentChatState: useAdvancedChatStore.getState().chatState,
        }),
      });

      console.log(
        "DEBUG [sendMessageToApi] API response status:",
        response.status
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(
        "DEBUG [sendMessageToApi] API response data received, length:",
        data.response?.length ?? "no response"
      );

      processAssistantResponse({
        text: data.response,
        interactiveData: data.interactiveComponentData ?? null,
      });
      console.log("DEBUG [sendMessageToApi] Processed assistant response");
    } catch (err) {
      console.error(
        "DEBUG [sendMessageToApi] Error sending message to API:",
        err
      );
      const errorMsg = err instanceof Error ? err.message : "Unknown API error";
      setError(`Failed to get response: ${errorMsg}`);
      // Add system error message
      addMessage({
        id: uuidv4(),
        role: "system",
        content: `❌ Error communicating with AI: ${errorMsg}`,
        timestamp: new Date(),
      });
      setIsLoading(false);
    }
    console.log("DEBUG [sendMessageToApi] END of sendMessageToApi function");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Conditional Mobile Toggle */}
        {isMobileMode && !isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20"
            onClick={toggleSidebar}
            aria-label="Open project summary"
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        )}

        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          error={error}
          chatState={chatState}
          onSendMessage={sendMessageToApi}
          onInteractionSubmit={handleInteractionSubmit} // Pass down the combined handler
        />
      </main>

      {/* Right Sidebar */}
      {isSidebarOpen && (
        <aside
          className={cn(
            "w-full md:w-80 lg:w-96 border-l bg-card h-full flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out",
            isMobileMode ? "absolute top-0 right-0 z-30" : "relative" // Handle mobile overlay
          )}
        >
          <ProjectSummarySidebar
            brief={projectBrief}
            chatState={chatState}
            onGenerate={triggerWebsiteGeneration} // Pass trigger function
            onClose={isMobileMode ? toggleSidebar : undefined} // Provide close only for mobile overlay
          />
        </aside>
      )}
      <Toaster />
    </div>
  );
};

// Export the main component wrapped in Suspense
export default function AdvancedChatPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AdvancedChatPageContent />
    </Suspense>
  );
}

// Basic Loading Component
const PageLoading: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="text-center">
      <p className="text-lg font-medium">Loading Chat...</p>
      {/* You can add a spinner here */}
    </div>
  </div>
);

// Need uuid package
import { v4 as uuidv4 } from "uuid";
import type {
  ChatMessage,
  InteractiveComponentData,
} from "@/types/advanced-chat"; // Ensure correct pathimport { cn } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Add this helper function to generate a text representation of the structure
// Place this outside the component, before export default
function generateStructureText(structure: any[], level: number = 0): string {
  if (!structure || !structure.length) return "";

  let text = "";
  structure.forEach((node) => {
    // Indent based on level
    const indent = "  ".repeat(level);
    const prefix = level === 0 ? "📄 " : "└─ ";

    // Add the node name and type
    text += `${indent}${prefix}${node.name} (${node.type})\n`;

    // Add children recursively if they exist
    if (node.children && node.children.length > 0) {
      text += generateStructureText(node.children, level + 1);
    }
  });

  return text;
}
