import React, { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  SendHorizontal,
  ImagePlus,
  Paperclip,
  Loader2,
  Mic,
  Laugh,
  Wand2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileUploadButton } from "./FileUploadButton";

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  selectedOptions?: string[];
  onClearSelectedOptions?: () => void;
  onSendSelectedOptions?: () => void;
  onFileSelected?: (file: File | null, previewUrl: string | null) => void;
  onOptionSelect?: (value: string, isMultiSelect?: boolean) => void;
  options?: Array<{ text: string; value: string; isMultiSelect?: boolean }>;
}

export function MessageInput({
  onSendMessage,
  isLoading,
  selectedOptions = [],
  onClearSelectedOptions = () => {},
  onSendSelectedOptions = () => {},
  onFileSelected = () => {},
  onOptionSelect,
  options = [],
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [comingSoonTooltip, setComingSoonTooltip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate a preview URL when a file is selected
  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      // The preview URL is now handled by FileUploadButton
      // This useEffect is kept for compatibility
    }

    return () => {
      // Clean up by revoking object URL if needed
      if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [selectedFile, filePreviewUrl]);

  const handleSubmit = () => {
    if (
      (message.trim() || selectedFile || selectedOptions.length > 0) &&
      !isLoading
    ) {
      let finalMessage = message;

      // If we have selected options, include them in the message
      if (selectedOptions.length > 0) {
        if (finalMessage.trim()) {
          finalMessage += "\n\n";
        }
        finalMessage += selectedOptions.join(". ");

        // Clear selected options after sending
        onClearSelectedOptions();
      }

      if (selectedFile) {
        // Add a reference to the file if not already mentioned
        if (
          !finalMessage.toLowerCase().includes("image") &&
          !finalMessage.toLowerCase().includes("file") &&
          !finalMessage.toLowerCase().includes("upload")
        ) {
          if (finalMessage.trim()) {
            finalMessage += "\n\n";
          }
          finalMessage += "I've uploaded an image for reference.";
        }
      }

      onSendMessage(finalMessage);
      setMessage("");
      setSelectedFile(null);
      setFilePreviewUrl(null);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  // Simplified file handling with the new component
  const handleFileChange = (file: File | null, previewUrl: string | null) => {
    setSelectedFile(file);
    setFilePreviewUrl(previewUrl);
    onFileSelected(file, previewUrl);

    // Add a message about the file if textarea is empty
    if (file && !message.trim()) {
      setMessage(`I'd like to use this image on my website.`);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    // Notify parent that file was removed
    onFileSelected(null, null);
  };

  // Show "Coming Soon" tooltip temporarily
  const showComingSoonTooltip = () => {
    setComingSoonTooltip(true);
    setTimeout(() => setComingSoonTooltip(false), 3000);
  };

  // Add example prompts
  const examplePrompts = [
    "I need a professional website for my consulting business",
    "I'd like a minimalist portfolio with a focus on my photography work",
    "Can you create an e-commerce site for my handmade jewelry?",
    "I need a website for my restaurant with online ordering",
  ];

  const handleExamplePrompt = (prompt: string) => {
    setMessage(prompt);

    // Focus the textarea and move cursor to end
    if (textareaRef.current) {
      textareaRef.current.focus();

      // Set cursor position to end
      const length = prompt.length;
      textareaRef.current.setSelectionRange(length, length);

      // Trigger resize
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  // Local handler for option selection (updated for both multi-select and single-select)
  const handleLocalOptionSelect = (
    value: string,
    isMultiSelect: boolean = false
  ) => {
    // Always add to selected options, regardless of multi-select status
    if (onOptionSelect) {
      onOptionSelect(value, true); // Treat all as multi-select until sent
    }
  };

  return (
    <div className="space-y-2">
      {/* Selected options indicator */}
      <AnimatePresence>
        {selectedOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap items-center gap-2 p-3 bg-muted/70 rounded-md"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Selected options:</span>
            </div>

            <div className="flex flex-wrap gap-2 flex-1">
              {selectedOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center"
                >
                  <span className="truncate max-w-[200px]">{option}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={onClearSelectedOptions}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>

              <Button
                type="button"
                size="sm"
                variant="default"
                className="h-6 px-2 text-xs"
                onClick={onSendSelectedOptions}
                disabled={isLoading}
              >
                <SendHorizontal className="h-3 w-3 mr-1" />
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick reply options if available */}
      <AnimatePresence>
        {options && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-2 bg-muted/30 rounded-md"
          >
            <div className="flex items-center mb-2">
              <span className="text-xs text-muted-foreground">
                Suggested replies:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.map((option, idx) => {
                const isSelected = selectedOptions.includes(option.value);
                const isMultiSelect = !!option.isMultiSelect;

                return (
                  <Button
                    key={idx}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full border-muted-foreground/20 transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={() =>
                      handleLocalOptionSelect(option.value, isMultiSelect)
                    }
                  >
                    {isMultiSelect && (
                      <span
                        className={cn(
                          "mr-1.5 flex h-4 w-4 items-center justify-center rounded-full border",
                          isSelected
                            ? "bg-primary-foreground border-primary-foreground"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && (
                          <Check className="h-2.5 w-2.5 text-primary" />
                        )}
                      </span>
                    )}
                    {option.text}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File selection preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-muted rounded-md overflow-hidden"
          >
            <div className="p-2 flex items-center justify-between border-b">
              <div className="flex items-center gap-2 text-sm">
                <ImagePlus className="h-4 w-4 text-muted-foreground" />
                <span className="truncate font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full"
                onClick={handleRemoveFile}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>

            {filePreviewUrl && (
              <div className="relative aspect-video max-h-[200px] overflow-hidden">
                <img
                  src={filePreviewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="p-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>This image will be added to your message</span>
              <Badge variant="outline" className="h-5 text-[10px]">
                Inspiration
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming soon tooltip for voice */}
      <AnimatePresence>
        {comingSoonTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-center gap-2 p-2 bg-primary/10 rounded-md text-primary text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Voice input coming soon!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedOptions.length > 0
                ? "Add to your selected options or press Send..."
                : "Type your message or use the tools below..."
            }
            className="pr-10 min-h-[60px] max-h-[200px] resize-none pl-4 py-3 rounded-2xl border-muted-foreground/20 focus:border-primary"
            disabled={isLoading}
          />

          <div className="absolute right-3 bottom-3 flex gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <FileUploadButton
                      onFileSelected={handleFileChange}
                      fileType="image"
                      buttonText=""
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary p-0"
                      icon={<ImagePlus className="h-4 w-4" />}
                      showToast={false}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Add inspiration image</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={showComingSoonTooltip}
                    disabled={isLoading}
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice input (coming soon)</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                        disabled={isLoading}
                      >
                        <Wand2 className="h-4 w-4" />
                        <span className="sr-only">Prompt examples</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-80 p-2"
                      align="end"
                      alignOffset={-40}
                    >
                      <h3 className="text-sm font-medium mb-2">
                        Example prompts
                      </h3>
                      <div className="space-y-1">
                        {examplePrompts.map((prompt, idx) => (
                          <Button
                            key={idx}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-auto py-2 text-sm"
                            onClick={() => handleExamplePrompt(prompt)}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent>Prompt examples</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground pl-1">
            <span className="hidden sm:inline">Press </span>
            <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px]">
              Enter
            </kbd>
            <span className="hidden sm:inline"> to send,</span>
            <span className="inline sm:hidden">/</span>
            <kbd className="px-1 py-0.5 rounded bg-muted border text-[10px] ml-1">
              Shift+Enter
            </kbd>
            <span className="hidden sm:inline"> for new line</span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (!message.trim() && !selectedFile && selectedOptions.length === 0)
            }
            size="sm"
            className="rounded-full px-4 h-9 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span className="mr-2">Send</span>
                <SendHorizontal className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
