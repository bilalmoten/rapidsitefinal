// api/process-conversation/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { messages, website_id } = await req.json();

    // For now, just log the messages. Later, you can replace this with another LLM call.
    console.log("Processing conversation for website:", website_id);
    console.log(messages);

    // Dummy response
    return NextResponse.json({ message: "Conversation processed" });
}