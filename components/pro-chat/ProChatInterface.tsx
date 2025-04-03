"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  PanelRight,
  X,
  HelpCircle,
  Sparkles,
  PanelLeftClose,
  PaletteIcon,
  ImageIcon,
  Link2 as Link2Icon,
  LayoutIcon,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  RocketIcon,
  TargetIcon,
  BrainCircuit,
  BadgePlus,
  MessageSquarePlus,
  PencilLine,
  FileSymlink,
  StarsIcon,
  TextIcon,
  LayoutGridIcon,
  BarChart,
  PaintBucket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { MessageList, MessageInput, Message } from "./";
import { showExtractionToast } from "@/components/notifications/ProjectToast";
import { FileUploadButton } from "./FileUploadButton";
import { AnimatedCard } from "@/components/ui/animated-card";
import { TypographySelector } from "./TypographySelector";
import { LayoutSelector } from "./LayoutSelector";
import { useToast } from "@/components/ui/use-toast";
import {
  ColorPalette,
  FontPairing,
  LayoutOption,
  DesignStyle,
  InteractiveComponentProps,
} from "./interactions";
import DesignStudio, {
  ProjectInfo2,
  ColorPalette2,
  FontPairing2,
  LayoutOption2,
  DesignStyle2,
} from "./designstudio";
// Or define these types within ProChatInterface.tsx if preferred

type ProjectInfo = {
  purpose: string;
  targetAudience: string;
  designPreferences: string;
  colorScheme: string[];
  inspirationImages: string[];
  typography: string;
  layout: string;
};

export default function ProChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-user-message",
      role: "user",
      content: "I need help creating a website.",
      timestamp: new Date(Date.now() - 1000),
      hidden: true,
    },
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "👋 Welcome to Pro Chat! I'm your AI design partner, here to help you create your perfect website. Let's start with understanding your vision and goals.",
      timestamp: new Date(),
      options: [
        {
          text: "I need a business website",
          value: "I need a business website",
          isMultiSelect: false,
        },
        {
          text: "I want a personal portfolio",
          value: "I want a personal portfolio",
          isMultiSelect: false,
        },
        {
          text: "I need an e-commerce store",
          value: "I need an e-commerce store",
          isMultiSelect: false,
        },
        {
          text: "I'd like to explore options",
          value:
            "Can you tell me about the different types of websites you can create?",
          isMultiSelect: false,
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("chat");
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    purpose: "",
    targetAudience: "",
    designPreferences: "",
    colorScheme: ["#4F46E5"],
    inspirationImages: [],
    typography: "sans",
    layout: "modern",
  });
  const [progress, setProgress] = useState<number>(10);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Sample data for interactive components - in a real app, these would come from a database or API
  const colorPalettes: ColorPalette[] = [
    {
      id: "minimal",
      name: "Minimalist",
      colors: ["#FFFFFF", "#F8F9FA", "#343A40", "#6C757D", "#228BE6"],
    },
    {
      id: "vibrant",
      name: "Vibrant",
      colors: ["#FFFFFF", "#7950F2", "#FA5252", "#12B886", "#15AABF"],
    },
    {
      id: "earthy",
      name: "Earthy Tones",
      colors: ["#F8F9FA", "#E9ECEF", "#4D3E3E", "#8B7355", "#A67F5D"],
    },
    {
      id: "pastel",
      name: "Soft Pastels",
      colors: ["#F1F3F5", "#FFF0F6", "#D6336C", "#F783AC", "#F1F3F5"],
    },
  ];

  const fontPairings: FontPairing[] = [
    {
      id: "modern",
      name: "Modern & Clean",
      headingFont: "Inter",
      bodyFont: "Roboto",
      headingClass: "font-sans",
      bodyClass: "font-sans",
    },
    {
      id: "classic",
      name: "Classic & Elegant",
      headingFont: "Playfair Display",
      bodyFont: "Lora",
      headingClass: "font-serif",
      bodyClass: "font-serif",
    },
    {
      id: "creative",
      name: "Creative & Bold",
      headingFont: "Montserrat",
      bodyFont: "Open Sans",
      headingClass: "font-sans",
      bodyClass: "font-sans",
    },
  ];

  const layoutOptions: LayoutOption[] = [
    {
      id: "modern",
      name: "Modern Full Width",
      description: "Clean, full-width sections with maximum content space",
      sections: ["Header", "Hero", "Features", "Testimonials", "Contact"],
    },
    {
      id: "classic",
      name: "Classic with Sidebar",
      description: "Traditional layout with main content and sidebar",
      sections: ["Header", "Hero", "Main + Sidebar", "Features", "Footer"],
    },
    {
      id: "grid",
      name: "Grid Layout",
      description: "Card-based grid layout perfect for portfolios",
      sections: ["Header", "Hero", "Project Grid", "About", "Contact"],
    },
    {
      id: "blog",
      name: "Blog Layout",
      description: "Content-focused layout ideal for articles",
      sections: ["Header", "Featured", "Articles", "Categories", "Footer"],
    },
  ];

  const designStyles: DesignStyle[] = [
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean, spacious, and focused on content",
      icon: "✧",
      keyElements: [
        "Ample white space",
        "Limited color palette",
        "Simple typography",
        "Subtle animations",
      ],
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional, trustworthy, and business-focused",
      icon: "◼",
      keyElements: [
        "Professional blue tones",
        "Clear hierarchy",
        "Clean sections",
        "Structured layout",
      ],
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold, expressive, and unique",
      icon: "✿",
      keyElements: [
        "Bold colors",
        "Unique typography",
        "Creative elements",
        "Distinctive visuals",
      ],
    },
    {
      id: "playful",
      name: "Playful",
      description: "Fun, engaging, and approachable",
      icon: "◉",
      keyElements: [
        "Bright colors",
        "Rounded elements",
        "Playful illustrations",
        "Interactive elements",
      ],
    },
  ];

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileMode(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Progress tracking - increases as the user provides more info
  useEffect(() => {
    let newProgress = 10; // Start with 10%

    // Website purpose
    if (projectInfo.purpose) newProgress += 15;

    // Target audience
    if (projectInfo.targetAudience) newProgress += 15;

    // Design style preferences
    if (projectInfo.designPreferences) newProgress += 10;

    // Color scheme
    if (projectInfo.colorScheme.length > 0) newProgress += 15;

    // Typography
    if (projectInfo.typography) newProgress += 10;

    // Layout
    if (projectInfo.layout) newProgress += 10;

    // Inspiration images
    if (projectInfo.inspirationImages.length > 0) newProgress += 15;

    setProgress(newProgress);
  }, [projectInfo]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      const behavior = isLoading ? "auto" : "smooth";
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, [messages, isLoading]);

  // Function to handle interactive component submissions
  const handleInteractionSubmit = (
    messageId: string,
    type: string,
    value: string
  ) => {
    // Find the selected data based on the type and value
    let selectedData: any;
    let responseMessage: string;
    let toastTitle: string = "Selection confirmed";
    let toastDescription: string = "";

    switch (type) {
      case "colorPalette":
        const palette = colorPalettes.find((p) => p.id === value);
        selectedData = palette;

        if (palette) {
          // Update the project color scheme
          setProjectInfo((prev) => ({
            ...prev,
            colorScheme: [...palette.colors],
          }));

          toastTitle = "Color palette updated";
          toastDescription = `The ${palette.name} palette has been applied to your project`;
        }

        responseMessage = `I really like the ${palette?.name} color palette! These colors would work perfectly for my website.`;
        break;

      case "fontPairing":
        const fonts = fontPairings.find((f) => f.id === value);
        selectedData = fonts;

        if (fonts) {
          // Update the project typography
          setProjectInfo((prev) => ({
            ...prev,
            typography: fonts.id,
          }));

          toastTitle = "Typography updated";
          toastDescription = `Using ${fonts.headingFont} for headings and ${fonts.bodyFont} for body text`;
        }

        responseMessage = `I'd like to use the ${fonts?.name} font pairing with ${fonts?.headingFont} for headings and ${fonts?.bodyFont} for body text.`;
        break;

      case "layout":
        const layout = layoutOptions.find((l) => l.id === value);
        selectedData = layout;

        if (layout) {
          // Update the project layout
          setProjectInfo((prev) => ({
            ...prev,
            layout: layout.id,
          }));

          toastTitle = "Layout updated";
          toastDescription = `Using ${layout.name} layout for your website`;
        }

        responseMessage = `The ${layout?.name} layout would be perfect for my site. I like how it includes ${layout?.sections.join(", ")}.`;
        break;

      case "designStyle":
        const style = designStyles.find((s) => s.id === value);
        selectedData = style;

        if (style) {
          // Update the project design preferences
          setProjectInfo((prev) => ({
            ...prev,
            designPreferences: style.id,
          }));

          toastTitle = "Design style updated";
          toastDescription = `Your website will use the ${style.name} design style`;
        }

        responseMessage = `I want my website to have a ${style?.name} design style, focusing on ${style?.keyElements.join(", ")}.`;
        break;

      default:
        responseMessage = `I've selected ${value}.`;
    }

    // Show toast notification
    toast({
      title: toastTitle,
      description: toastDescription,
      variant: "success",
    });

    // Calculate new progress based on updated project info
    calculateProgress();

    // Update messages to mark the interactive component as completed
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, interactiveComponent: undefined } : msg
      )
    );

    // Send the user's selection as a new message
    handleSendMessage(responseMessage);
  };

  // Update the handleSendMessage function to potentially add interactive components
  const handleSendMessage = async (content: string) => {
    if (!content.trim() && !selectedFile) return;

    // Get a unique ID for this message
    const messageId = Date.now().toString();
    let messageImageUrl: string | null = null;

    // Handle file upload first if there's a file
    if (selectedFile) {
      // In a real implementation, we would upload to Supabase here
      // For demo purposes, we'll use the file preview URL directly
      messageImageUrl = filePreviewUrl;

      // Update project inspiration images (in a real app, we'd use the actual Supabase URL)
      if (selectedFile.type.startsWith("image/")) {
        setProjectInfo((prev) => ({
          ...prev,
          inspirationImages: [...prev.inspirationImages, messageImageUrl || ""],
        }));
      }
    }

    // Add user message to chat
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      imageUrl: messageImageUrl,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setSelectedOptions([]); // Clear any selected options

    // Clear the file after sending
    setSelectedFile(null);
    setFilePreviewUrl(null);

    // Simulate typing indicator
    const typingIndicatorId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: typingIndicatorId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      // Call Gemini API for chat
      // First, prepare messages for the API - ensure we have at least one user message
      const messagesToSend = [...messages, userMessage];

      // Filter messages to ensure we have user messages and don't send too many
      // We want to maintain the proper conversation flow: user → assistant → user → etc.
      // The Gemini API requires the first message to be from the user
      const filteredMessages = [];
      let hasAddedUserMessage = false;

      // Process messages to ensure proper structure
      for (let i = 0; i < messagesToSend.length; i++) {
        const msg = messagesToSend[i];

        // Always include user messages
        if (msg.role === "user") {
          filteredMessages.push(msg);
          hasAddedUserMessage = true;
        }
        // Only include assistant messages if they follow a user message
        else if (msg.role === "assistant" && hasAddedUserMessage) {
          filteredMessages.push(msg);
          // After an assistant message, we need another user message
          hasAddedUserMessage = false;
        }
        // Skip consecutive assistant messages to maintain proper turn structure
      }

      // If after filtering, we don't have a user message at the start, prepend one
      if (
        filteredMessages.length === 0 ||
        filteredMessages[0].role !== "user"
      ) {
        filteredMessages.unshift({
          id: "initial-user-message",
          role: "user",
          content: "Hello, I need help with my website design.",
          timestamp: new Date(),
        });
      }

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: filteredMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            // Don't send the imageUrl to the API - in a real implementation,
            // we'd want to include image URLs but for now we'll keep it simple
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== typingIndicatorId));

      // Update project info based on user message and AI response
      updateProjectInfo(content, data.response);

      // Format options from the API to ensure they have the correct structure
      const formattedOptions = Array.isArray(data.options)
        ? data.options.map((opt: any) => ({
            text: opt.text || "Option",
            value: opt.value || opt.text || "Option",
            isMultiSelect: opt.isMultiSelect === true,
          }))
        : [];

      // Add AI response with options returned from the API
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        options: formattedOptions,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Note: We no longer trigger interactive components based on keywords
      // The AI controls when to show components via its structured output formats
      // Any structured data in the AI's response is now automatically visualized
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== typingIndicatorId));

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  // Inside ProChatInterface component

  const handlePaletteChange = (palette: ColorPalette) => {
    const oldColors = projectInfo.colorScheme.join(",");
    const newColors = palette.colors.join(",");
    if (oldColors !== newColors) {
      setProjectInfo((prev) => ({
        ...prev,
        colorScheme: palette.colors,
        colorSchemeId: palette.id,
      })); // Store ID if helpful
      toast({
        title: "Palette Updated",
        description: `Switched to ${palette.name}`,
        variant: "success",
      });
      // sendSystemMessage(`User updated color palette to ${palette.name} via Design Studio.`); // Optional: Send system message
      calculateProgress(); // Recalculate progress if needed
    }
  };

  // const handleFontChange = (fontId: string) => {
  //   const oldFontId = projectInfo.typography;
  //   if (oldFontId !== fontId) {
  //     const newFontPair =
  //       fontPairings.find((f) => f.id === fontId) || fontPairings[0];
  //     setProjectInfo((prev) => ({ ...prev, typography: fontId }));
  //     toast({
  //       title: "Typography Updated",
  //       description: `Switched to ${newFontPair.name}`,
  //       variant: "success",
  //     });
  //     // sendSystemMessage(`User updated typography to ${newFontPair.name} via Design Studio.`);
  //     calculateProgress();
  //   }
  // };

  const handleLayoutChange = (layoutId: string) => {
    const oldLayoutId = projectInfo.layout;
    if (oldLayoutId !== layoutId) {
      const newLayout =
        layoutOptions.find((l) => l.id === layoutId) || layoutOptions[0];
      setProjectInfo((prev) => ({ ...prev, layout: layoutId }));
      toast({
        title: "Layout Updated",
        description: `Switched to ${newLayout.name}`,
        variant: "success",
      });
      // sendSystemMessage(`User updated layout to ${newLayout.name} via Design Studio.`);
      calculateProgress();
    }
  };

  const handleStyleChange = (styleId: string) => {
    const oldStyleId = projectInfo.designPreferences;
    if (oldStyleId !== styleId) {
      const newStyle =
        designStyles.find((s) => s.id === styleId) || designStyles[0];
      setProjectInfo((prev) => ({ ...prev, designPreferences: styleId }));
      toast({
        title: "Visual Style Updated",
        description: `Switched to ${newStyle.name}`,
        variant: "success",
      });
      // sendSystemMessage(`User updated style to ${newStyle.name} via Design Studio.`);
      calculateProgress();
    }
  };

  // Define sendSystemMessage if you want that functionality
  // const sendSystemMessage = (content) => { ... logic to add a specific type of message to the chat ... }
  // Helper to update project info based on conversation and structured formats
  const updateProjectInfo = (userMessage: string, aiResponse: string) => {
    const newProjectInfo = { ...projectInfo };
    let settingUpdated = false;
    let settingType: "color" | "font" | "layout" | "general" | "style" =
      "general";
    let settingName = "";
    let settingValue = "";
    let oldValue = "";

    // Check for structured formats in AI response
    // 1. Check for COLOR_PALETTE format
    const colorPaletteMatch = aiResponse.match(
      /COLOR_PALETTE:\s*\{([\s\S]*?)\}/
    );
    if (colorPaletteMatch) {
      try {
        const paletteStr = `{${colorPaletteMatch[1]}}`;
        const palette = JSON.parse(
          paletteStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
        );

        // Extract colors from the palette
        const colors = Object.values(palette) as string[];
        if (colors.length > 0) {
          oldValue = newProjectInfo.colorScheme.join(", ");
          newProjectInfo.colorScheme = colors;
          settingUpdated = true;
          settingType = "color";
          settingName = "Color Palette";
          settingValue = "Updated Color Palette";
        }
      } catch (e) {
        console.error("Failed to parse color palette:", e);
      }
    }

    // 2. Check for TYPOGRAPHY format
    const typographyMatch = aiResponse.match(/TYPOGRAPHY:\s*\{([\s\S]*?)\}/);
    if (typographyMatch) {
      try {
        const typographyStr = `{${typographyMatch[1]}}`;
        const typography = JSON.parse(
          typographyStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
        );

        // Extract font information
        if (typography.headingFont) {
          const fontMapping: Record<string, string> = {
            "Sans Serif": "sans",
            Sans: "sans",
            Serif: "serif",
            Monospace: "mono",
            Mono: "mono",
            Display: "display",
            Rounded: "rounded",
            Handwritten: "handwritten",
          };

          const fontValue =
            fontMapping[typography.headingFont] ||
            typography.headingFont.toLowerCase();

          oldValue = newProjectInfo.typography;
          newProjectInfo.typography = fontValue;
          settingUpdated = true;
          settingType = "font";
          settingName = "Typography";
          settingValue = typography.headingFont;
        }
      } catch (e) {
        console.error("Failed to parse typography:", e);
      }
    }

    // 3. Check for LAYOUT format
    const layoutMatch = aiResponse.match(/LAYOUT:\s*\{([\s\S]*?)\}/);
    if (layoutMatch) {
      try {
        const layoutStr = `{${layoutMatch[1]}}`;
        const layout = JSON.parse(
          layoutStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
        );

        if (layout.type) {
          oldValue = newProjectInfo.layout;
          newProjectInfo.layout = layout.type;
          settingUpdated = true;
          settingType = "layout";
          settingName = "Layout";
          settingValue = layout.type;
        }
      } catch (e) {
        console.error("Failed to parse layout:", e);
      }
    }

    // 4. Check for DESIGN_STYLE format
    const designStyleMatch = aiResponse.match(/DESIGN_STYLE:\s*\{([\s\S]*?)\}/);
    if (designStyleMatch) {
      try {
        const designStyleStr = `{${designStyleMatch[1]}}`;
        const designStyle = JSON.parse(
          designStyleStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2": ')
        );

        if (designStyle.name) {
          oldValue = newProjectInfo.designPreferences;
          newProjectInfo.designPreferences = designStyle.name.toLowerCase();
          settingUpdated = true;
          settingType = "style";
          settingName = "Design Style";
          settingValue = designStyle.name;
        }
      } catch (e) {
        console.error("Failed to parse design style:", e);
      }
    }

    // If no structured formats found, fall back to regular parsing
    if (!settingUpdated) {
      // Simple checks to extract information (in a real app, use NLP for better extraction)
      if (
        userMessage.toLowerCase().includes("business") ||
        userMessage.toLowerCase().includes("company")
      ) {
        oldValue = newProjectInfo.purpose;
        newProjectInfo.purpose = "business";
        settingUpdated = true;
        settingType = "general";
        settingName = "Website Purpose";
        settingValue = "Business Website";
      } else if (
        userMessage.toLowerCase().includes("portfolio") ||
        userMessage.toLowerCase().includes("personal")
      ) {
        oldValue = newProjectInfo.purpose;
        newProjectInfo.purpose = "portfolio";
        settingUpdated = true;
        settingType = "general";
        settingName = "Website Purpose";
        settingValue = "Personal Portfolio";
      } else if (
        userMessage.toLowerCase().includes("shop") ||
        userMessage.toLowerCase().includes("store") ||
        userMessage.toLowerCase().includes("ecommerce")
      ) {
        oldValue = newProjectInfo.purpose;
        newProjectInfo.purpose = "ecommerce";
        settingUpdated = true;
        settingType = "general";
        settingName = "Website Purpose";
        settingValue = "E-commerce Store";
      }

      // Extract target audience information
      if (
        userMessage.toLowerCase().includes("target") ||
        userMessage.toLowerCase().includes("audience")
      ) {
        const audienceInfo = userMessage.split("audience")[1] || "";
        if (audienceInfo.length > 3) {
          oldValue = newProjectInfo.targetAudience;
          newProjectInfo.targetAudience = audienceInfo.trim();
          settingUpdated = true;
          settingType = "general";
          settingName = "Target Audience";
          settingValue = audienceInfo.trim();
        }
      }

      // Check for color preferences
      const colorMatches = userMessage.match(
        /(blue|red|green|purple|yellow|orange|black|white|dark|light)/gi
      );
      if (colorMatches && colorMatches.length > 0) {
        // Map color names to hex codes (simplified)
        const colorMap: Record<string, string> = {
          blue: "#4F46E5",
          red: "#EF4444",
          green: "#10B981",
          purple: "#8B5CF6",
          yellow: "#F59E0B",
          orange: "#F97316",
          black: "#171717",
          white: "#FFFFFF",
          dark: "#171717",
          light: "#FFFFFF",
        };

        const newColors = colorMatches
          .map((color) => colorMap[color.toLowerCase()])
          .filter(Boolean);

        if (newColors.length > 0) {
          oldValue = newProjectInfo.colorScheme.join(", ");
          newProjectInfo.colorScheme = newColors;
          settingUpdated = true;
          settingType = "color";
          settingName = "Color Scheme";
          settingValue = newColors[0];
        }
      }

      // Check for design style mentions
      const styleMatches = userMessage.match(
        /(minimalist|modern|classic|bold|playful|elegant|corporate|creative)/gi
      );
      if (styleMatches && styleMatches.length > 0) {
        oldValue = newProjectInfo.designPreferences;
        newProjectInfo.designPreferences = styleMatches[0];
        settingUpdated = true;
        settingType = "style";
        settingName = "Design Style";
        settingValue = styleMatches[0];
      }

      // Check for hex color codes in either the user message or AI response
      const hexColorMatches = (userMessage + " " + aiResponse).match(
        /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g
      );
      if (hexColorMatches && hexColorMatches.length > 0) {
        // If we have hex colors, update and use the first one
        oldValue = newProjectInfo.colorScheme.join(", ");

        // Filter out duplicate colors
        const uniqueColors = Array.from(new Set(hexColorMatches));

        // If we don't have many colors yet, add these to the scheme
        if (newProjectInfo.colorScheme.length < 2) {
          newProjectInfo.colorScheme = uniqueColors;
        }
        // Otherwise just add new colors we don't already have
        else {
          const existingColors = new Set(newProjectInfo.colorScheme);
          const newUniqueColors = uniqueColors.filter(
            (color) => !existingColors.has(color)
          );
          if (newUniqueColors.length > 0) {
            newProjectInfo.colorScheme = [
              ...newProjectInfo.colorScheme,
              ...newUniqueColors,
            ];
          }
        }

        settingUpdated = true;
        settingType = "color";
        settingName = "Color Scheme";
        settingValue = hexColorMatches[0];
      }

      // Check for typography mentions
      if (
        userMessage.toLowerCase().includes("font") ||
        userMessage.toLowerCase().includes("typography") ||
        userMessage.toLowerCase().includes("text style")
      ) {
        // Check for specific font types
        const fontMatches = userMessage.match(
          /(sans|serif|mono|display|rounded|handwritten)/gi
        );

        if (fontMatches && fontMatches.length > 0) {
          oldValue = newProjectInfo.typography;
          newProjectInfo.typography = fontMatches[0].toLowerCase();
          settingUpdated = true;
          settingType = "font";
          settingName = "Typography";
          settingValue = fontMatches[0];
        }
      }

      // Check for layout mentions
      if (
        userMessage.toLowerCase().includes("layout") ||
        userMessage.toLowerCase().includes("structure") ||
        userMessage.includes("arrangement")
      ) {
        // Check for specific layout types
        const layoutMatches = userMessage.match(
          /(classic|modern|grid|blog|landing|shop)/gi
        );

        if (layoutMatches && layoutMatches.length > 0) {
          oldValue = newProjectInfo.layout;
          newProjectInfo.layout = layoutMatches[0].toLowerCase();
          settingUpdated = true;
          settingType = "layout";
          settingName = "Layout";
          settingValue = layoutMatches[0];
        }
      }
    }

    setProjectInfo(newProjectInfo);

    // Show toast notification for the setting update
    if (settingUpdated && oldValue !== settingValue) {
      const finalOldValue = oldValue;
      toast({
        title: "Setting updated",
        description: `Updated ${settingName} from "${finalOldValue || "Not set"}" to "${settingValue}"`,
        variant: "default",
      });
    }
  };

  // Handle option selection for multi-select or single-select options
  const handleOptionSelect = (
    optionValue: string,
    isMultiSelect: boolean = true // Always treat as multi-select
  ) => {
    // For all options, just add to the selection list
    // The MessageInput will handle sending them when the user clicks Send
    if (selectedOptions.includes(optionValue)) {
      setSelectedOptions(selectedOptions.filter((opt) => opt !== optionValue));
    } else {
      setSelectedOptions([...selectedOptions, optionValue]);
    }
  };

  // Add a function to send selected multi-select options
  const sendSelectedOptions = () => {
    if (selectedOptions.length > 0) {
      handleSendMessage(selectedOptions.join(". "));
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle file selection and preview
  const handleFileSelected = (file: File | null, previewUrl: string | null) => {
    setSelectedFile(file);
    setFilePreviewUrl(previewUrl);

    if (file) {
      showExtractionToast(
        "File",
        file.name,
        `${(file.size / 1024).toFixed(1)}KB - Added to your message`
      );
    }
  };

  // Handle image upload directly from the design tabs
  const handleImageUpload = async (file?: File) => {
    // If a file is provided, use it, otherwise simulate with a random image
    if (file) {
      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setSelectedFile(file);
        setFilePreviewUrl(previewUrl);

        showExtractionToast(
          "Image",
          file.name,
          "Added to your inspiration board"
        );

        // Set a prompt message about the image
        handleSendMessage(`I'd like to use this image on my website.`);
      };
      reader.readAsDataURL(file);
    } else {
      // Use a mock image for demo purposes
      const mockImageUrl = `/mock-images/inspiration-${Math.floor(Math.random() * 5) + 1}.jpg`;
      setProjectInfo((prev) => ({
        ...prev,
        inspirationImages: [...prev.inspirationImages, mockImageUrl],
      }));

      showExtractionToast(
        "Image",
        "Sample inspiration image",
        "Added to your inspiration board"
      );

      // Set a mock preview URL and send message
      setFilePreviewUrl(mockImageUrl);
      handleSendMessage(
        `I've uploaded an inspiration image. I like the design style of this website.`
      );
      setFilePreviewUrl(null);
    }
  };

  // Handle font change
  const handleFontChange = (fontName: string) => {
    setProjectInfo((prev) => ({
      ...prev,
      typography: fontName,
    }));
    toast({
      title: "Font updated",
      description: `Changed font to ${fontName}`,
      variant: "success",
    });
  };

  // Handle color change
  const handleColorSelect = (color: string) => {
    if (!projectInfo.colorScheme.includes(color)) {
      const oldColors = [...projectInfo.colorScheme];

      setProjectInfo((prev) => ({
        ...prev,
        colorScheme: [...prev.colorScheme, color],
      }));

      toast({
        title: "Color added",
        description: `Added ${color} to your palette`,
        variant: "success",
      });
    }
  };

  // Update design style
  const handleDesignStyleChange = (style: string) => {
    const oldStyle = projectInfo.designPreferences;
    setProjectInfo((prev) => ({
      ...prev,
      designPreferences: style,
    }));

    toast({
      title: "Design style updated",
      description: `Changed style to ${style}`,
      variant: "success",
    });
  };

  // Update project name
  const handleProjectNameChange = (newName: string) => {
    const oldName = projectInfo.purpose;
    setProjectInfo((prev) => ({
      ...prev,
      purpose: newName,
    }));

    toast({
      title: "Project name updated",
      description: `Changed name to "${newName}"`,
      variant: "success",
    });
  };

  // Update project description
  const handleProjectDescriptionChange = (newDescription: string) => {
    const oldDescription = projectInfo.purpose;
    setProjectInfo((prev) => ({
      ...prev,
      purpose: newDescription,
    }));

    toast({
      title: "Project description updated",
      description: `Updated project description`,
      variant: "success",
    });
  };

  // Add this function to calculate progress based on project info completeness
  const calculateProgress = () => {
    let newProgress = 0;

    // Base progress - getting started
    newProgress += 5;

    // Add progress for each completed item

    // Purpose
    if (projectInfo.purpose) newProgress += 15;

    // Target audience
    if (projectInfo.targetAudience) newProgress += 15;

    // Design preferences
    if (projectInfo.designPreferences) newProgress += 15;

    // Color scheme
    if (projectInfo.colorScheme.length > 0) newProgress += 15;

    // Typography
    if (projectInfo.typography) newProgress += 15;

    // Layout
    if (projectInfo.layout) newProgress += 15;

    // Inspiration images
    if (projectInfo.inspirationImages.length > 0) newProgress += 5;

    // Extra progress for more complete profiles
    if (newProgress > 80) newProgress += 10;

    // Cap at 100%
    newProgress = Math.min(100, newProgress);

    setProgress(newProgress);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-background/80">
      {/* Header Area with Project Progress */}
      <div className="border-b p-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Pro Website Designer
            </h1>
            <p className="text-sm text-muted-foreground">
              Interactive AI-guided website creation
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Project Progress</span>
              <Progress value={progress} className="w-40 h-2" />
              <span className="text-xs font-medium">{progress}%</span>
            </div>
            {progress >= 90 && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <RocketIcon className="mr-1 h-3 w-3" /> Ready to Generate
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Navigation between sections */}
        <AnimatePresence mode="wait">
          {!isMobileMode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 60, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-card border-r flex flex-col items-center py-6 space-y-6"
            >
              <Button
                variant={activeSection === "chat" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => setActiveSection("chat")}
              >
                <BrainCircuit size={20} />
                <span className="sr-only">Chat</span>
              </Button>

              <Button
                variant={activeSection === "design" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => setActiveSection("design")}
              >
                <PaletteIcon size={20} />
                <span className="sr-only">Design</span>
              </Button>

              <Button
                variant={activeSection === "inspiration" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => setActiveSection("inspiration")}
              >
                <ImageIcon size={20} />
                <span className="sr-only">Inspiration</span>
              </Button>

              <Button
                variant={activeSection === "help" ? "default" : "ghost"}
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => setActiveSection("help")}
              >
                <HelpCircle size={20} />
                <span className="sr-only">Help</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile Navigation Bar */}
          {isMobileMode && (
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex space-x-4">
                <Button
                  variant={activeSection === "chat" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setActiveSection("chat")}
                >
                  <BrainCircuit size={16} className="mr-1" /> Chat
                </Button>

                <Button
                  variant={activeSection === "design" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setActiveSection("design")}
                >
                  <PaletteIcon size={16} className="mr-1" /> Design
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose size={16} />
                ) : (
                  <PanelRight size={16} />
                )}
              </Button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeSection === "chat" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                  <MessageList
                    messages={messages}
                    onOptionSelect={handleOptionSelect}
                    projectInfo={projectInfo}
                    selectedOptions={selectedOptions}
                    onInteractionSubmit={handleInteractionSubmit}
                  />
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4 bg-background/50 backdrop-blur-sm">
                  <MessageInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    selectedOptions={selectedOptions}
                    onClearSelectedOptions={() => setSelectedOptions([])}
                    onSendSelectedOptions={sendSelectedOptions}
                    onFileSelected={handleFileSelected}
                  />
                </div>
              </motion.div>
            )}

            {activeSection === "design" && (
              // <motion.div
              //   initial={{ opacity: 0 }}
              //   animate={{ opacity: 1 }}
              //   exit={{ opacity: 0 }}
              //   className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
              // >
              //   <div className="grid gap-8">
              //     {/* Color Section */}
              //     <AnimatedCard className="p-6" variant="default">
              //       <h3 className="font-semibold text-xl mb-4 flex items-center">
              //         <PaletteIcon className="h-5 w-5 mr-2 text-primary" />
              //         Color Palette
              //       </h3>
              //       <div className="grid gap-4">
              //         <div className="bg-muted/50 rounded-lg p-4">
              //           <h4 className="text-sm font-medium mb-3">
              //             Current Colors
              //           </h4>
              //           <div className="flex flex-wrap gap-3 mb-4">
              //             {projectInfo.colorScheme.map((color, i) => (
              //               <div
              //                 key={i}
              //                 className="flex flex-col items-center group relative"
              //               >
              //                 <div
              //                   className="h-12 w-12 rounded-md shadow-sm border border-muted-foreground/10 group-hover:scale-110 transition-transform"
              //                   style={{ backgroundColor: color }}
              //                 ></div>
              //                 <span className="text-xs mt-1 font-mono">
              //                   {color}
              //                 </span>
              //                 <Button
              //                   variant="ghost"
              //                   size="icon"
              //                   className="h-6 w-6 absolute -top-2 -right-2 rounded-full bg-background border opacity-0 group-hover:opacity-100 transition-opacity"
              //                   onClick={() => {
              //                     // Remove color from scheme
              //                     const oldColors = [
              //                       ...projectInfo.colorScheme,
              //                     ];
              //                     setProjectInfo((prev) => ({
              //                       ...prev,
              //                       colorScheme: prev.colorScheme.filter(
              //                         (c) => c !== color
              //                       ),
              //                     }));

              //                     toast({
              //                       title: "Color removed",
              //                       description: `Removed ${color} from palette`,
              //                       variant: "default",
              //                     });
              //                   }}
              //                 >
              //                   <X className="h-3 w-3" />
              //                 </Button>
              //               </div>
              //             ))}

              //             {projectInfo.colorScheme.length === 0 && (
              //               <div className="flex-1 bg-muted/30 rounded-md p-3 text-center text-muted-foreground">
              //                 <p className="text-sm">No colors selected yet</p>
              //               </div>
              //             )}
              //           </div>

              //           <h4 className="text-sm font-medium mt-4 mb-3">
              //             Add Colors
              //           </h4>
              //           <div className="flex flex-wrap gap-2">
              //             {[
              //               "#4F46E5", // Blue
              //               "#10B981", // Green
              //               "#EF4444", // Red
              //               "#F97316", // Orange
              //               "#F59E0B", // Yellow
              //               "#8B5CF6", // Purple
              //               "#EC4899", // Pink
              //               "#171717", // Black
              //               "#FFFFFF", // White
              //             ].map((color) => (
              //               <Button
              //                 key={color}
              //                 variant="outline"
              //                 className="h-8 w-8 p-0 rounded-md border border-muted-foreground/10 hover:scale-110 transition-transform"
              //                 style={{
              //                   backgroundColor: color,
              //                   border:
              //                     color === "#FFFFFF"
              //                       ? "1px solid #e2e8f0"
              //                       : undefined,
              //                 }}
              //                 onClick={() => handleColorSelect(color)}
              //               >
              //                 <span className="sr-only">Select {color}</span>
              //               </Button>
              //             ))}
              //           </div>
              //         </div>
              //       </div>
              //     </AnimatedCard>

              //     {/* Inspiration Section */}
              //     <AnimatedCard className="p-6" variant="default">
              //       <h3 className="font-semibold text-xl mb-4 flex items-center">
              //         <ImageIcon className="h-5 w-5 mr-2 text-primary" />
              //         Inspiration Images
              //       </h3>

              //       <div className="grid gap-4">
              //         <div className="bg-muted/50 rounded-lg p-4">
              //           <h4 className="text-sm font-medium mb-3">
              //             Upload Inspiration
              //           </h4>
              //           <div className="mb-4">
              //             <FileUploadButton
              //               onFileSelected={(file, previewUrl) => {
              //                 if (file && previewUrl) {
              //                   // Add the image to the project inspiration images
              //                   const newImagesList = [
              //                     ...projectInfo.inspirationImages,
              //                     previewUrl,
              //                   ];

              //                   setProjectInfo((prev) => ({
              //                     ...prev,
              //                     inspirationImages: newImagesList,
              //                   }));

              //                   // Show toast
              //                   showExtractionToast(
              //                     "Inspiration Image",
              //                     file.name,
              //                     "Added to your project"
              //                   );

              //                   // Add a message in the chat about this
              //                   handleSendMessage(
              //                     `I've uploaded an inspiration image called ${file.name}. Please use this as design inspiration.`
              //                   );
              //                 }
              //               }}
              //               fileType="image"
              //               buttonText="Upload Inspiration Image"
              //               variant="outline"
              //               className="w-full"
              //             />
              //           </div>

              //           <h4 className="text-sm font-medium mt-4 mb-3">
              //             Current Inspiration
              //           </h4>
              //           <div className="grid grid-cols-2 gap-3">
              //             {projectInfo.inspirationImages.length > 0 ? (
              //               projectInfo.inspirationImages.map((img, i) => (
              //                 <div
              //                   key={i}
              //                   className="aspect-video rounded-md overflow-hidden border border-muted-foreground/10 bg-muted/30 group relative"
              //                 >
              //                   <img
              //                     src={img}
              //                     alt={`Inspiration ${i + 1}`}
              //                     className="w-full h-full object-cover"
              //                   />
              //                   <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              //                     <Button
              //                       variant="destructive"
              //                       size="sm"
              //                       className="h-8 w-8 rounded-full p-0"
              //                       onClick={() => {
              //                         // Remove image from inspirations
              //                         const oldImages = [
              //                           ...projectInfo.inspirationImages,
              //                         ];
              //                         setProjectInfo((prev) => ({
              //                           ...prev,
              //                           inspirationImages:
              //                             prev.inspirationImages.filter(
              //                               (_, index) => index !== i
              //                             ),
              //                         }));

              //                         toast({
              //                           title: "Inspiration image removed",
              //                           description: `Removed image ${i + 1} from inspiration board`,
              //                           variant: "default",
              //                         });
              //                       }}
              //                     >
              //                       <X className="h-4 w-4" />
              //                     </Button>
              //                   </div>
              //                 </div>
              //               ))
              //             ) : (
              //               <div className="col-span-2 bg-muted/30 rounded-md p-4 text-center text-muted-foreground flex flex-col items-center justify-center aspect-video">
              //                 <ImageIcon className="h-8 w-8 mb-2 opacity-40" />
              //                 <p className="text-sm">
              //                   No inspiration images yet
              //                 </p>
              //               </div>
              //             )}
              //           </div>
              //         </div>
              //       </div>
              //     </AnimatedCard>

              //     {/* Design Style Section */}
              //     <AnimatedCard className="p-6" variant="default">
              //       <h3 className="font-semibold text-xl mb-4 flex items-center">
              //         <LayoutIcon className="h-5 w-5 mr-2 text-primary" />
              //         Design Style
              //       </h3>

              //       <div className="grid gap-4">
              //         <div className="bg-muted/50 rounded-lg p-4">
              //           <h4 className="text-sm font-medium mb-3">
              //             Select Style Preferences
              //           </h4>
              //           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              //             {[
              //               { name: "Minimalist", icon: "✧" },
              //               { name: "Modern", icon: "△" },
              //               { name: "Corporate", icon: "◼" },
              //               { name: "Creative", icon: "✿" },
              //               { name: "Playful", icon: "◉" },
              //               { name: "Elegant", icon: "✦" },
              //             ].map((style) => (
              //               <Button
              //                 key={style.name}
              //                 variant={
              //                   projectInfo.designPreferences ===
              //                   style.name.toLowerCase()
              //                     ? "default"
              //                     : "outline"
              //                 }
              //                 className="h-auto py-3 flex flex-col items-center justify-center gap-2"
              //                 onClick={() => {
              //                   const oldStyle = projectInfo.designPreferences;
              //                   const newStyle = style.name.toLowerCase();

              //                   setProjectInfo((prev) => ({
              //                     ...prev,
              //                     designPreferences: newStyle,
              //                   }));

              //                   toast({
              //                     title: "Design style updated",
              //                     description: `Changed style to ${style.name}`,
              //                     variant: "success",
              //                   });

              //                   // Add a message in the chat about this
              //                   handleSendMessage(
              //                     `I prefer a ${style.name.toLowerCase()} design style for my website.`
              //                   );
              //                 }}
              //               >
              //                 <span className="text-2xl">{style.icon}</span>
              //                 <span className="text-xs">{style.name}</span>
              //               </Button>
              //             ))}
              //           </div>
              //         </div>
              //       </div>
              //     </AnimatedCard>

              //     {/* Typography Section */}
              //     <AnimatedCard className="p-6" variant="default">
              //       <h3 className="font-semibold text-xl mb-4 flex items-center">
              //         <svg
              //           className="h-5 w-5 mr-2 text-primary"
              //           viewBox="0 0 24 24"
              //           fill="none"
              //           xmlns="http://www.w3.org/2000/svg"
              //         >
              //           <path
              //             d="M4 7C4 6.44772 4.44772 6 5 6H19C19.5523 6 20 6.44772 20 7V17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17V7Z"
              //             stroke="currentColor"
              //             strokeWidth="2"
              //           />
              //           <path
              //             d="M7 11H17"
              //             stroke="currentColor"
              //             strokeWidth="2"
              //             strokeLinecap="round"
              //           />
              //           <path
              //             d="M9 15H15"
              //             stroke="currentColor"
              //             strokeWidth="2"
              //             strokeLinecap="round"
              //           />
              //         </svg>
              //         Typography
              //       </h3>

              //       <div className="bg-muted/50 rounded-lg p-4">
              //         <h4 className="text-sm font-medium mb-3">
              //           Select Font Style
              //         </h4>
              //         <TypographySelector
              //           currentFont={projectInfo.typography}
              //           onFontChange={handleFontChange}
              //           onMessageSend={handleSendMessage}
              //         />
              //       </div>
              //     </AnimatedCard>
              //   </div>
              // </motion.div>

              <DesignStudio
                ProjectInfo2={projectInfo}
                availablePalettes={colorPalettes} // Pass your predefined data
                availableFontPairing2s={fontPairings}
                availableLayoutOption2s={layoutOptions}
                availableDesignStyle2s={designStyles}
                onPaletteChange={handlePaletteChange}
                onFontChange={handleFontChange}
                onLayoutChange={handleLayoutChange}
                onStyleChange={handleStyleChange}
              />
            )}

            {activeSection === "inspiration" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto p-6"
              >
                <div className="max-w-2xl mx-auto space-y-6">
                  <h2 className="text-xl font-semibold">Inspiration Board</h2>
                  <p className="text-muted-foreground">
                    Upload images or add website links that inspire you.
                  </p>

                  <Card>
                    <CardContent className="p-6">
                      <label htmlFor="real-file-upload">
                        <div className="w-full h-32 flex flex-col gap-2 border-dashed border-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <span>Upload inspiration image</span>
                        </div>
                      </label>
                      <input
                        id="real-file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                      />

                      {projectInfo.inspirationImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          {projectInfo.inspirationImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative group aspect-video bg-muted rounded-md overflow-hidden border"
                            >
                              {img.startsWith("data:") ||
                              img.startsWith("/mock-images/") ? (
                                <img
                                  src={img}
                                  alt={`Inspiration ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 text-xs">
                                Inspiration Image {idx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-base font-medium mb-4">
                        Website Inspiration
                      </h3>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Paste website URL"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <Button
                          className="absolute right-1 top-1 h-7 px-2"
                          onClick={() =>
                            handleSendMessage(
                              "I like the design of this website: https://example.com"
                            )
                          }
                        >
                          <Link2Icon className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeSection === "help" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto p-6"
              >
                <div className="max-w-2xl mx-auto space-y-6">
                  <h2 className="text-xl font-semibold">Help & Tips</h2>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-primary" />
                          Getting the Best Results
                        </h3>

                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            <p>
                              Be specific about your business, products, or
                              services
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            <p>Upload images that represent your brand style</p>
                          </div>
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            <p>
                              Use the design tools to select colors and styles
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            <p>Share examples of websites you like</p>
                          </div>
                          <div className="flex gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            <p>Describe your target audience in detail</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar with reopen button when closed */}
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 bottom-20 z-10 h-10 w-10 rounded-full shadow-md"
            onClick={toggleSidebar}
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        )}

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l bg-card overflow-y-auto relative h-full"
            >
              <div className="sticky top-0 bg-card z-10 p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Project Summary</h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <X size={18} />
                </Button>
              </div>

              <div className="p-4 space-y-6">
                {/* Project Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Project Progress</h3>
                    <span className="text-xs font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {progress < 25 &&
                      "Just getting started! Let's gather your requirements."}
                    {progress >= 25 &&
                      progress < 50 &&
                      "Making progress! Tell us more about your design preferences."}
                    {progress >= 50 &&
                      progress < 75 &&
                      "Great progress! Let's refine your website specifications."}
                    {progress >= 75 &&
                      progress < 100 &&
                      "Almost there! Just a few more details needed."}
                    {progress >= 100 && "Ready to generate your website!"}
                  </p>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Website Purpose
                    </h3>
                    <div className="bg-muted/50 rounded-md p-3 min-h-10 text-sm">
                      {projectInfo.purpose ? (
                        <span className="capitalize">
                          {projectInfo.purpose} Website
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not specified yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Target Audience
                    </h3>
                    <div className="bg-muted/50 rounded-md p-3 min-h-10 text-sm">
                      {projectInfo.targetAudience ? (
                        <span>{projectInfo.targetAudience}</span>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not specified yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Design Style</h3>
                    <div className="bg-muted/50 rounded-md p-3 min-h-10 text-sm">
                      {projectInfo.designPreferences ? (
                        <span>{projectInfo.designPreferences}</span>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not specified yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Color Scheme</h3>
                    <div className="bg-muted/50 rounded-md p-3">
                      {projectInfo.colorScheme.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {projectInfo.colorScheme.map((color) => (
                            <div
                              key={color}
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">
                          Not specified yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Next Steps</h3>
                  <ul className="space-y-2">
                    {!projectInfo.purpose && (
                      <li className="flex items-center gap-2 text-xs">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span>Define your website's purpose</span>
                      </li>
                    )}
                    {!projectInfo.targetAudience && (
                      <li className="flex items-center gap-2 text-xs">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span>Specify your target audience</span>
                      </li>
                    )}
                    {!projectInfo.designPreferences && (
                      <li className="flex items-center gap-2 text-xs">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span>Choose a design style</span>
                      </li>
                    )}
                    {projectInfo.colorScheme.length === 0 && (
                      <li className="flex items-center gap-2 text-xs">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span>Select color preferences</span>
                      </li>
                    )}
                    {projectInfo.inspirationImages.length === 0 && (
                      <li className="flex items-center gap-2 text-xs">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span>Add inspiration images</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Generate Button - only if progress is sufficient */}
                {progress >= 50 && (
                  <Button className="w-full mt-4" size="lg">
                    <RocketIcon className="mr-2 h-4 w-4" /> Generate Website
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
