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
import Sidebar from "@/components/Sidebar";
import { useChat, Message } from "ai/react";
import React from "react";

interface ChatPageProps {
  params: Promise<{ website_id: string }>;
}

export default function ChatPage(props: ChatPageProps) {
  const params = React.use(props.params);
  const websiteId = params.website_id;

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
    onResponse: (response) => {
      console.log("Response from AI:", response);
    },
    onFinish: (message) => {
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
        // `https://api2.azurewebsites.net/api/code_website?user_id=${user?.id}&website_id=${websiteId}&model=o1-mini`,
        `http://localhost:7071/api/code_website?user_id=${user?.id}&website_id=${params.website_id}&model=o1-mini`,
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

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setLogo(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInspirationUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      setInspirationImages((prev) => [...prev, e.target?.result as string]);
    reader.readAsDataURL(file);
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

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsProcessing(true);
    try {
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

      const enhancedPrompt = `Please make a plan for the website of the user. A simple short plan detailing the website's purpose, pages, sections, design, color scheme, and any other relevant details. 1 page max.
    USER REQUEST: ${promptInput}`;

      // Create new messages array with correct types
      const newMessages: Message[] = [
        // ...messages,
        {
          id: "1",
          role: "assistant",
          content:
            "Hello! I'm your AI assistant. Let's create your dream website. To get started, could you tell me about your business and what kind of website you're looking for?",
        },
        { id: "2", role: "user", content: enhancedPrompt },
        {
          id: "3",
          role: "assistant",
          content: aiResponse,
        },
      ];

      // Update messages state
      setMessages(newMessages);

      console.log("Updated messages:", messages);

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

  if (isProcessing || isGenerating) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full px-4">
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              href="/dashboard"
              className="flex items-center text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">AI Website Builder Chat</h1>
          </div>
        </header>

        {chatMode === "prompt" ? (
          <div className="flex-1 p-4">
            <form onSubmit={handlePromptSubmit} className="space-y-4">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe your website idea in a few sentences..."
                className="w-full p-2 border rounded-md"
                rows={4}
              />
              <Button type="submit" className="w-full">
                Generate Website
              </Button>
            </form>
            <Button
              onClick={() => setChatMode("conversation")}
              variant="outline"
              className="w-full mt-4"
            >
              Start a Detailed Conversation Instead
            </Button>
          </div>
        ) : (
          <>
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
            {showBuildButton && (
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={handleBuildWebsite} className="w-full">
                  Start Building My Website...
                </Button>
              </div>
            )}
          </>
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
      />
    </div>
  );
}
