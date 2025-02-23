"use client";

import * as React from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Save,
  Code,
  MoreHorizontal,
  MessageSquare,
  ChevronDown,
  Undo,
  Redo,
  Wand2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  Edit3,
  Link,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EditorInterface() {
  const [device, setDevice] = React.useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [showChat, setShowChat] = React.useState(false);
  const [editMode, setEditMode] = React.useState<"manual" | "ai">("manual");
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true);
  const [selectedElement, setSelectedElement] = React.useState<string | null>(
    null
  );
  const [aiCommand, setAiCommand] = React.useState("");
  const [hoveredElement, setHoveredElement] = React.useState<string | null>(
    null
  );

  const handleHover = (elementId: string) => {
    setHoveredElement(elementId);
  };

  const handleAiCommand = () => {
    // Here you would implement the logic to process the AI command
    console.log("Processing AI command:", aiCommand);
    setAiCommand("");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
              >
                {sidebarExpanded ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <div className="flex items-center space-x-2 bg-muted px-2 py-1 rounded-md">
                <span className="text-sm text-muted-foreground">https://</span>
                <Input
                  className="h-7 w-[300px] bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  defaultValue="mywebsite.rapidai.website"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>home.html</DropdownMenuItem>
                    <DropdownMenuItem>about.html</DropdownMenuItem>
                    <DropdownMenuItem>services.html</DropdownMenuItem>
                    <DropdownMenuItem>contact.html</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Device Preview Controls */}
            <div className="flex items-center rounded-lg border bg-background p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === "desktop" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDevice("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desktop view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === "tablet" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDevice("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tablet view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === "mobile" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDevice("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mobile view</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Code className="mr-2 h-4 w-4" />
              Code
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              Publish
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Full Screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative flex flex-1">
        {/* Left Sidebar */}
        <div
          className={cn(
            "border-r bg-muted/30 transition-all duration-300",
            sidebarExpanded ? "w-64" : "w-14"
          )}
        >
          <div className="flex h-full flex-col">
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-2 p-2">
                <Button variant="ghost" className="justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  {sidebarExpanded && "Dashboard"}
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  {sidebarExpanded && "Settings"}
                </Button>
                <Button variant="ghost" className="justify-start">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {sidebarExpanded && "Help"}
                </Button>
              </div>
            </ScrollArea>
            <div className="p-2">
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                {sidebarExpanded && "Log Out"}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-muted/10 p-4 flex flex-col">
          <div
            className={cn(
              "mx-auto bg-background shadow-sm transition-all duration-200 flex-1",
              device === "desktop" && "w-full",
              device === "tablet" && "w-[768px]",
              device === "mobile" && "w-[360px]"
            )}
          >
            {/* Website Preview Content */}
            <div className="min-h-[calc(100vh-8rem)]">
              {/* This is where the actual website content would be rendered */}
              <div className="p-6">
                <div
                  className="flex items-center justify-between relative"
                  onMouseEnter={() => handleHover("header")}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600" />
                    <span className="text-xl font-bold">Fitness X</span>
                  </div>
                  <nav className="flex space-x-6">
                    {["Home", "About", "Services", "Contact"].map((item) => (
                      <Button key={item} variant="ghost" size="sm">
                        {item}
                      </Button>
                    ))}
                  </nav>
                  {hoveredElement === "header" && (
                    <div className="absolute top-full left-0 mt-2 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Write with AI
                      </Button>
                    </div>
                  )}
                </div>
                <div
                  className="mt-12 relative"
                  onMouseEnter={() => handleHover("hero")}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <h1 className="text-4xl font-bold">
                    Transform Your Body, Transform Your Life
                  </h1>
                  <p className="mt-4 text-lg">
                    Join us at Fitness X, where we provide top-notch facilities
                    and expert trainers to help you achieve your fitness goals.
                  </p>
                  <Button className="mt-6" size="lg">
                    Join Now
                  </Button>
                  {hoveredElement === "hero" && (
                    <div className="absolute top-full left-0 mt-2 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Write with AI
                      </Button>
                    </div>
                  )}
                </div>
                <div
                  className="mt-12 relative"
                  onMouseEnter={() => handleHover("image")}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  {hoveredElement === "image" && (
                    <div className="absolute top-full left-0 mt-2 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate with AI
                      </Button>
                      <Button size="sm" variant="outline">
                        <Link className="mr-2 h-4 w-4" />
                        Add Link
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls at the bottom */}
          <div className="mt-4 flex items-center justify-between bg-background p-2 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Button
                variant={editMode === "manual" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setEditMode("manual")}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Manual Edit
              </Button>
              <Button
                variant={editMode === "ai" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setEditMode("ai")}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                AI Edit
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            "absolute bottom-4 right-4 w-80 rounded-lg border bg-background shadow-lg transition-all duration-300",
            showChat ? "h-96" : "h-12"
          )}
        >
          <div className="flex h-12 items-center justify-between border-b px-4">
            <span className="font-semibold">AI Assistant</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
          {showChat && (
            <div className="flex h-[calc(100%-3rem)] flex-col p-4">
              <ScrollArea className="flex-1 mb-4">
                {/* Chat messages would go here */}
              </ScrollArea>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter AI command..."
                  value={aiCommand}
                  onChange={(e) => setAiCommand(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAiCommand()}
                />
                <Button onClick={handleAiCommand}>Send</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
