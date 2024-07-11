"use client";

// import { type CoreMessage } from "ai";
// import { useState, useEffect } from "react";
// import { continueConversation } from "@/app/actions";
// import { readStreamableValue } from "ai/rsc";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";

// export const dynamic = "force-dynamic";
// export const maxDuration = 30;

// export default async function Chat({
//   params,
// }: {
//   params: { website_id: string };
// }) {
//   const supabase = createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const router = useRouter();
//   const [messages, setMessages] = useState<CoreMessage[]>([]);
//   const [input, setInput] = useState("");
//   if (!user) {
//     return router.push("/login");
//   }

import { type CoreMessage } from "ai";
import { useState, useEffect } from "react";
import { continueConversation } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat({ params }: { params: { website_id: string } }) {
  const supabase = createClient();
  const router = useRouter();
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<User | null>(null);

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

  // ff
  // ff

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content as string}
        </div>
      ))}

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
              const response = fetch("/api/save_chat", {
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
              return router.push("/dashboard");
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
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
