"use client";

import { type CoreMessage } from "ai";
import { useState, useEffect } from "react";
import { continueConversation } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useInterval } from "react-use";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat({ params }: { params: { website_id: string } }) {
  const supabase = await createClient();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );

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
  }, []);

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
          // If more than 2 minutes have passed
          setIsGenerating(false);
          alert(
            "Your website is taking longer than expected to generate. We'll email you when it's ready."
          );
          router.push("/dashboard");
        }
      }
    },
    isGenerating ? 10000 : null // Check every 10 seconds if generating
  );

  if (isLoading || isGenerating) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full px-4">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">
          {isGenerating ? "Generating your website..." : "Loading..."}
        </p>
        {isGenerating && (
          <p className="mt-2 text-sm text-gray-500">
            This may take a few minutes. You'll be redirected when it's ready.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto py-8 px-4 min-h-screen">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className="whitespace-pre-wrap mb-2">
            <span className="font-bold">
              {m.role === "user" ? "User: " : "AI: "}
            </span>
            {m.content as string}
          </div>
        ))}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: "user" },
          ];

          setMessages(newMessages);
          setInput("");

          const result = await continueConversation(newMessages);

          for await (const content of readStreamableValue(result)) {
            if (content === "EXIT") {
              setIsLoading(true);
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

              setIsGenerating(true);
              setGenerationStartTime(Date.now());
              setIsLoading(false);

              await fetch(
                `https://api2.azurewebsites.net/api/code_website?user_id=${user?.id}&website_id=${params.website_id}`,
                {
                  method: "POST",
                }
              );
            }
            setMessages([
              ...newMessages,
              {
                role: "assistant",
                content: content as string,
              },
            ]);
          }
        }}
        className="sticky bottom-0 w-full bg-white pb-8"
      >
        <input
          className="w-full p-3 border border-gray-300 rounded shadow-lg"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
