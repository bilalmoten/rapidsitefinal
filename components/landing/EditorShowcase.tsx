// "use client";

// import { useRef, useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Bot,
//   Sparkles,
//   Send,
//   PenTool,
//   Globe,
//   Copy,
//   RefreshCw,
//   Monitor,
//   Tablet,
//   Smartphone,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Confetti from "@/components/ui/confetti";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import { toast } from "sonner";

// // Define the base message type
// interface ChatMessage {
//   role: "ai" | "user";
//   content: string;
// }

// // Define our Message type that extends it
// interface Message extends ChatMessage {
//   isComplete: boolean;
//   displayedContent: string; // For typing animation
// }

// // Define the chat sequence
// const chatSequence: ChatMessage[] = [
//   {
//     role: "ai",
//     content: "Hi! I'm your AI assistant. What would you like to build today?",
//   },
//   {
//     role: "user",
//     content:
//       "I need a hero section for my SaaS website. Something modern with gradients and floating elements.",
//   },
//   {
//     role: "ai",
//     content:
//       "I can help with that! A few quick questions:\n1. Any specific color scheme in mind?\n2. Would you like a prominent CTA button?\n3. Should we include product screenshots?",
//   },
//   {
//     role: "user",
//     content:
//       "I'd like purple and blue gradients, yes to the CTA, and maybe some floating 3D elements instead of screenshots.",
//   },
//   {
//     role: "ai",
//     content:
//       "Perfect! I'll create a hero section with:\n- Purple to blue gradient background\n- Large headline with gradient text\n- Engaging subheadline\n- Prominent CTA button\n- Floating 3D elements for visual interest\n\nShall I start generating?",
//   },
//   {
//     role: "user",
//     content: "Yes, that sounds exactly what I need!",
//   },
//   {
//     role: "ai",
//     content: "Great! Starting the generation process now...",
//   },
// ];

// // Define workflow states
// type WorkflowState = "chat" | "generating" | "confetti" | "editing";

// const TYPING_SPEED_AI = 30; // milliseconds per character for AI
// const TYPING_SPEED_USER = 50; // milliseconds per character for User

// // Add these new types and interfaces
// type EditingMode = "manual" | "ai" | null;
// type EditingState = "selecting" | "editing" | "processing" | "complete" | null;

// interface EditRequest {
//   element: string;
//   content: string;
//   request?: string;
// }

// // Add ChatMessage component
// const ChatMessage = ({
//   message,
//   isTyping,
//   progress,
// }: {
//   message: ChatMessage;
//   isTyping: boolean;
//   progress: number;
// }) => {
//   const displayContent = isTyping
//     ? message.content.slice(0, Math.floor(message.content.length * progress))
//     : message.content;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`flex ${
//         message.role === "ai" ? "justify-start" : "justify-end"
//       }`}
//     >
//       {message.role === "ai" && (
//         <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-2">
//           <Bot className="w-4 h-4 text-cyan-500" />
//         </div>
//       )}
//       <div
//         className={cn(
//           "max-w-[80%] rounded-lg p-3",
//           message.role === "ai"
//             ? "bg-gray-800/50 text-gray-200"
//             : "bg-cyan-500/20 text-gray-200"
//         )}
//       >
//         <p className="text-sm whitespace-pre-line">{displayContent}</p>
//       </div>
//     </motion.div>
//   );
// };

// // Add GeneratingInterface component
// const GeneratingInterface = ({
//   progress,
//   showConfetti,
// }: {
//   progress: number;
//   showConfetti: boolean;
// }) => {
//   return (
//     <motion.div className="h-[600px] bg-[#0F1729] rounded-lg overflow-hidden border border-cyan-500/20 flex items-center justify-center">
//       <div className="text-center space-y-6">
//         <Sparkles className="w-12 h-12 text-cyan-500 mx-auto animate-spin" />
//         <p className="text-cyan-500">Generating your website...</p>
//         <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
//           <motion.div
//             className="h-full bg-gradient-to-r from-cyan-500 to-violet-700"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//         <p className="text-gray-500">{Math.floor(progress)}%</p>
//       </div>
//       {showConfetti && <Confetti />}
//     </motion.div>
//   );
// };

// // Add EditorInterface component
// const EditorInterface = ({
//   progress,
//   showManualEdit,
//   showAIEdit,
// }: {
//   progress: number;
//   showManualEdit: boolean;
//   showAIEdit: boolean;
// }) => {
//   const [selectedElement, setSelectedElement] = useState<string | null>(null);
//   const [editingMode, setEditingMode] = useState<"manual" | "ai" | null>(null);

//   return (
//     <motion.div className="h-[600px] bg-[#0F1729] rounded-lg overflow-hidden border border-cyan-500/20 flex flex-col">
//       {/* Top Navigation - Updated to match software */}
//       <div className="h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex items-center justify-between px-4">
//         {/* Left: URL and actions */}
//         <div className="flex items-center gap-2 flex-1">
//           <div className="flex items-center gap-2 bg-black/20 rounded-md px-3 py-1.5 flex-1 max-w-md">
//             <Globe className="w-4 h-4 text-muted-foreground" />
//             <span className="text-sm text-muted-foreground">
//               yoursubdomain.aiwebsitebuilder.tech/
//             </span>
//             <span className="text-sm">page</span>
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={async () => {
//               await navigator.clipboard.writeText(
//                 "yoursubdomain.aiwebsitebuilder.tech/page"
//               );
//               toast.success("Copied to clipboard");
//             }}
//           >
//             <Copy className="w-4 h-4" />
//           </Button>
//           <Button variant="ghost" size="icon">
//             <RefreshCw className="w-4 h-4" />
//           </Button>
//         </div>

//         {/* Center: Viewport Controls */}
//         <TooltipProvider>
//           <div className="flex items-center rounded-lg border bg-background p-1 gap-1">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Monitor className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Desktop view</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Tablet className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Tablet view</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Smartphone className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Mobile view</TooltipContent>
//             </Tooltip>
//           </div>
//         </TooltipProvider>

//         {/* Right: Additional Actions */}
//         <div className="flex items-center gap-2 flex-1 justify-end">
//           <Button variant="outline" size="sm">
//             Preview
//           </Button>
//           <Button size="sm">Publish</Button>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 overflow-hidden">
//         {/* Website Section Preview */}
//         <div className="h-full p-4">
//           <div className="h-full rounded-lg border bg-black/20 overflow-hidden">
//             <div className="min-h-[600px] bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-8 relative">
//               <div className="max-w-6xl mx-auto relative z-10">
//                 <motion.h1
//                   className={cn(
//                     "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500",
//                     selectedElement === "heading" &&
//                       "ring-2 ring-cyan-500/50 rounded-lg"
//                   )}
//                   onClick={() => editingMode && setSelectedElement("heading")}
//                 >
//                   Transform Your Vision Into Reality
//                 </motion.h1>

//                 <motion.p
//                   className={cn(
//                     "text-xl text-gray-300 mt-4 max-w-2xl",
//                     selectedElement === "subheading" &&
//                       "ring-2 ring-cyan-500/50 rounded-lg"
//                   )}
//                   onClick={() =>
//                     editingMode && setSelectedElement("subheading")
//                   }
//                 >
//                   Elevate your digital presence with our cutting-edge SaaS
//                   solution. Experience innovation at its finest.
//                 </motion.p>

//                 <motion.button className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium">
//                   Get Started
//                 </motion.button>
//               </div>

//               {/* Floating Elements */}
//               <motion.div className="absolute inset-0">
//                 {[...Array(5)].map((_, i) => {
//                   const delay = i * 0.1;
//                   const startProgress = delay * 100;
//                   const elementProgress = Math.max(
//                     Math.min((progress - startProgress) * 2, 100),
//                     0
//                   );

//                   return (
//                     <motion.div
//                       key={i}
//                       className="absolute w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl"
//                       style={{
//                         top: `${25 + i * 15}%`,
//                         left: `${20 + i * 15}%`,
//                         opacity: elementProgress / 100,
//                         transform: `translate(${
//                           (1 - elementProgress / 100) * 50
//                         }px, ${(1 - elementProgress / 100) * 50}px)`,
//                       }}
//                     />
//                   );
//                 })}
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Action Bar */}
//       <div className="h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t flex items-center justify-between px-4">
//         <div className="flex items-center gap-2">
//           <Button
//             variant={editingMode === "manual" ? "secondary" : "ghost"}
//             size="sm"
//             onClick={() =>
//               setEditingMode(editingMode === "manual" ? null : "manual")
//             }
//             className="gap-2"
//           >
//             <PenTool className="w-4 h-4" />
//             Manual Edit
//           </Button>
//           <Button
//             variant={editingMode === "ai" ? "secondary" : "ghost"}
//             size="sm"
//             onClick={() => setEditingMode(editingMode === "ai" ? null : "ai")}
//             className="gap-2"
//           >
//             <Sparkles className="w-4 h-4" />
//             AI Edit
//           </Button>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" className="gap-2">
//             <Bot className="w-4 h-4" />
//             AI Assistant
//           </Button>
//         </div>
//       </div>

//       {/* AI Edit Popup */}
//       <AnimatePresence>
//         {showAIEdit && selectedElement && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 10 }}
//             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
//                      w-[400px] bg-[#0F1729] rounded-lg border border-cyan-500/20 p-4"
//           >
//             {/* ... AI edit popup content ... */}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default function EditorShowcase() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [scrollProgress, setScrollProgress] = useState(0);

//   // Chat state progress (0-30%)
//   const chatProgress = Math.min(scrollProgress * (100 / 30), 100);
//   // Generation state progress (30-60%)
//   const generationProgress = Math.max(
//     Math.min((scrollProgress - 30) * (100 / 30), 100),
//     0
//   );
//   // Editor state progress (60-100%)
//   const editorProgress = Math.max(
//     Math.min((scrollProgress - 60) * (100 / 40), 100),
//     0
//   );

//   // Calculate current state based on scroll
//   const currentState =
//     scrollProgress < 30
//       ? "chat"
//       : scrollProgress < 60
//       ? "generating"
//       : "editing";

//   // Update message progress calculations
//   const totalMessages = chatSequence.length;
//   const messageProgressStep = 100 / totalMessages;
//   const currentMessageIndex = Math.floor(chatProgress / messageProgressStep);
//   const currentMessageProgress =
//     (chatProgress % messageProgressStep) / messageProgressStep;

//   // Calculate if current message is AI and still typing
//   const isAITyping =
//     currentMessageIndex < totalMessages &&
//     chatSequence[currentMessageIndex]?.role === "ai" &&
//     currentMessageProgress < 1;

//   // Only show user input when AI message is complete AND next message is user
//   const shouldShowUserInput =
//     !isAITyping && // Important: Only when AI is done typing
//     currentMessageIndex < totalMessages - 1 &&
//     chatSequence[currentMessageIndex + 1]?.role === "user" &&
//     currentMessageProgress > 0.8;

//   // Refine the user message timing calculations
//   const isUserMessageNext =
//     currentMessageIndex < totalMessages - 1 &&
//     chatSequence[currentMessageIndex + 1]?.role === "user";

//   // Split user message progress into three phases: typing, sending, showing
//   const userMessageTiming = isUserMessageNext
//     ? {
//         isTyping:
//           currentMessageProgress >= 0.7 && currentMessageProgress < 0.85, // 70-85%: typing
//         isSending:
//           currentMessageProgress >= 0.85 && currentMessageProgress < 0.9, // 85-90%: sending
//         isShowing: currentMessageProgress >= 0.9, // 90-100%: showing in chat
//       }
//     : {
//         isTyping: false,
//         isSending: false,
//         isShowing: false,
//       };

//   // Calculate visible messages with updated timing
//   const visibleMessages = chatSequence
//     .slice(0, currentMessageIndex + 1)
//     .map((message, index) => {
//       if (index === currentMessageIndex) {
//         if (message.role === "ai") {
//           // AI messages stream in
//           return {
//             ...message,
//             progress: currentMessageProgress,
//           };
//         } else {
//           // User messages only appear after sending animation
//           return {
//             ...message,
//             progress: userMessageTiming.isShowing ? 1 : 0,
//           };
//         }
//       } else {
//         // Previous messages are complete
//         return {
//           ...message,
//           progress: 1,
//         };
//       }
//     });

//   // Calculate input typing progress
//   const inputTypingProgress = userMessageTiming.isTyping
//     ? (currentMessageProgress - 0.7) / 0.15 // Scale 0.7-0.85 to 0-1
//     : 0;

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!containerRef.current) return;

//       const { top, height } = containerRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;
//       const scrollPosition = -top;
//       const totalScrollable = height - windowHeight;

//       const progress = Math.max(
//         Math.min((scrollPosition / totalScrollable) * 100, 100),
//         0
//       );
//       setScrollProgress(progress);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <section ref={containerRef} className="relative bg-[#0A0118] min-h-[400vh]">
//       <div className="sticky top-0 h-screen flex items-center justify-center">
//         <div className="w-[1024px] mx-auto">
//           <AnimatePresence mode="wait">
//             {currentState === "chat" && (
//               <ChatInterface
//                 messages={visibleMessages}
//                 currentMessageIndex={currentMessageIndex}
//                 userMessageTiming={userMessageTiming}
//                 inputTypingProgress={inputTypingProgress}
//                 nextMessage={chatSequence[currentMessageIndex + 1]}
//               />
//             )}

//             {currentState === "generating" && (
//               <GeneratingInterface
//                 progress={generationProgress}
//                 showConfetti={generationProgress > 95}
//               />
//             )}

//             {currentState === "editing" && (
//               <EditorInterface
//                 progress={editorProgress}
//                 showManualEdit={editorProgress > 30}
//                 showAIEdit={editorProgress > 60}
//               />
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   );
// }

// // Split into separate components for clarity
// const ChatInterface = ({
//   messages,
//   currentMessageIndex,
//   userMessageTiming,
//   inputTypingProgress,
//   nextMessage,
// }: {
//   messages: (ChatMessage & { progress: number })[];
//   currentMessageIndex: number;
//   userMessageTiming: {
//     isTyping: boolean;
//     isSending: boolean;
//     isShowing: boolean;
//   };
//   inputTypingProgress: number;
//   nextMessage?: ChatMessage;
// }) => {
//   const [inputValue, setInputValue] = useState("");

//   // Update input based on new timing
//   useEffect(() => {
//     if (userMessageTiming.isTyping && nextMessage?.role === "user") {
//       // Type in input box
//       setInputValue(
//         nextMessage.content.slice(
//           0,
//           Math.floor(nextMessage.content.length * inputTypingProgress)
//         )
//       );
//     } else if (userMessageTiming.isSending) {
//       // Keep full message during sending
//       setInputValue(nextMessage?.content || "");
//     } else {
//       // Clear input otherwise
//       setInputValue("");
//     }
//   }, [userMessageTiming, inputTypingProgress, nextMessage]);

//   return (
//     <motion.div className="bg-[#0F1729] rounded-lg overflow-hidden border border-cyan-500/20 h-[600px]">
//       <div className="flex flex-col h-full">
//         <div className="flex-1 p-4 space-y-4 overflow-y-auto">
//           {messages.map((message, index) => (
//             <ChatMessage
//               key={index}
//               message={message}
//               isTyping={index === currentMessageIndex && message.role === "ai"}
//               progress={message.progress}
//             />
//           ))}
//         </div>
//         <div className="p-4 border-t border-cyan-500/20">
//           <div className="flex gap-2">
//             <Input
//               className="bg-black/20 border-cyan-500/20"
//               placeholder="Type your message..."
//               value={inputValue}
//               readOnly
//             />
//             <Button
//               variant="ghost"
//               size="icon"
//               className={cn(
//                 "transition-all duration-300",
//                 userMessageTiming.isTyping && "opacity-50",
//                 userMessageTiming.isSending && "scale-90 opacity-50"
//               )}
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Would you like me to continue with the GeneratingInterface and EditorInterface components?
