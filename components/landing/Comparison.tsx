"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone, Maximize, UserPlus } from "lucide-react";

// Define hotspots for both modes - each hotspot now has a scrollPosition
const expressHotspots = [
  {
    id: "express-speed",
    x: 45,
    y: 10,
    scrollPosition: 0,
    label: "Rapid 2-minute generation",
    description: "Get your website in just 2 minutes",
  },
  {
    id: "express-layout",
    x: 55,
    y: 40,
    scrollPosition: 200,
    label: "Clean, professional design",
    description: "Well-structured layouts ready to use",
  },
  {
    id: "express-responsive",
    x: 20,
    y: 60,
    scrollPosition: 400,
    label: "Responsive and functional",
    description: "Works on all devices out of the box",
  },
  {
    id: "express-content",
    x: 75,
    y: 70,
    scrollPosition: 500,
    label: "Ready-to-use content",
    description: "Pre-populated with relevant text",
  },
];

const proHotspots = [
  {
    id: "pro-imagery",
    x: 50,
    y: 15,
    scrollPosition: 0,
    label: "Custom imagery integration",
    description: "Your uploaded images perfectly placed",
  },
  {
    id: "pro-animations",
    x: 35,
    y: 35,
    scrollPosition: 200,
    label: "Sophisticated animations",
    description: "Engaging motion and interactions",
  },
  {
    id: "pro-content",
    x: 65,
    y: 55,
    scrollPosition: 400,
    label: "Tailored content",
    description: "Text customized to your specific needs",
  },
  {
    id: "pro-design",
    x: 30,
    y: 70,
    scrollPosition: 500,
    label: "Enhanced design elements",
    description: "More refined UI with better spacing and typography",
  },
  {
    id: "pro-colors",
    x: 75,
    y: 85,
    scrollPosition: 600,
    label: "Brand-aligned colors",
    description: "Consistent color scheme based on your preferences",
  },
];

// Example conversation snippets
const conversationSnippets = [
  {
    role: "ai",
    content: "What's the primary audience for your website?",
  },
  {
    role: "user",
    content:
      "Professional photographers looking for high-quality portfolio services",
  },
  {
    role: "ai",
    content: "What colors would you like to use for your brand identity?",
  },
  {
    role: "user",
    content: "Dark grey/black with gold accents to convey luxury",
  },
  {
    role: "ai",
    content: "Do you have any specific images you'd like to include?",
  },
  {
    role: "user",
    content: "Yes, I've uploaded 5 sample photos from my portfolio",
  },
];

export default function Comparison() {
  const [activeExpressHotspot, setActiveExpressHotspot] = useState<
    string | null
  >(null);
  const [activeProHotspot, setActiveProHotspot] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  // Track visible hotspots based on scroll position
  const [expressScrollPosition, setExpressScrollPosition] = useState(0);
  const [proScrollPosition, setProScrollPosition] = useState(0);

  const expressRef = useRef<HTMLIFrameElement>(null);
  const proRef = useRef<HTMLIFrameElement>(null);
  const expressContainerRef = useRef<HTMLDivElement>(null);
  const proContainerRef = useRef<HTMLDivElement>(null);
  const expressWrapperRef = useRef<HTMLDivElement>(null);
  const proWrapperRef = useRef<HTMLDivElement>(null);

  // Helper functions for setting iframe styles
  const setIframeDesktopView = () => {
    if (expressRef.current && proRef.current) {
      expressRef.current.style.width = "100%";
      proRef.current.style.width = "100%";
      expressRef.current.style.height = "650px";
      proRef.current.style.height = "650px";
      expressRef.current.style.margin = "0";
      proRef.current.style.margin = "0";
      expressRef.current.style.maxWidth = "none";
      proRef.current.style.maxWidth = "none";
    }
  };

  const setIframeMobileView = () => {
    if (expressRef.current && proRef.current) {
      const mobileWidth = "375px";
      expressRef.current.style.width = mobileWidth;
      proRef.current.style.width = mobileWidth;
      expressRef.current.style.height = "667px";
      proRef.current.style.height = "667px";
      expressRef.current.style.margin = "0 auto";
      proRef.current.style.margin = "0 auto";
      expressRef.current.style.maxWidth = "100%";
      proRef.current.style.maxWidth = "100%";
    }
  };

  // Filter hotspots based on current scroll position
  const visibleExpressHotspots = expressHotspots.filter(
    (hotspot) => Math.abs(hotspot.scrollPosition - expressScrollPosition) < 300
  );

  const visibleProHotspots = proHotspots.filter(
    (hotspot) => Math.abs(hotspot.scrollPosition - proScrollPosition) < 300
  );

  // Handle scrolling synchronization between iframes
  const handleExpressScroll = () => {
    if (expressContainerRef.current) {
      setExpressScrollPosition(expressContainerRef.current.scrollTop);

      // Sync pro iframe scroll position if possible
      if (proContainerRef.current) {
        proContainerRef.current.scrollTop =
          expressContainerRef.current.scrollTop;
        setProScrollPosition(expressContainerRef.current.scrollTop);
      }
    }
  };

  const handleProScroll = () => {
    if (proContainerRef.current) {
      setProScrollPosition(proContainerRef.current.scrollTop);

      // Sync express iframe scroll position if possible
      if (expressContainerRef.current) {
        expressContainerRef.current.scrollTop =
          proContainerRef.current.scrollTop;
        setExpressScrollPosition(proContainerRef.current.scrollTop);
      }
    }
  };

  // Set up scroll event listeners
  useEffect(() => {
    const expressContainer = expressContainerRef.current;
    const proContainer = proContainerRef.current;

    if (expressContainer) {
      expressContainer.addEventListener("scroll", handleExpressScroll);
    }

    if (proContainer) {
      proContainer.addEventListener("scroll", handleProScroll);
    }

    return () => {
      if (expressContainer) {
        expressContainer.removeEventListener("scroll", handleExpressScroll);
      }
      if (proContainer) {
        proContainer.removeEventListener("scroll", handleProScroll);
      }
    };
  }, []);

  // Match heights for express and pro wrappers
  useEffect(() => {
    const matchWrapperHeights = () => {
      if (expressWrapperRef.current && proWrapperRef.current) {
        // Reset heights first
        expressWrapperRef.current.style.height = "auto";
        proWrapperRef.current.style.height = "auto";

        // Get heights
        const expressHeight = expressWrapperRef.current.clientHeight;
        const proHeight = proWrapperRef.current.clientHeight;

        // Set both to the maximum height
        const maxHeight = Math.max(expressHeight, proHeight);
        expressWrapperRef.current.style.height = `${maxHeight}px`;
        proWrapperRef.current.style.height = `${maxHeight}px`;
      }
    };

    matchWrapperHeights();

    // Also match after conversation toggle
    if (showConversation !== undefined) {
      setTimeout(matchWrapperHeights, 300);
    }

    window.addEventListener("resize", matchWrapperHeights);
    return () => window.removeEventListener("resize", matchWrapperHeights);
  }, [showConversation]);

  // Adjust iframe properties based on viewMode
  useEffect(() => {
    if (expressRef.current && proRef.current) {
      // Set appropriate sizes based on view mode
      if (viewMode === "desktop") {
        setIframeDesktopView();
      } else {
        setIframeMobileView();
      }
    }
  }, [viewMode]);

  return (
    <section
      id="comparison"
      className="py-20 bg-gradient-to-b from-[#0F1729] to-[#0a0f1b]"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Express vs Pro:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-700">
              See the Difference
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Compare both modes side by side. Same starting point, different
            results.
          </p>

          {/* View mode toggle */}
          <div className="flex items-center justify-center mt-6 gap-2">
            <span className="text-sm text-gray-400 mr-1">View as:</span>
            <button
              onClick={() => setViewMode("desktop")}
              className={cn(
                "p-2 rounded text-sm",
                viewMode === "desktop"
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-transparent text-gray-400 hover:text-white"
              )}
            >
              <Monitor className="h-4 w-4 mr-1 inline" /> Desktop
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={cn(
                "p-2 rounded text-sm",
                viewMode === "mobile"
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-transparent text-gray-400 hover:text-white"
              )}
            >
              <Smartphone className="h-4 w-4 mr-1 inline" /> Mobile
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Express Mode Side */}
          <div className="flex-1 relative">
            <div ref={expressWrapperRef}>
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/5 rounded-t-xl border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-blue-400">
                    Express Mode
                  </h3>
                  <span className="text-sm bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full">
                    2 min generation
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Perfect for quick websites with minimal input
                </p>
              </div>

              <div className="relative border-x border-blue-500/20 bg-black/30">
                {/* Initial Prompt */}
                <div className="p-4 border-b border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      You
                    </div>
                    <div>
                      <p className="text-gray-300">
                        "I need a portfolio website for a professional
                        photographer with a dark theme and gallery section"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Result indicator */}
                <div className="p-4 border-b border-blue-500/20 flex items-center gap-2 text-sm text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Generated in 2 minutes
                </div>

                {/* Empty space to match pro side if needed */}
                {showConversation && (
                  <div className="p-4 border-b border-blue-500/20 bg-black/20">
                    <div className="text-gray-400 text-center">
                      <p className="text-sm py-2">
                        Express Mode uses a single prompt
                      </p>
                      <p className="text-xs opacity-50">
                        Great for quick website generation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Express Mode iFrame */}
            <div className="relative border-x border-b border-blue-500/20 rounded-b-xl bg-black/30">
              <div
                ref={expressContainerRef}
                className="relative overflow-auto"
                style={{ height: viewMode === "desktop" ? "650px" : "667px" }}
              >
                <div className="flex justify-center">
                  <iframe
                    ref={expressRef}
                    src="https://demo-portfolio-quick.rapidai.website"
                    className="border-0"
                    style={{
                      height: viewMode === "desktop" ? "650px" : "667px",
                      width: viewMode === "desktop" ? "100%" : "375px",
                      margin: viewMode === "desktop" ? "0" : "0 auto",
                      maxWidth: "100%",
                    }}
                  ></iframe>
                </div>

                {/* Fullscreen button */}
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  onClick={() =>
                    window.open(
                      "https://demo-portfolio-quick.rapidai.website",
                      "_blank"
                    )
                  }
                >
                  <Maximize className="h-4 w-4" />
                </button>

                {/* Hotspots - only show ones relevant to current scroll position */}
                {visibleExpressHotspots.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    className={cn(
                      "absolute w-6 h-6 rounded-full transition-all duration-300 z-10",
                      activeExpressHotspot === hotspot.id
                        ? "bg-blue-500 scale-110"
                        : "bg-blue-500/70 hover:bg-blue-500"
                    )}
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      display: viewMode === "desktop" ? "block" : "none",
                    }}
                    onClick={() =>
                      setActiveExpressHotspot(
                        activeExpressHotspot === hotspot.id ? null : hotspot.id
                      )
                    }
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50"></span>

                    {/* Tooltip */}
                    {activeExpressHotspot === hotspot.id && (
                      <div className="absolute left-7 top-0 w-48 p-2 bg-black/90 border border-blue-500/30 rounded shadow-lg text-left z-20">
                        <p className="font-medium text-blue-400 text-sm">
                          {hotspot.label}
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          {hotspot.description}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pro Mode Side */}
          <div className="flex-1 relative">
            <div ref={proWrapperRef}>
              <div className="p-4 bg-gradient-to-r from-violet-500/20 to-violet-600/5 rounded-t-xl border border-violet-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-violet-400">
                    Pro Mode
                  </h3>
                  <span className="text-sm bg-violet-500/30 text-violet-200 px-3 py-1 rounded-full">
                    5-10 min creation
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  For tailored websites with rich features and custom design
                </p>
              </div>

              <div className="relative border-x border-violet-500/20 bg-black/30">
                {/* Initial Prompt */}
                <div className="p-4 border-b border-violet-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      You
                    </div>
                    <div>
                      <p className="text-gray-300">
                        "I need a portfolio website for a professional
                        photographer with a dark theme and gallery section"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conversation thread */}
                <div
                  className="p-4 border-b border-violet-500/20 cursor-pointer"
                  onClick={() => setShowConversation(!showConversation)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      {conversationSnippets.slice(0, 6).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i % 2 === 0 ? "bg-violet-500/70" : "bg-cyan-500/70"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {showConversation
                        ? "Hide conversation"
                        : "+ Click to see detailed conversation"}
                    </span>
                  </div>

                  {/* Expanded conversation */}
                  {showConversation && (
                    <div className="mt-4 space-y-4">
                      {conversationSnippets.map((message, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              message.role === "ai"
                                ? "bg-violet-500/20 text-violet-400"
                                : "bg-cyan-500/20 text-cyan-400"
                            }`}
                          >
                            {message.role === "ai" ? "AI" : "You"}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Color palette section */}
                      <div className="mt-4 p-3 border border-violet-500/20 rounded-lg bg-black/30">
                        <p className="text-sm text-gray-400 mb-2">
                          Selected Color Palette:
                        </p>
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded bg-[#111111]"
                            title="Dark background"
                          ></div>
                          <div
                            className="w-8 h-8 rounded bg-[#e7b75e]"
                            title="Gold accent"
                          ></div>
                          <div
                            className="w-8 h-8 rounded bg-[#333333]"
                            title="Dark grey"
                          ></div>
                          <div
                            className="w-8 h-8 rounded bg-white"
                            title="White text"
                          ></div>
                        </div>
                      </div>

                      {/* Image uploads placeholder */}
                      <div className="mt-2 p-3 border border-violet-500/20 rounded-lg bg-black/30">
                        <p className="text-sm text-gray-400 mb-2">
                          Uploaded Images:
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <div
                              key={num}
                              className="w-16 h-12 rounded bg-gray-800 shrink-0 flex items-center justify-center text-xs text-gray-500"
                            >
                              Image {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Result indicator */}
                <div className="p-4 border-b border-violet-500/20 flex items-center gap-2 text-sm text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-violet-400"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Generated in 8 minutes with detailed conversation
                </div>
              </div>
            </div>

            {/* Pro Mode iFrame */}
            <div className="relative border-x border-b border-violet-500/20 rounded-b-xl bg-black/30">
              <div
                ref={proContainerRef}
                className="relative overflow-auto"
                style={{ height: viewMode === "desktop" ? "650px" : "667px" }}
              >
                <div className="flex justify-center">
                  <iframe
                    ref={proRef}
                    src="https://demo-portfolio-quality.rapidai.website"
                    className="border-0"
                    style={{
                      height: viewMode === "desktop" ? "650px" : "667px",
                      width: viewMode === "desktop" ? "100%" : "375px",
                      margin: viewMode === "desktop" ? "0" : "0 auto",
                      maxWidth: "100%",
                    }}
                  ></iframe>
                </div>

                {/* Fullscreen button */}
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                  onClick={() =>
                    window.open(
                      "https://demo-portfolio-quality.rapidai.website",
                      "_blank"
                    )
                  }
                >
                  <Maximize className="h-4 w-4" />
                </button>

                {/* Hotspots - only show ones relevant to current scroll position */}
                {visibleProHotspots.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    className={cn(
                      "absolute w-6 h-6 rounded-full transition-all duration-300 z-10",
                      activeProHotspot === hotspot.id
                        ? "bg-violet-500 scale-110"
                        : "bg-violet-500/70 hover:bg-violet-500"
                    )}
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      display: viewMode === "desktop" ? "block" : "none",
                    }}
                    onClick={() =>
                      setActiveProHotspot(
                        activeProHotspot === hotspot.id ? null : hotspot.id
                      )
                    }
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-50"></span>

                    {/* Tooltip */}
                    {activeProHotspot === hotspot.id && (
                      <div className="absolute left-7 top-0 w-48 p-2 bg-black/90 border border-violet-500/30 rounded shadow-lg text-left z-20">
                        <p className="font-medium text-violet-400 text-sm">
                          {hotspot.label}
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          {hotspot.description}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            className="bg-gradient-to-r from-cyan-500 to-violet-700 hover:from-cyan-600 hover:to-violet-800 text-white rounded-full px-8 py-6"
            onClick={() => (window.location.href = "/signup")}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Your Free Account
          </Button>
          <p className="text-gray-500 mt-3 text-sm">
            Get started today and explore both Express and Pro modes
          </p>
        </div>
      </div>
    </section>
  );
}
