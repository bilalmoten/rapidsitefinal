"use client";

import React, { useEffect, useState } from "react";
import { PCMessageList } from "./PCMessageList";
import { PCMessageInput } from "./PCMessageInput";
import { PCProjectBriefSidebar } from "./PCProjectBrief";
import { useProChatStore } from "@/hooks/useProChatStore";
import { Button } from "../ui/button";
import {
  ChevronRight,
  FolderOpen,
  MessageSquare,
  Save,
  Trash2,
  Bug,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContextualTips from "./ContextualTips";
import { Progress } from "@/components/ui/progress";
import ExamplePrompts from "./ExamplePrompts";
import { toast } from "@/components/ui/use-toast";

// Define types for PCAsset and PCContentReference
export interface PCAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  label?: string;
  description?: string;
}

export interface PCContentReference {
  id: string;
  name: string;
  url: string;
  type: string;
}

// Simple Asset Uploader Component
const PCAssetUploader: React.FC<{
  assets: PCAsset[];
  contentReferences: PCContentReference[];
  onFileUpload: (file: File, label?: string, description?: string) => void;
  onRemoveAsset: (id: string) => void;
  onRemoveContentReference: (id: string) => void;
  onUpdateAsset?: (id: string, updates: Partial<PCAsset>) => void;
}> = ({
  assets,
  contentReferences,
  onFileUpload,
  onRemoveAsset,
  onRemoveContentReference,
  onUpdateAsset,
}) => {
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");

  const handleFileSelection = (file: File) => {
    onFileUpload(file, uploadLabel, uploadDescription);
    // Reset the fields after upload
    setUploadLabel("");
    setUploadDescription("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assets Manager</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Images</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Add labels and descriptions to help the AI understand where to use
          your images on the website.
        </p>

        <div className="mb-4 space-y-3">
          <div>
            <label
              htmlFor="image-label"
              className="text-sm font-medium block mb-1"
            >
              Label (optional):
            </label>
            <input
              id="image-label"
              type="text"
              placeholder="E.g., Logo, Hero Image, Team Photo"
              className="w-full px-3 py-2 text-sm border rounded"
              value={uploadLabel}
              onChange={(e) => setUploadLabel(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="image-description"
              className="text-sm font-medium block mb-1"
            >
              Description (optional):
            </label>
            <textarea
              id="image-description"
              placeholder="Describe how you want this image to be used"
              className="w-full px-3 py-2 text-sm border rounded resize-none h-20"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
            />
          </div>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <p className="text-gray-500">Click to upload images</p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelection(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
        </div>

        {assets.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {assets.map((asset) => (
              <div key={asset.id} className="border rounded-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                  />
                  <div className="p-3 flex-1">
                    <div className="mb-3">
                      <div className="text-sm font-medium">Image name:</div>
                      <div className="truncate text-sm">{asset.name}</div>
                    </div>

                    <div className="mb-3">
                      <label className="text-sm font-medium block mb-1">
                        Label:
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., Hero image, Product photo, Team member"
                        className="w-full px-3 py-1 text-sm border rounded"
                        value={asset.label || ""}
                        onChange={(e) =>
                          onUpdateAsset &&
                          onUpdateAsset(asset.id, { label: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="text-sm font-medium block mb-1">
                        Description:
                      </label>
                      <textarea
                        placeholder="Describe what's in this image and how you'd like it to be used"
                        className="w-full px-3 py-1 text-sm border rounded resize-none h-20"
                        value={asset.description || ""}
                        onChange={(e) =>
                          onUpdateAsset &&
                          onUpdateAsset(asset.id, {
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveAsset(asset.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">References</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add URL reference (https://...)"
            className="flex-1 px-3 py-2 border rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value) {
                let url = e.currentTarget.value;
                // Add https:// if no protocol specified
                if (!/^https?:\/\//i.test(url)) {
                  url = "https://" + url;
                }
                const fakeFile = new File([""], "reference.txt", {
                  type: "text/plain",
                });
                Object.defineProperty(fakeFile, "customData", {
                  value: { url },
                  writable: false,
                });
                onFileUpload(fakeFile);
                e.currentTarget.value = "";
              }
            }}
          />
          <Button
            onClick={() => {
              const input = document.querySelector(
                'input[placeholder="Add URL reference (https://...)"]'
              ) as HTMLInputElement;
              if (input && input.value) {
                let url = input.value;
                // Add https:// if no protocol specified
                if (!/^https?:\/\//i.test(url)) {
                  url = "https://" + url;
                }
                const fakeFile = new File([""], "reference.txt", {
                  type: "text/plain",
                });
                Object.defineProperty(fakeFile, "customData", {
                  value: { url },
                  writable: false,
                });
                onFileUpload(fakeFile);
                input.value = "";
              }
            }}
          >
            Add
          </Button>
        </div>

        {contentReferences.length > 0 && (
          <div className="space-y-2">
            {contentReferences.map((ref) => (
              <div
                key={ref.id}
                className="flex justify-between items-center p-3 bg-muted rounded-md"
              >
                <div className="truncate">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {ref.name}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveContentReference(ref.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface PCChatInterfaceProps {
  onGenerate: (brief: any) => void;
  onAssetUpload?: (
    file: File,
    label?: string,
    description?: string
  ) => Promise<{ id: string; url: string } | null>;
  isGenerating?: boolean;
  websiteId?: string;
  userId?: string;
  onManualSave: () => void;
  clearChatData?: () => void;
  isDev?: boolean;
}

export const PCChatInterface: React.FC<PCChatInterfaceProps> = ({
  onGenerate,
  onAssetUpload,
  isGenerating = false,
  websiteId,
  userId,
  onManualSave,
  clearChatData,
  isDev = process.env.NODE_ENV === "development",
}) => {
  const {
    messages,
    sendMessage,
    projectBrief,
    chatState,
    isLoading,
    error,
    processInteractiveComponent,
    addAsset,
    removeAsset,
    addContentReference,
    removeContentReference,
    triggerWebsiteGeneration,
    saveChatState,
  } = useProChatStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [inputValue, setInputValue] = useState("");
  const [showDebugTools, setShowDebugTools] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleManageAssets = () => {
    setActiveTab("assets");
  };

  const handleFileUpload = async (
    file: File,
    label?: string,
    description?: string
  ) => {
    // Check if file has custom data (used for references)
    const customData = (file as any).customData;

    if (customData) {
      // This is a content reference
      addContentReference(customData.url);
      return;
    }

    // If we have the onAssetUpload prop, use it for Supabase storage
    if (onAssetUpload && file.type.startsWith("image/")) {
      await onAssetUpload(file, label, description);
      // The asset is already added to the store in the parent component
      return;
    } else {
      // Fallback to the original local URL approach
      if (file.type.startsWith("image/")) {
        addAsset({
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: "image",
          label: label || "",
          description: description || "",
        });
      } else {
        // For non-image files, treat as content references
        addContentReference(URL.createObjectURL(file));
      }
    }
  };

  const handleGenerateWebsite = async () => {
    await triggerWebsiteGeneration();
    onGenerate(projectBrief);
  };

  const handleUpdateAsset = (id: string, updates: Partial<PCAsset>) => {
    // Find the asset to update
    const asset = projectBrief.assets?.find((a) => a.id === id);
    if (asset) {
      // Create an updated asset
      const updatedAsset = { ...asset, ...updates };
      // Remove the old asset and add the updated one
      removeAsset(id);
      addAsset(updatedAsset as any); // Use type assertion to avoid type error
    }
  };

  const handleExamplePromptSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  const hasAssets =
    (projectBrief.assets && projectBrief.assets.length > 0) ||
    (projectBrief.contentReferences &&
      projectBrief.contentReferences.length > 0);

  // Modified auto-save logic - only on unmount
  useEffect(() => {
    // Cleanup function - save data on unmount
    return () => {
      if (userId && websiteId && messages.length > 0) {
        saveChatState(userId, websiteId);
        console.log("Saving chat state on unmount");
      }
    };
  }, [userId, websiteId, messages.length, saveChatState]);

  // Manual save function
  const handleManualSave = async () => {
    if (!userId || !websiteId) {
      toast({
        title: "Error",
        description: "Cannot save: Missing user ID or website ID.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveChatState(userId, websiteId);
      toast({
        title: "Success",
        description: "Project progress saved successfully.",
      });
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add debug tools section that only appears in development mode
  const renderDebugTools = () => {
    if (!isDev) return null;

    return (
      <div className="absolute bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm text-xs gap-1"
          onClick={() => {
            setShowDebugTools((prev) => !prev);
          }}
        >
          <Bug className="h-3 w-3" />
          <span>Debug</span>
        </Button>

        {showDebugTools && (
          <div className="absolute bottom-full right-0 mb-2 p-2 rounded-md bg-background/90 backdrop-blur-sm border shadow-md flex flex-col gap-2 w-44">
            <p className="text-xs font-medium">Debug Tools</p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 w-full justify-start"
              onClick={onManualSave}
            >
              <Save className="h-3 w-3" />
              <span>Force Save</span>
            </Button>
            {clearChatData && (
              <Button
                variant="destructive"
                size="sm"
                className="text-xs gap-1 w-full justify-start"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear all chat data? This cannot be undone."
                    )
                  ) {
                    clearChatData();
                  }
                }}
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear Chat Data</span>
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 relative flex h-full overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full"
          >
            {/* Top Bar */}
            <div className="border-b px-4 py-2 flex items-center justify-between bg-background">
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger value="assets" className="flex items-center gap-1">
                  <FolderOpen className="h-4 w-4" />
                  <span>Assets {hasAssets && "•"}</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                {/* Progress indicator */}
                {projectBrief.progress > 0 && (
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs font-medium">Progress</span>
                    <Progress
                      value={projectBrief.progress}
                      className="w-24 h-2"
                    />
                    <span className="text-xs font-medium">
                      {Math.round(projectBrief.progress)}%
                    </span>
                  </div>
                )}

                {/* Save button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleManualSave}
                >
                  <Save className="h-3 w-3" />
                  <span className="hidden md:inline">Save</span>
                </Button>

                {!isSidebarOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="ml-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Content Area with Tabs */}
            <TabsContent
              value="chat"
              className="flex-1 flex flex-col overflow-hidden m-0 p-0 border-0 relative"
            >
              {/* Contextual Tips */}
              <div className="px-4 pt-4">
                <ContextualTips chatState={chatState} />
              </div>

              {/* Messages Area - Scrollable */}
              <div className="flex-1 overflow-y-auto pb-36 px-4">
                <div className="max-w-4xl mx-auto w-full">
                  <PCMessageList
                    messages={messages}
                    onSendMessage={sendMessage}
                    onProcessInteractive={processInteractiveComponent}
                    chatState={chatState}
                  />
                </div>
              </div>

              {/* Example Prompts - Fixed above input */}
              <div className="absolute bottom-[72px] left-0 right-0 px-4 py-2 border-t bg-background/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                  <ExamplePrompts
                    chatState={chatState}
                    onSelectPrompt={handleExamplePromptSelect}
                  />
                </div>
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="border-t bg-background absolute bottom-0 left-0 right-0 z-10">
                <PCMessageInput
                  onSendMessage={sendMessage}
                  disabled={isLoading}
                  isGenerating={chatState === "GENERATING"}
                  onGenerateWebsite={
                    chatState !== "INTRODUCTION" &&
                    chatState !== "GENERATING" &&
                    chatState !== "COMPLETE"
                      ? handleGenerateWebsite
                      : undefined
                  }
                  value={inputValue}
                  onChange={setInputValue}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="assets"
              className="flex-1 overflow-auto m-0 border-0"
            >
              <PCAssetUploader
                assets={projectBrief.assets || []}
                contentReferences={projectBrief.contentReferences.map(
                  (ref) => ({
                    id: ref,
                    name: ref,
                    url: ref,
                    type: "reference",
                  })
                )}
                onFileUpload={handleFileUpload}
                onRemoveAsset={removeAsset}
                onUpdateAsset={handleUpdateAsset}
                onRemoveContentReference={(id: string) => {
                  const index = projectBrief.contentReferences.findIndex(
                    (ref) => ref === id
                  );
                  if (index !== -1) {
                    removeContentReference(index);
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - positioned on the RIGHT */}
        {isSidebarOpen && (
          <div className="w-80 shrink-0 border-l bg-background z-10 h-full overflow-auto">
            <PCProjectBriefSidebar
              brief={projectBrief}
              chatState={chatState}
              onClose={toggleSidebar}
              onGenerate={handleGenerateWebsite}
              isGenerating={isLoading && chatState === "GENERATING"}
              onManageAssets={handleManageAssets}
              onSave={handleManualSave}
            />
          </div>
        )}
      </div>

      {/* Debug tools overlay */}
      {renderDebugTools()}
    </div>
  );
};
