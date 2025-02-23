import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Import at the top
import TypingAnimation from "@/components/ui/typing-animation";

import {
  PenTool,
  Globe,
  Copy,
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  Bot,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Cursor } from "./Cursor";
import { Input } from "@/components/ui/input";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { BorderBeam } from "@/components/ui/border-beam";

export const EditorInterface = ({ progress }: { progress: number }) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingMode, setEditingMode] = useState<"manual" | "ai" | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  const [showAIPopup, setShowAIPopup] = useState(false);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  //   const [content, setContent] = useState({
  //     heading: "Transform Your Vision Into Reality",
  //     subheading:
  //       "Elevate your digital presence with our cutting-edge SaaS solution.",
  //   });
  // Update the content state type to accept React elements
  const [content, setContent] = useState<{
    heading: string | React.ReactNode;
    subheading: string;
  }>({
    heading: "Transform Your Vision Into Reality",
    subheading:
      "Elevate your digital presence with our cutting-edge SaaS solution.",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Add state for background style
  const [backgroundStyle, setBackgroundStyle] = useState<"gradient" | "grid">(
    "gradient"
  );

  // Move aiEditContent inside component
  const [aiEditContent] = useState({
    request:
      "Make it more futuristic:\n" +
      "Add a glowing border to the CTA, change the background to a darker theme with animated grid, and make the CTA more engaging.",
    newCTAText: "Start Building for Free",
  });

  // Add ctaStyle state
  const [ctaStyle, setCtaStyle] = useState<"gradient" | "beam">("gradient");

  // Move renderCTA inside component
  const renderCTA = () => {
    if (ctaStyle === "beam") {
      return (
        <div className="relative mt-8 inline-block">
          <button className="relative px-8 py-3 bg-black/40 text-white font-medium rounded-lg">
            {aiEditContent.newCTAText}
            <BorderBeam />
          </button>
        </div>
      );
    }
    return (
      <motion.button className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium">
        Get Started
      </motion.button>
    );
  };

  // Update the AI Edit Popup content
  //   const AIEditPopup = () => (
  //     <motion.div
  //       initial={{ opacity: 0, y: 10 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       exit={{ opacity: 0, y: 10 }}
  //       className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  //                w-[400px] bg-[#0F1729] rounded-lg border border-cyan-500/20 p-4"
  //     >
  //       <div className="space-y-4">
  //         <div className="space-y-2">
  //           <h3 className="text-sm font-medium">AI Edit Request</h3>
  //           <div className="w-full p-3 bg-black/20 rounded-lg text-sm text-gray-300 whitespace-pre-line">
  //             {aiEditContent.request}
  //           </div>
  //         </div>
  //         {isProcessing && (
  //           <div className="flex items-center gap-2 text-sm text-muted-foreground">
  //             <Loader2 className="w-4 h-4 animate-spin" />
  //             Processing request...
  //           </div>
  //         )}
  //       </div>
  //     </motion.div>
  //   );

  //   useEffect(() => {
  //     console.log("Debug States:", {
  //       editingMode,
  //       selectedElement,
  //       showAIPopup,
  //     });
  //   }, [editingMode, selectedElement, showAIPopup]);

  // Start animation sequence when editor appears
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const sequence = [
      // Manual Edit Sequence
      {
        delay: 1000,
        action: () => {
          setCursorPosition({ x: 80, y: 565 }); // Move to Manual Edit button
        },
      },
      {
        delay: 2000,
        action: () => {
          setIsClicking(true);
          setEditingMode("manual");
        },
      },
      {
        delay: 2300,
        action: () => {
          setIsClicking(false);
          setCursorPosition({ x: 200, y: 130 }); // Move to heading
        },
      },
      {
        delay: 3000,
        action: () => {
          setIsClicking(true);
          setSelectedElement("heading");
        },
      },
      // Instead of showing popup, simulate inline editing
      //   {
      //     delay: 3300,
      //     action: () => {
      //       setIsClicking(false);
      //       setContent((prev) => ({
      //         ...prev,
      //         heading: "Build Your |", // Show cursor
      //       }));
      //     },
      //   },
      //   {
      //     delay: 3600,
      //     action: () => {
      //       setContent((prev) => ({
      //         ...prev,
      //         heading: "Build Your Dream |",
      //       }));
      //     },
      //   },
      //   {
      //     delay: 3900,
      //     action: () => {
      //       setContent((prev) => ({
      //         ...prev,
      //         heading: "Build Your Dream Website |",
      //       }));
      //     },
      //   },
      //   {
      //     delay: 4200,
      //     action: () => {
      //       setContent((prev) => ({
      //         ...prev,
      //         heading: "Build Your Dream Website Today",
      //       }));
      //       setSelectedElement(null);
      //     },
      //   },
      // Replace the multiple typing states with just one state:
      {
        delay: 3300,
        action: () => {
          setIsClicking(false);
          setContent((prev) => ({
            ...prev,
            heading: (
              <TypingAnimation
                text="Build Your Dream Website Today"
                duration={50}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 text-left"
              />
            ),
          }));

          setTimeout(() => setSelectedElement(null), 2000);
        },
      },
      {
        delay: 4800,
        action: () => {
          setIsClicking(false);
          setContent((prev) => ({
            ...prev,
            heading: "Build Your Dream Website Today",
          }));
          // Set a timeout to clear selection after animation
          setSelectedElement(null);
        },
      },
      // AI Edit Sequence - now with multiple changes
      {
        delay: 5000,
        action: () => {
          setCursorPosition({ x: 160, y: 560 });
        },
      },
      {
        delay: 5500,
        action: () => {
          setIsClicking(true);
          setEditingMode("ai");
        },
      },
      {
        delay: 5800,
        action: () => {
          setIsClicking(false);
          setCursorPosition({ x: 300, y: 250 });
          setSelectedElement("section");
        },
      },
      //   {
      //     delay: 6300,
      //     action: () => {
      //       setIsClicking(true);
      //       setTimeout(() => setShowAIPopup(true), 300); // 300ms delay after click
      //     },
      //   },
      {
        delay: 6300,
        action: () => {
          setIsClicking(true);
          setSelectedElement("section"); // Set selected element
          setTimeout(() => setShowAIPopup(true), 300);
        },
      },
      {
        delay: 9000,
        action: () => {
          setIsClicking(false);
          setIsProcessing(true);
        },
      },
      {
        delay: 10500,
        action: () => {
          setIsProcessing(false);
          setBackgroundStyle("grid");
          setCtaStyle("beam");
          setContent((prev) => ({
            ...prev,
            subheading:
              "Experience the future of web design with AI-powered tools. Create stunning websites in minutes.",
          }));
        },
      },
      {
        delay: 11000,
        action: () => {
          setShowAIPopup(false);
          setSelectedElement(null);
          setEditingMode(null);
        },
      },
      {
        delay: 12000,
        action: () => {
          setCursorPosition({ x: 980, y: 30 }); // Position for publish button
        },
      },
      {
        delay: 12500,
        action: () => {
          setIsClicking(true);
          setTimeout(() => {
            setShowPublishPopup(true);
            setIsClicking(false);
          }, 300);
        },
      },
      {
        delay: 13000,
        action: () => {
          setShowRestartButton(true);
        },
      },
    ];

    // Run sequence
    sequence.forEach(({ delay, action }) => {
      const timeout = setTimeout(action, delay);
      timeouts.push(timeout);
    });

    // Cleanup
    return () => timeouts.forEach(clearTimeout);
  }, []); // Run once when mounted

  // Update the content rendering to handle inline editing
  const renderContent = (content: string, isEditing: boolean) => {
    if (isEditing) {
      return (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-b-2 border-cyan-500"
        >
          {content}
        </motion.span>
      );
    }
    return content;
  };

  // Update the background rendering
  const renderBackground = () => {
    if (backgroundStyle === "grid") {
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
          <AnimatedGridPattern
            className={cn(
              "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 opacity-60"
            )}
            maxOpacity={0.3}
          />
        </>
      );
    }
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
    );
  };

  // Add this with other state declarations at the top of EditorInterface component
  const [showRestartButton, setShowRestartButton] = useState(false);

  return (
    <motion.div className="h-[600px] bg-[#0F1729] rounded-lg overflow-hidden border border-cyan-500/20 flex flex-col relative">
      {/* Top Navigation - Updated to match software */}
      <div className="h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex items-center justify-between px-4">
        {/* Left: URL and actions */}
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 bg-black/20 rounded-md px-3 py-1.5 flex-1 max-w-md">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              yoursubdomain.rapidai.website/
            </span>
            <span className="text-sm">page</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await navigator.clipboard.writeText(
                "yoursubdomain.rapidai.website/page"
              );
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Center: Viewport Controls */}
        <TooltipProvider>
          <div className="flex items-center rounded-lg border bg-background p-1 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desktop view</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Tablet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablet view</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smartphone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile view</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Right: Additional Actions */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Button variant="outline" size="sm">
            Preview
          </Button>
          <Button size="sm">Publish</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Website Section Preview */}
        <div className="h-full p-4">
          <div className="h-full rounded-lg border bg-black/20 overflow-hidden">
            <div className="min-h-[600px] relative p-8">
              {renderBackground()}
              {/* <FloatingElements /> */}

              {/* Content */}
              <div className="max-w-6xl mx-auto relative z-10">
                <motion.h1
                  className={cn(
                    "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500",
                    selectedElement === "heading" &&
                      "ring-2 ring-cyan-500/50 rounded-lg"
                  )}
                >
                  {renderContent(
                    content.heading as string,
                    selectedElement === "heading" && editingMode === "manual"
                  )}
                </motion.h1>

                <motion.p
                  className={cn(
                    "text-xl text-gray-300 mt-4 max-w-2xl",
                    selectedElement === "subheading" &&
                      "ring-2 ring-cyan-500/50 rounded-lg"
                  )}
                >
                  {content.subheading}
                </motion.p>

                {renderCTA()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant={editingMode === "manual" ? "secondary" : "ghost"}
            size="sm"
            onClick={() =>
              setEditingMode(editingMode === "manual" ? null : "manual")
            }
            className="gap-2"
          >
            <PenTool className="w-4 h-4" />
            Manual Edit
          </Button>
          <Button
            variant={editingMode === "ai" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setEditingMode(editingMode === "ai" ? null : "ai")}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Edit
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Bot className="w-4 h-4" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Update AI Edit Popup content */}
      <AnimatePresence>
        {editingMode === "ai" && selectedElement && showAIPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     w-[400px] bg-[#0F1729] rounded-lg border border-cyan-500/20 p-4"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">AI Edit Request</h3>
                <div className="w-full p-3 bg-black/20 rounded-lg text-sm text-gray-300 whitespace-pre-line">
                  <TypingAnimation
                    text={aiEditContent.request}
                    duration={10}
                    className="text-sm text-gray-300 whitespace-pre-line text-left"
                  />
                </div>
              </div>
              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing request...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add cursor */}
      <Cursor
        position={cursorPosition}
        clicking={isClicking}
        className="absolute"
      />

      <AnimatePresence>
        {showPublishPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center z-40 bg-black/20 backdrop-blur-sm"
          >
            <div className="w-[400px] bg-[#0F1729] rounded-lg border border-cyan-500/20 p-6 text-center relative">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Your Site is Live! 🎉</h3>
                <p className="text-sm text-gray-400">
                  Your website has been successfully published and is now
                  accessible at
                </p>
                <div className="flex items-center justify-center gap-2 bg-black/20 rounded-md px-3 py-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    landingdemo.rapidai.website/page
                  </span>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "https://landingdemo.rapidai.website/page",
                        "_blank"
                      )
                    }
                  >
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        "https://landingdemo.rapidai.website/page"
                      );
                      toast.success("URL copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restart Button */}
      <AnimatePresence>
        {showRestartButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4 z-50"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                console.log("Restart button clicked");
                const event = new CustomEvent("restartShowcase");
                window.dispatchEvent(event);
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Restart Demo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
