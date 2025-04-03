"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { PCChatInterface } from "@/components/pro-chat/PCChatInterface";
import { useProChatStore, PCMessage } from "@/hooks/useProChatStore";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import OnboardingOverlay from "@/components/pro-chat/OnboardingOverlay";
import TutorialButton from "@/components/pro-chat/TutorialButton";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export interface ProChatPageProps {
  params: Promise<{
    website_id: string;
  }>;
}

export default function ProChatPage({ params }: ProChatPageProps) {
  // Use React.use to unwrap the params Promise
  const resolvedParams = React.use(params);
  const websiteId = resolvedParams.website_id;

  const supabase = createClient();
  const router = useRouter();

  const {
    initChat,
    addMessage,
    setChatState,
    updateProjectBrief,
    resetMessages,
    addAsset,
  } = useProChatStore();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [restorationComplete, setRestorationComplete] = useState(false);

  // Check authentication and load website data
  useEffect(() => {
    const init = async () => {
      if (!websiteId) return;

      const authResult = await checkAuth();
      if (!authResult) return;

      await loadWebsiteData(websiteId);
      // Mark restoration as complete after data is loaded
      setRestorationComplete(true);
    };

    // Check if onboarding is complete from localStorage
    const onboardingStatus = localStorage.getItem(
      "prochat_onboarding_complete"
    );
    setShowOnboarding(!onboardingStatus || onboardingStatus !== "true");

    init();
  }, [websiteId]);

  // Function to check user authentication
  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error("Auth error:", error);
        router.push("/login");
        return false;
      }

      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/login");
      return false;
    }
  };

  // Function to load website data from Supabase
  const loadWebsiteData = async (websiteId: string) => {
    console.log("🔄 Starting website data loading for ID:", websiteId);
    setIsLoading(true);

    try {
      // Get website data from Supabase
      console.log("📡 Fetching website data from Supabase...");
      const { data: websiteData, error } = await supabase
        .from("websites")
        .select("*")
        .eq("id", websiteId)
        .single();

      if (error) {
        console.error("❌ Error loading website data:", error);
        toast({
          title: "Error",
          description: "Could not load website data: " + error.message,
          variant: "destructive",
        });
        setRestorationComplete(true); // Enable auto-save even on error
        return;
      }

      console.log("✅ Website data loaded successfully:", websiteData);

      if (websiteData) {
        // Set page title and website name
        document.title = `${websiteData.website_name || websiteData.name} | Pro Chat | RapidSite`;
        setWebsiteName(
          websiteData.website_name || websiteData.name || "My Website"
        );

        // Debug log the entire website data
        console.log(
          "📋 Complete website data:",
          JSON.stringify(websiteData, null, 2)
        );

        // IMPORTANT: This sequence matters - we need to:
        // 1. Initialize chat (resets everything)
        // 2. Reset messages explicitly (just to be sure)
        // 3. Load project brief
        // 4. Set chat state
        // 5. Load messages

        // 1. Initialize chat with website name
        console.log(
          "🔄 Initializing chat with name:",
          websiteData.website_name || websiteData.name
        );
        initChat(websiteData.website_name || websiteData.name || "My Website");

        // 2. Reset messages explicitly
        console.log("🗑️ Explicitly resetting messages before restoration...");
        resetMessages();

        let dataRestored = false;

        // 3. Restore project brief if available
        if (websiteData.project_brief) {
          console.log(
            "🔄 Restoring project brief:",
            typeof websiteData.project_brief === "object"
              ? "Object data"
              : "String data"
          );

          try {
            // Parse project brief if it's a string
            let briefData = websiteData.project_brief;
            if (typeof briefData === "string") {
              try {
                console.log("🔄 Parsing project brief from string...");
                briefData = JSON.parse(briefData);
                console.log("✅ Successfully parsed project brief");
              } catch (parseError) {
                console.error("❌ Error parsing project brief:", parseError);
                // Keep the string version if parsing fails
              }
            }

            // Create a safe copy of the project brief with proper sanitization
            const safeBrief = ensureProperSerialization(briefData);
            console.log("🔄 Sanitized project brief ready", safeBrief);

            console.log("🔄 Updating project brief in store...");
            updateProjectBrief(safeBrief);
            console.log("✅ Project brief updated in store");
            dataRestored = true;
          } catch (e) {
            console.error("❌ Error restoring project brief:", e);
          }
        } else {
          console.log("⚠️ No project brief found to restore");
        }

        // 4. Restore chat state if available
        if (websiteData.chat_state) {
          console.log("🔄 Restoring chat state:", websiteData.chat_state);
          setChatState(websiteData.chat_state);
          console.log("✅ Chat state updated");
          dataRestored = true;
        } else {
          console.log("⚠️ No chat state found to restore");
        }

        // 5. Restore chat messages if available
        if (websiteData.chat_conversation) {
          console.log(
            "🔄 Found chat_conversation data:",
            typeof websiteData.chat_conversation
          );

          // Parse the conversation if it's a string
          let conversationData = websiteData.chat_conversation;
          if (typeof conversationData === "string") {
            try {
              console.log("🔄 Parsing chat_conversation from string...");
              conversationData = JSON.parse(conversationData);
              console.log("✅ Successfully parsed chat_conversation to array");
            } catch (parseError) {
              console.error("❌ Error parsing chat_conversation:", parseError);
              conversationData = [];
            }
          }

          // Now check if we have an array of messages
          if (Array.isArray(conversationData) && conversationData.length > 0) {
            console.log(
              "🔄 Starting message restoration. Found messages:",
              conversationData.length
            );

            try {
              // Process each message
              for (let i = 0; i < conversationData.length; i++) {
                const message = conversationData[i];

                // Skip if message is invalid
                if (
                  !message ||
                  !message.id ||
                  !message.role ||
                  !message.content
                ) {
                  console.log(
                    `⚠️ Skipping invalid message at index ${i}:`,
                    message
                  );
                  continue;
                }

                // Fix timestamp if it's a string
                const fixedTimestamp =
                  typeof message.timestamp === "string"
                    ? new Date(message.timestamp)
                    : message.timestamp instanceof Date
                      ? message.timestamp
                      : new Date();

                // Create sanitized message
                const safeMessage = {
                  id: message.id,
                  role: message.role,
                  content: message.content,
                  timestamp: fixedTimestamp,
                  options: message.options || [],
                  hidden: message.hidden || false,
                  interactiveComponent: message.interactiveComponent || null,
                  interactionProcessed: message.interactionProcessed || false,
                };

                console.log(
                  `📝 Adding message ${i + 1}/${conversationData.length}, ID: ${safeMessage.id}`
                );
                addMessage(safeMessage);
              }

              console.log("✅ All messages restored successfully");
              dataRestored = true;

              // Verify messages were added
              const currentMessages = useProChatStore.getState().messages;
              console.log(
                "📊 Messages after restoration:",
                currentMessages.length
              );

              if (currentMessages.length > 0) {
                console.log("📄 First message:", currentMessages[0]);
                console.log(
                  "📄 Last message:",
                  currentMessages[currentMessages.length - 1]
                );
              }

              // Show toast only if messages were actually restored
              if (currentMessages.length > 0) {
                toast({
                  title: "Chat Restored",
                  description: "Your previous conversation has been loaded.",
                });
              }
            } catch (e) {
              console.error("❌ Error restoring messages:", e);
            }
          } else {
            console.log(
              "⚠️ No chat messages found to restore, data is not an array or is empty"
            );
          }
        } else {
          console.log("⚠️ No chat_conversation field found in database");
        }

        // Final state check
        const finalState = useProChatStore.getState();
        console.log("📊 FINAL STORE STATE:", {
          messagesCount: finalState.messages.length,
          chatState: finalState.chatState,
          projectBrief: finalState.projectBrief,
        });

        // Mark restoration as complete
        console.log("✅ Data restoration complete, enabling auto-save");

        setIsCompleted(!!websiteData.completion_date);

        // Important: At this point, allow the component to render once and then set the flag
        setTimeout(() => {
          setRestorationComplete(true);
          console.log("🔒 Restoration complete flag set to true");

          // If some data was restored, force a save to prevent data loss
          if (dataRestored && user && websiteId) {
            console.log(
              "🔄 Forcing immediate save to preserve restored data..."
            );
            saveCurrentState(user.id, websiteId);
          }
        }, 500);
      }
    } catch (error) {
      console.error("❌ Error in loadWebsiteData:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading website data.",
        variant: "destructive",
      });
      // Even if there's an error, we need to mark restoration as complete to enable saving
      setTimeout(() => {
        setRestorationComplete(true);
      }, 500);
    } finally {
      setIsLoading(false);
      console.log("✅ Website data loading process completed");
    }
  };

  // Helper function for safe serialization
  function ensureProperSerialization<T>(obj: T): T {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      console.error("Serialization error:", e);
      return obj;
    }
  }

  // Auto-save chat state only after restoration is complete
  useEffect(() => {
    if (!user || !websiteId || !restorationComplete) {
      console.log("Auto-save disabled: Not ready yet", {
        hasUser: !!user,
        hasWebsiteId: !!websiteId,
        restorationComplete,
      });
      return;
    }

    console.log("📊 Auto-save effect is now active");

    const saveChatState = async () => {
      try {
        console.log("💾 Starting chat state save process...");
        // Get the current chat state
        const currentStore = useProChatStore.getState();
        console.log("📊 Current store state for saving:", {
          messagesCount: currentStore.messages.length,
          chatState: currentStore.chatState,
          projectBrief: currentStore.projectBrief ? "Present" : "Missing",
        });

        // Use the same saveCurrentState function for consistency
        await saveCurrentState(user.id, websiteId);
      } catch (err) {
        console.error("❌ Failed to save chat state:", err);
      }
    };

    // Save on unmount
    return () => {
      console.log("🔄 Component unmounting, saving chat state...");
      saveChatState();
    };
  }, [user, websiteId, supabase, restorationComplete]);

  // Handle asset upload to Supabase storage
  const handleAssetUpload = async (
    file: File,
    label?: string,
    description?: string
  ) => {
    if (!user || !websiteId) {
      toast({
        title: "Error",
        description: "You must be logged in to upload assets.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsLoading(true);

      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      // Create a filename with label/description info if provided
      const fileExt = file.name.split(".").pop();
      const fileLabel = label
        ? `-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`
        : "";
      const fileName = `${user.id}/${websiteId}/assets/img-${Date.now()}${fileLabel}.${fileExt}`;

      // Upload file to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user_website_data")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user_website_data").getPublicUrl(fileName);

      // Add asset to store
      const assetId = Date.now().toString();
      addAsset({
        id: assetId,
        name: file.name,
        url: publicUrl,
        type: "image",
        label: label || "",
        description: description || "",
      });

      toast({
        title: "Success",
        description: "Asset uploaded successfully",
      });

      return { id: assetId, url: publicUrl };
    } catch (error: any) {
      console.error("Error uploading asset:", error);
      toast({
        title: "Upload Failed",
        description:
          error instanceof Error ? error.message : "Failed to upload asset",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWebsite = async (brief: any) => {
    if (!user || !websiteId) {
      toast({
        title: "Error",
        description: "You must be logged in to generate a website.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Save chat state and brief to database
      const { error: updateError } = await supabase
        .from("websites")
        .update({
          status: "generating",
          updated_at: new Date().toISOString(),
          last_updated_at: new Date().toISOString(),
          project_brief: brief,
          chat_state: useProChatStore.getState().chatState,
          chat_conversation: useProChatStore.getState().messages,
        })
        .eq("id", websiteId);

      if (updateError) {
        throw updateError;
      }

      // Call website generation API
      const response = await fetch(
        `https://rapidsite-new.azurewebsites.net/api/start_website_generation?user_id=${user.id}&website_id=${websiteId}&model=claude-3-sonnet-20240229`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brief: brief,
            chat_state: useProChatStore.getState().chatState,
            messages: useProChatStore.getState().messages,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Generation failed: ${errorText}`);
      }

      toast({
        title: "Website generation started!",
        description:
          "Your website is being generated. You'll be notified when it's ready.",
      });

      // Redirect to dashboard with a success parameter
      router.push(`/dashboard?generation_started=${websiteId}`);
    } catch (error: any) {
      console.error("Error generating website:", error);

      // Update website status to error
      await supabase
        .from("websites")
        .update({
          status: "error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", websiteId);

      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "Failed to generate website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("prochat_onboarding_complete", "true");
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem("prochat_onboarding_complete", "true");
  };

  // Function to save the current state to Supabase
  const saveCurrentState = async (userId: string, websiteId: string) => {
    try {
      console.log("💾 Manually saving current state...");
      const currentStore = useProChatStore.getState();
      console.log("📊 Current store state for manual save:", {
        messagesCount: currentStore.messages.length,
        chatState: currentStore.chatState,
        projectBrief: currentStore.projectBrief ? "Present" : "Missing",
      });

      // Convert messages to a format that Supabase can handle
      // Some database configurations expect JSON fields as strings instead of objects
      let chatConversation = currentStore.messages;
      let projectBrief = currentStore.projectBrief;

      // Make sure the data is properly serialized before saving
      try {
        // For compatibility with different database settings, we'll ensure data is stringified safely
        const safeMessages = JSON.stringify(chatConversation);
        const safeBrief = JSON.stringify(projectBrief);

        console.log(
          "📡 Preparing data for save - messages",
          `Characters: ${safeMessages.length}`,
          `Messages count: ${chatConversation.length}`
        );

        // Save the chat state to Supabase
        console.log("📡 Sending data to Supabase...");
        const { error } = await supabase
          .from("websites")
          .update({
            updated_at: new Date().toISOString(),
            chat_conversation: safeMessages, // Using the stringified version
            project_brief: safeBrief, // Using the stringified version
            chat_state: currentStore.chatState,
            last_updated_at: new Date().toISOString(),
          })
          .eq("id", websiteId)
          .eq("user_id", userId);

        if (error) {
          console.error("❌ Error saving chat state:", error);
        } else {
          console.log("✅ Chat state saved successfully");
        }
      } catch (serializationError) {
        console.error(
          "❌ Error serializing data for save:",
          serializationError
        );
        // Fallback to saving without additional stringification
        const { error } = await supabase
          .from("websites")
          .update({
            updated_at: new Date().toISOString(),
            chat_conversation: chatConversation,
            project_brief: projectBrief,
            chat_state: currentStore.chatState,
            last_updated_at: new Date().toISOString(),
          })
          .eq("id", websiteId)
          .eq("user_id", userId);

        if (error) {
          console.error("❌ Error in fallback save:", error);
        } else {
          console.log("✅ Chat state saved with fallback method");
        }
      }
    } catch (err) {
      console.error("❌ Failed to save chat state:", err);
    }
  };

  // Function to clear chat data in the database (useful for debugging or starting fresh)
  const clearChatData = async () => {
    if (!user || !websiteId) {
      console.error("❌ Cannot clear chat data: Missing user or website ID");
      return;
    }

    try {
      console.log("🧹 Clearing chat data from database...");
      const { error } = await supabase
        .from("websites")
        .update({
          updated_at: new Date().toISOString(),
          chat_conversation: "[]", // Empty array as string
          project_brief: "{}", // Empty object as string
          chat_state: "INTRODUCTION",
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", websiteId)
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Error clearing chat data:", error);
        toast({
          title: "Error",
          description: "Failed to clear chat data",
          variant: "destructive",
        });
      } else {
        console.log("✅ Chat data cleared successfully");
        toast({
          title: "Chat Data Cleared",
          description: "Chat data has been reset to default",
        });

        // Reset local state
        useProChatStore.getState().resetMessages();
        useProChatStore.getState().updateProjectBrief({});
        useProChatStore.getState().setChatState("INTRODUCTION");
      }
    } catch (err) {
      console.error("❌ Failed to clear chat data:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Manual save handler
  const handleManualSave = async () => {
    // ... existing code ...
  };

  if (!websiteId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-zinc-50 dark:bg-background relative">
      <div className="h-full relative">
        <PCChatInterface
          websiteId={websiteId as string}
          userId={user?.id}
          onManualSave={handleManualSave}
          clearChatData={clearChatData}
          onGenerate={(brief) =>
            console.log("Generate website with brief", brief)
          }
          onAssetUpload={async (file, label, description) => {
            console.log("Asset upload requested", { file, label, description });
            // Since we don't have the actual asset upload implementation here,
            // we'll just return a mock response
            return {
              id: Date.now().toString(),
              url: URL.createObjectURL(file),
            };
          }}
          isGenerating={false}
        />
      </div>
    </div>
  );
}
