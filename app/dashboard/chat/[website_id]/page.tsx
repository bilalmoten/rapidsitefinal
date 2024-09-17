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

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat({ params }: { params: { website_id: string } }) {
  const supabase = createClient();
  const router = useRouter();
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
    },
  });
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

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push("/login");
      }
    })();
  }, [router]);

  useInterval(
    async () => {
      if (isGenerating) {
        const { data, error } = await supabase
          .from("websites")
          .select("status")
          .eq("id", params.website_id)
          .single();

        if (data && data.status === "completed") {
          setIsGenerating(false);
          router.push(`/dashboard/editor/${params.website_id}`);
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
      }
    },
    isGenerating ? 10000 : null
  );

  const [localIsLoading, setLocalIsLoading] = useState(false);

  const customHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isChatActive) return;

    console.log("Submitting message:", input);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => {
      console.log("Updated messages after user input:", [
        ...prevMessages,
        userMessage,
      ]);
      return [...prevMessages, userMessage];
    });
    setInput("");
    setLocalIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      let aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        console.log("Received chunk:", chunk);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0].delta.content) {
                const newContent = parsed.choices[0].delta.content;
                aiResponse += newContent;
                aiMessage.content += newContent;
                setMessages((prevMessages) => {
                  const updatedMessages = [
                    ...prevMessages.slice(0, -1),
                    { ...aiMessage },
                  ];
                  console.log(
                    "Updated messages after AI response:",
                    updatedMessages
                  );
                  return updatedMessages;
                });
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      console.log("Final AI response:", aiResponse);

      if (aiResponse.includes("EXIT")) {
        const cleanContent = aiResponse.replace("EXIT", "").trim();
        setShowBuildButton(true);
        setIsChatActive(false);
        startWebsiteGeneration();
        updateSidebarInfo(cleanContent);
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    } finally {
      setLocalIsLoading(false);
    }

    console.log("Messages after submission:", messages);
  };

  const startWebsiteGeneration = async () => {
    setIsProcessing(true);
    await fetch("/api/save_chat", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
        websiteID: params.website_id,
        chat_conversation: messages,
      }),
    });

    await fetch(
      `https://api2.azurewebsites.net/api/code_website?user_id=${user?.id}&website_id=${params.website_id}`,
      {
        method: "POST",
      }
    );
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
    reader.onload = (e) => setLogo(e.target?.result as string);
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

        <ChatInterface
          messages={messages as any}
          input={input}
          isLoading={localIsLoading}
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
