"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useInterval } from "react-use";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      }
    };

    checkUser();
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
        `https://api2.azurewebsites.net/api/code_website?user_id=${user?.id}&website_id=${websiteId}&model=gemini-2.0-flash-001`,
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
    // You can add any additional logic here for starting the website build process
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

  if (isProcessing || isGenerating) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full px-4">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">
          {isGenerating
            ? "Generating your website..."
            : "Processing your request..."}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This may take a few minutes. You'll be redirected when it's ready.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0 z-[0]">
        <DashboardBackground />
      </div>

      <div className="flex h-full z-20">
        <div className="flex-1 flex flex-col">
          <header className="relative z-20 border-b border-neutral-70 bg-neutral-90/50 backdrop-blur-xl p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/dashboard"
                        className="text-neutral-30 hover:text-neutral-10"
                      >
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-neutral-10">
                        Chat
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <h1 className="text-2xl font-bold text-neutral-10">
                AI Website Builder Chat
              </h1>
            </div>
          </header>

          {chatMode === "prompt" ? (
            <div className="flex-1 p-4 relative z-20">
              <div className="max-w-2xl mx-auto space-y-4">
                <form onSubmit={handlePromptSubmit} className="space-y-4">
                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Describe your website idea in a few sentences..."
                    className="w-full p-4 bg-neutral-90/50 backdrop-blur-sm border border-neutral-70 rounded-xl text-neutral-10 placeholder:text-neutral-40"
                    rows={4}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary-main text-neutral-90 hover:bg-primary-light"
                  >
                    Generate Website
                  </Button>
                </form>
                <Button
                  onClick={() => setChatMode("conversation")}
                  variant="outline"
                  className="w-full border-neutral-70 text-neutral-30 hover:text-neutral-10"
                >
                  Start a Detailed Conversation Instead
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="p-4 relative z-20 border-b border-neutral-70 bg-neutral-90/50 backdrop-blur-xl">
                <div className="max-w-2xl mx-auto">
                  <Button
                    onClick={() => setChatMode("prompt")}
                    variant="outline"
                    className="w-full border-neutral-70 text-neutral-30 hover:text-neutral-10"
                  >
                    Switch to Quick Prompt Mode
                  </Button>
                </div>
              </div>
              {/* <div className="flex-1"> */}
              <ChatInterface
                messages={messages}
                input={input}
                isLoading={isLoading || localIsLoading}
                isListening={isListening}
                onInputChange={handleInputChange}
                onSubmit={customHandleSubmit}
                onVoiceInput={handleVoiceInput}
                isChatActive={isChatActive}
              />
              {/* </div> */}
              {showBuildButton && (
                <div className="p-4 relative z-20 border-t border-neutral-70 bg-neutral-90/50 backdrop-blur-xl">
                  <div className="max-w-2xl mx-auto">
                    <Button
                      onClick={handleBuildWebsite}
                      className="w-full bg-primary-main text-neutral-90 hover:bg-primary-light"
                    >
                      Start Building My Website...
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
      </div>
    </div>
  );
}
