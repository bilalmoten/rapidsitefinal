"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useInterval } from "react-use";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, MessageSquare, Lightbulb } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/chat-Sidebar";
import { useChat, Message } from "ai/react";
import React from "react";
import { toast } from "react-hot-toast";
import DashboardBackground from "@/components/dashboard/DashboardBackground";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GenerationExperience } from "@/components/website-generation/GenerationExperience";
// import { useSidebar } from "@/contexts/SidebarContext";

interface ChatPageProps {
  params: Promise<{ website_id: string }>;
}

export default function ChatPage(props: ChatPageProps) {
  const params = React.use(props.params);
  const websiteId = params.website_id;
  // const { isExpanded } = useSidebar();

  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBuildButton, setShowBuildButton] = useState(false);
  const [isChatActive, setIsChatActive] = useState(true);
  const [colorScheme, setColorScheme] = useState<string[]>([
    "#3B82F6",
    "#10B981",
    "#6366F1",
  ]);
  const [logo, setLogo] = useState<string | null>(null);
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);
  const [inspirationLinks, setInspirationLinks] = useState<string[]>([]);
  const [industry, setIndustry] = useState("");
  const [chatMode, setChatMode] = useState<"prompt" | "conversation">("prompt");
  const [promptInput, setPromptInput] = useState("");
  const [debugMode, setDebugMode] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI assistant. Let's create your dream website. To get started, could you tell me about your business and what kind of website you're looking for?",
      },
    ],
    onResponse: (response: Response) => {
      console.log("Response from AI:", response);
    },
    onFinish: (message: Message) => {
      console.log("Finished message:", message);
      if (message.content.includes("EXIT")) {
        const cleanContent = message.content.replace("EXIT", "").trim();
        setShowBuildButton(true);
        setIsChatActive(false);
        startWebsiteGeneration();
        updateSidebarInfo(cleanContent);
      }
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        console.log("User authenticated:", user.id);
      }
    };

    checkUser();
    console.log("Initial chat mode:", chatMode);
  }, [router]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isGenerating) {
      intervalId = setInterval(async () => {
        const { data, error } = await supabase
          .from("websites")
          .select("status")
          .eq("id", websiteId)
          .single();

        if (data?.status === "completed") {
          setIsGenerating(false);
          router.push(`/dashboard/editor/${websiteId}`);
        } else if (
          generationStartTime &&
          Date.now() - generationStartTime > 120000
        ) {
          setIsGenerating(false);
          alert(
            "Your website is taking longer than expected to generate. We'll email you when it's ready."
          );
          router.push("/dashboard");
        }
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isGenerating, generationStartTime, websiteId, router]);

  const [localIsLoading, setLocalIsLoading] = useState(false);

  const customHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isChatActive) return;

    setLocalIsLoading(true);
    try {
      // Find and update preferences message
      const preferencesMessage: Message = {
        id: String(Date.now()),
        role: "user",
        content: `My website preferences:\n${formatPreferences()}`,
      };

      const prefIndex = messages.findIndex(
        (m: Message) =>
          m.role === "user" && m.content.startsWith("My website preferences:")
      );

      let updatedMessages;
      if (prefIndex !== -1) {
        // Update existing preferences
        updatedMessages = [...messages];
        updatedMessages[prefIndex] = preferencesMessage;
      } else {
        // Add preferences after greeting
        updatedMessages = [
          messages[0],
          preferencesMessage,
          ...messages.slice(1),
        ];
      }

      // Update messages with latest preferences
      setMessages(updatedMessages);

      // Now handle the actual chat submission
      await handleSubmit(e);
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setLocalIsLoading(false);
    }
  };

  const startWebsiteGeneration = async (newMessages?: Message[]) => {
    try {
      setIsProcessing(true);

      // Save chat
      const chatResponse = await fetch("/api/save_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          websiteID: websiteId,
          chat_conversation: newMessages || messages,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error("Failed to save chat");
      }

      const response = await fetch(
        `https://rapidsite-new.azurewebsites.net/api/start_website_generation?user_id=${user?.id}&website_id=${websiteId}&model=gemini-2.0-flash-001`,
        // `http://localhost:7071/api/code_website?user_id=${user?.id}&website_id=${params.website_id}&model=o1-mini`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate website");
      }

      router.push(`/dashboard/editor/${websiteId}`);
    } catch (error) {
      console.error("Error in website generation:", error);
      setIsProcessing(false);
      alert(
        "An error occurred while generating your website. Please try again."
      );
    }
  };

  const updateSidebarInfo = (content: string) => {
    // This is a simple example. You might want to use more sophisticated parsing.
    if (content.includes("color scheme")) {
      setColorScheme(generateRandomColors(3));
    }
    if (content.includes("industry")) {
      const industryMatch = content.match(/industry: (\w+)/);
      if (industryMatch) {
        setIndustry(industryMatch[1]);
      }
    }
    // Add more conditions to update other sidebar elements
  };

  const generateRandomColors = (count: number) => {
    return Array.from(
      { length: count },
      () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
  };

  const handleLogoUpload = async (file: File) => {
    try {
      // Log file details
      console.log("Starting logo upload with file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (!user?.id || !websiteId) {
        console.error("Missing IDs:", { userId: user?.id, websiteId });
        throw new Error("User ID or Website ID is missing");
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB");
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      // Create a blob from the file to ensure it's valid
      const blob = new Blob([file], { type: file.type });
      if (!blob.size) {
        throw new Error("Invalid file data");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${websiteId}/logo-${Date.now()}.${fileExt}`;

      console.log("Attempting to upload file:", fileName);

      // Check if bucket exists
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();
      console.log("Available buckets:", buckets);
      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError);
      }

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user_website_data")
        .upload(fileName, blob, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Storage upload error:", {
          error: uploadError,
          // code: uploadError.code,
          message: uploadError.message,
          // details: uploadError.details,
          // hint: uploadError.hint,
          // status: uploadError.status,
        });
        throw uploadError;
      }

      console.log("File uploaded successfully:", uploadData);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user_website_data").getPublicUrl(fileName);

      console.log("Generated public URL:", publicUrl);
      setLogo(publicUrl);
      toast.success("Logo uploaded successfully!");
    } catch (error: any) {
      console.error("Error in logo upload:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload logo"
      );
    }
  };

  const handleInspirationUpload = async (file: File) => {
    try {
      // Log file details
      console.log("Starting image upload with file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (!user?.id || !websiteId) {
        throw new Error("User ID or Website ID is missing");
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB");
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${
        user.id
      }/${websiteId}/images/img-${Date.now()}-${Math.random()}.${fileExt}`;

      console.log("Attempting to upload file:", fileName);

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user_website_data")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false, // Set to false to avoid overwriting
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully:", uploadData);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("user_website_data").getPublicUrl(fileName);

      console.log("Generated public URL:", publicUrl);
      setInspirationImages((prev) => [...prev, publicUrl]);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Error in image upload:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
  };

  const handleAddLink = (link: string) => {
    setInspirationLinks((prev) => [...prev, link]);
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.onstart = () => {
        setIsListening(true);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev: string) => prev + " " + transcript);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } else {
      alert(
        "Your browser doesn't support speech recognition. Please try a different browser."
      );
    }
  };

  const handleBuildWebsite = () => {
    setIsGenerating(true);
    setGenerationStartTime(Date.now());
    // startWebsiteGeneration();
  };

  const formatPreferences = () => {
    const parts = [];

    if (colorScheme.length > 0) {
      parts.push(`Color Scheme: ${colorScheme.join(", ")}`);
    }

    if (logo) {
      parts.push(`Logo URL: ${logo}`);
    }

    if (inspirationImages.length > 0) {
      parts.push(
        `Reference Images:\n${inspirationImages
          .map((url) => `- ${url}`)
          .join("\n")}`
      );
    }

    if (inspirationLinks.length > 0) {
      parts.push(
        `Reference Links:\n${inspirationLinks
          .map((url) => `- ${url}`)
          .join("\n")}`
      );
    }

    if (industry) {
      parts.push(`Industry: ${industry}`);
    }

    return parts.join("\n\n");
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsProcessing(true);
    try {
      // Create preferences message
      const preferencesMessage: Message = {
        id: String(Date.now()),
        role: "user",
        content: `My website preferences:\n${formatPreferences()}`,
      };

      const enhancedPrompt = `Please make a plan for the website of the user. A simple short plan detailing the website's purpose, pages, sections, design, color scheme, and any other relevant details. 1 page max.
    USER REQUEST: ${promptInput}`;

      // Create new messages array with preferences and prompt
      const newMessages: Message[] = [
        {
          id: "1",
          role: "assistant",
          content:
            "Hello! I'm your AI assistant. Let's create your dream website. To get started, could you tell me about your business and what kind of website you're looking for?",
        },
        preferencesMessage,
        {
          id: String(Date.now() + 1),
          role: "user",
          content: enhancedPrompt,
        },
      ];

      console.log(
        "Sending request to /api/prompt_chat with prompt:",
        promptInput
      );
      const response = await fetch("/api/prompt_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to get AI response: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      const aiResponse = data.text;

      console.log("Processed AI response:", aiResponse);

      if (!aiResponse) {
        throw new Error("Received empty content from AI");
      }

      // Add AI response to messages
      newMessages.push({
        id: String(Date.now() + 2),
        role: "assistant",
        content: aiResponse,
      });

      // Update messages state
      setMessages(newMessages);
      console.log("Updated messages:", newMessages);

      setShowBuildButton(true);
      setIsChatActive(false);
      updateSidebarInfo(aiResponse);

      // Start website generation with the new messages
      await startWebsiteGeneration(newMessages);
    } catch (error) {
      console.error("Error processing prompt:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`An error occurred while processing your prompt: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleColorSchemeChange = (colors: string[]) => {
    setColorScheme(colors);
  };

  // Add this new function to create the preferences message
  const addPreferencesMessage = () => {
    const preferences = {
      colorScheme,
      logo,
      inspirationImages,
      inspirationLinks,
      industry,
    };

    const formatPreferences = () => {
      const parts = [];

      if (colorScheme.length > 0) {
        parts.push(`Color Scheme: ${colorScheme.join(", ")}`);
      }

      if (logo) {
        parts.push(`Logo URL: ${logo}`);
      }

      if (inspirationImages.length > 0) {
        parts.push(
          `Reference Images:\n${inspirationImages
            .map((url) => `- ${url}`)
            .join("\n")}`
        );
      }

      if (inspirationLinks.length > 0) {
        parts.push(
          `Reference Links:\n${inspirationLinks
            .map((url) => `- ${url}`)
            .join("\n")}`
        );
      }

      if (industry) {
        parts.push(`Industry: ${industry}`);
      }

      return parts.join("\n\n");
    };

    const newMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: `My website preferences:\n${formatPreferences()}`,
    };

    // Find and update existing preferences message or add new one
    const prefIndex = messages.findIndex(
      (m: Message) =>
        m.role === "user" && m.content.startsWith("My website preferences:")
    );

    if (prefIndex !== -1) {
      const newMessages = [...messages];
      newMessages[prefIndex] = newMessage;
      setMessages(newMessages);
    } else {
      setMessages((prev: Message[]) => [newMessage, ...prev]);
    }
  };

  // Add toggleChatMode function to easily switch between modes
  const toggleChatMode = () => {
    const newMode = chatMode === "prompt" ? "conversation" : "prompt";
    console.log("Toggling chat mode from", chatMode, "to", newMode);
    setChatMode(newMode);
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    console.log("Toggling debug mode from", debugMode, "to", !debugMode);
    setDebugMode(!debugMode);
  };

  return (
    <div className="flex flex-col bg-[#0A0A0A] w-full h-screen overflow-hidden relative">
      <div className="flex-1 flex z-10">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Navigation */}
          <div className="border-b border-neutral-800 flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <span className="ml-2 text-lg font-semibold">
                Website Generator
              </span>
            </div>

            <div className="flex items-center gap-2">
              {showBuildButton && !isGenerating && !isProcessing && (
                <Button
                  onClick={handleBuildWebsite}
                  className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white"
                >
                  Build Website
                </Button>
              )}
            </div>
          </div>

          {/* Fixed UI elements */}
          {/* Mode switcher button with higher z-index */}
          <div className="fixed right-8 top-24 z-[100]">
            <Button
              onClick={toggleChatMode}
              className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-medium shadow-lg"
            >
              {chatMode === "prompt"
                ? "Switch to Chat Mode"
                : "Switch to Prompt Mode"}
            </Button>
          </div>

          {/* Debug button */}
          <div className="fixed right-8 top-40 z-[100]">
            <Button
              onClick={toggleDebugMode}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-lg"
            >
              {debugMode ? "Disable Debug" : "Enable Debug"}
            </Button>
          </div>

          {/* Debug overlay to highlight z-index issues */}
          {debugMode && (
            <div className="fixed inset-0 pointer-events-none z-[5]">
              <div className="absolute inset-0 bg-red-500 bg-opacity-10 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 p-4 rounded text-white">
                  Debug Mode: Highlighting all layers
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex">
            {/* Sidebar */}
            <Sidebar
              colorScheme={colorScheme}
              logo={logo}
              inspirationImages={inspirationImages}
              inspirationLinks={inspirationLinks}
              industry={industry}
              onLogoUpload={handleLogoUpload}
              onInspirationUpload={handleInspirationUpload}
              onAddLink={handleAddLink}
              onIndustryChange={setIndustry}
              onColorSchemeChange={handleColorSchemeChange}
            />

            {/* Main content */}
            <div className="flex-1 relative">
              {isGenerating ? (
                <div className="absolute inset-0">
                  <GenerationExperience
                    websiteData={{
                      websiteName: "SaaS App",
                      designPreferences: {
                        colorScheme: {
                          primaryColors: colorScheme,
                          accentColors: ["#F9FAFB", "#F3F4F6", "#E5E7EB"],
                        },
                      },
                      websiteStructure: {
                        pages: [
                          {
                            name: "Home",
                            sections: [
                              {
                                sectionName: "Hero Section",
                                contentType: "hero",
                              },
                              {
                                sectionName: "Features Section",
                                contentType: "features",
                              },
                              {
                                sectionName: "Testimonials",
                                contentType: "testimonials",
                              },
                              {
                                sectionName: "Pricing",
                                contentType: "pricing",
                              },
                              { sectionName: "Footer", contentType: "footer" },
                            ],
                          },
                          {
                            name: "Features",
                            sections: [
                              {
                                sectionName: "Features Overview",
                                contentType: "features",
                              },
                              {
                                sectionName: "Feature Details",
                                contentType: "content",
                              },
                            ],
                          },
                        ],
                      },
                      contentRequirements: {
                        features: [
                          {
                            title: "Easy Integration",
                            description:
                              "Seamlessly connect with your existing tools",
                          },
                          {
                            title: "Advanced Security",
                            description:
                              "Enterprise-grade security for your peace of mind",
                          },
                          {
                            title: "Lightning Fast",
                            description:
                              "Optimized performance for speed and reliability",
                          },
                          {
                            title: "Time-Saving",
                            description:
                              "Automate workflows and save valuable time",
                          },
                        ],
                        testimonials: [
                          {
                            name: "John Smith",
                            role: "CEO, TechCorp",
                            quote:
                              "This solution transformed our business operations completely.",
                          },
                          {
                            name: "Sarah Lee",
                            role: "CMO, GrowthCo",
                            quote:
                              "We've seen a 200% increase in productivity since implementing this platform.",
                          },
                          {
                            name: "Michael Chen",
                            role: "CTO, Innovate Inc",
                            quote:
                              "The technical support and robust features are unmatched in the market.",
                          },
                        ],
                        integrations: [
                          { name: "Slack", icon: "slack" },
                          { name: "GitHub", icon: "github" },
                          { name: "Dropbox", icon: "cloud" },
                          { name: "Google Drive", icon: "drive" },
                          { name: "Notion", icon: "file-text" },
                          { name: "Trello", icon: "trello" },
                        ],
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1 overflow-auto">
                  {chatMode === "conversation" ? (
                    <ChatInterface
                      messages={messages}
                      input={input}
                      onInputChange={handleInputChange}
                      onSubmit={customHandleSubmit}
                      isLoading={localIsLoading || isLoading || isProcessing}
                      onVoiceInput={handleVoiceInput}
                      isListening={isListening}
                      isChatActive={isChatActive}
                    />
                  ) : (
                    <form
                      onSubmit={handlePromptSubmit}
                      className="h-full flex flex-col p-6"
                    >
                      <div className="flex-1 overflow-y-auto mb-6">
                        <div className="max-w-3xl mx-auto p-8 bg-card border rounded-lg shadow-sm">
                          <h2 className="text-2xl font-bold mb-4">
                            What would you like to build?
                          </h2>
                          <p className="text-muted-foreground mb-6">
                            Describe your website in detail. The more
                            information you provide, the better we can tailor
                            your website to your needs.
                          </p>
                          <div className="relative w-full">
                            <textarea
                              className="w-full h-64 p-4 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="For example: I need a professional e-commerce website for my handmade jewelry business. It should have a modern, elegant design with a light color scheme. I want to showcase my products with high-quality images and include customer testimonials. I need pages for Shop, About, Contact, and a Blog."
                              value={promptInput}
                              onChange={(e) => setPromptInput(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white px-8 py-2 rounded-md"
                          disabled={isProcessing || !promptInput.trim()}
                        >
                          {isProcessing ? "Processing..." : "Generate Website"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DashboardBackground />
    </div>
  );
}
