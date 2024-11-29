"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInterface } from "./ChatState";
import { GeneratingInterface } from "./GeneratingState";
import { EditorInterface } from "./EditorState";
import { chatSequence, ChatMessage } from "./types";

// Add this type at the top of the file
interface CustomEventMap {
  restartShowcase: CustomEvent<void>;
}

export default function EditorShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [key, setKey] = useState(0);

  // Chat state progress (0-30%)
  const chatProgress = Math.min(scrollProgress * (100 / 30), 100);
  // Generation state progress (30-60%)
  const generationProgress = Math.max(
    Math.min((scrollProgress - 30) * (100 / 30), 100),
    0
  );
  // Editor state progress (60-100%)
  const editorProgress = Math.max(
    Math.min((scrollProgress - 60) * (100 / 40), 100),
    0
  );

  // Calculate current state based on scroll
  const currentState =
    scrollProgress < 30
      ? "chat"
      : scrollProgress < 60
      ? "generating"
      : "editing";

  // Message calculations
  const totalMessages = chatSequence.length;
  const messageProgressStep = 100 / totalMessages;
  const currentMessageIndex = Math.floor(chatProgress / messageProgressStep);
  const currentMessageProgress =
    (chatProgress % messageProgressStep) / messageProgressStep;

  // Calculate if current message is AI and still typing
  const isAITyping =
    currentMessageIndex < totalMessages &&
    chatSequence[currentMessageIndex]?.role === "ai" &&
    currentMessageProgress < 1;

  // User message timing calculations
  const isUserMessageNext =
    currentMessageIndex < totalMessages - 1 &&
    chatSequence[currentMessageIndex + 1]?.role === "user";

  const userMessageTiming = isUserMessageNext
    ? {
        isTyping:
          currentMessageProgress >= 0.7 && currentMessageProgress < 0.85,
        isSending:
          currentMessageProgress >= 0.85 && currentMessageProgress < 0.9,
        isShowing: currentMessageProgress >= 0.9,
      }
    : {
        isTyping: false,
        isSending: false,
        isShowing: false,
      };

  // Calculate visible messages
  const visibleMessages = chatSequence
    .slice(0, currentMessageIndex + 1)
    .map((message, index) => {
      if (index === currentMessageIndex) {
        if (message.role === "ai") {
          return { ...message, progress: currentMessageProgress };
        } else {
          return { ...message, progress: userMessageTiming.isShowing ? 1 : 0 };
        }
      } else {
        return { ...message, progress: 1 };
      }
    });

  const inputTypingProgress = userMessageTiming.isTyping
    ? (currentMessageProgress - 0.7) / 0.15
    : 0;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollPosition = -top;
      const totalScrollable = height - windowHeight;

      const progress = Math.max(
        Math.min((scrollPosition / totalScrollable) * 100, 100),
        0
      );
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleRestart = () => {
      console.log("Restarting showcase..."); // Debug log
      // Reset scroll position
      window.scrollTo({
        top: containerRef.current?.offsetTop || 0,
        behavior: "smooth",
      });

      // Force re-render of all components
      setKey((prev) => prev + 1);
      setScrollProgress(0);
    };

    // Type the event listener
    window.addEventListener("restartShowcase", handleRestart as EventListener);
    return () =>
      window.removeEventListener(
        "restartShowcase",
        handleRestart as EventListener
      );
  }, []);

  return (
    <section
      ref={containerRef}
      id="showcase"
      className="relative bg-[#0A0118] min-h-[400vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="w-[1024px] mx-auto">
          <AnimatePresence mode="wait">
            {currentState === "chat" && (
              <ChatInterface
                key={`chat-${key}`}
                messages={visibleMessages}
                currentMessageIndex={currentMessageIndex}
                userMessageTiming={userMessageTiming}
                inputTypingProgress={inputTypingProgress}
                nextMessage={chatSequence[currentMessageIndex + 1]}
              />
            )}

            {currentState === "generating" && (
              <GeneratingInterface
                key={`generating-${key}`}
                progress={generationProgress}
                showConfetti={generationProgress > 95}
              />
            )}

            {currentState === "editing" && (
              <EditorInterface
                key={`editing-${key}`}
                progress={editorProgress}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
