// components/advanced-chat/ChatInput.tsx
"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon, PaperclipIcon, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string | null) => void;
  isLoading: boolean;
  isDisabled?: boolean; // To disable input during final stages
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isDisabled,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Allow only images for now
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle invalid file type (optional: show toast)
      setSelectedFile(null);
      setFilePreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const handleSend = () => {
    if ((!inputValue.trim() && !selectedFile) || isLoading || isDisabled)
      return;

    // TODO: Handle actual file upload here, get URL, then send message
    // For now, we'll just pass the preview URL for demo/visual purposes
    const imageUrlToSend = filePreviewUrl;

    onSendMessage(inputValue, imageUrlToSend);
    setInputValue("");
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline
      handleSend();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFilePreview = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative flex items-end gap-2">
      {/* File Upload Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0"
        onClick={triggerFileInput}
        disabled={isLoading || isDisabled}
        aria-label="Attach image"
      >
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Text Input Area */}
      <div className="flex-1 relative">
        {/* File Preview */}
        {filePreviewUrl && (
          <div className="absolute bottom-full left-0 mb-2 p-1 bg-muted border rounded-md shadow-sm z-10 max-w-[150px]">
            <img
              src={filePreviewUrl}
              alt="Preview"
              className="max-h-20 rounded-sm object-contain"
            />
            <button
              onClick={removeFilePreview}
              className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        )}
        <Textarea
          placeholder={
            isDisabled
              ? "Website generation in progress..."
              : "Ask about your website or describe a section..."
          }
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          // maxRows is not a valid prop for the default Textarea component
          className="min-h-[40px] resize-none pr-12 py-2" // Adjust padding for send button
          disabled={isLoading || isDisabled}
        />
        {/* Send Button */}
        <Button
          size="icon"
          className="absolute right-2 bottom-[7px] h-7 w-7" // Position inside textarea
          onClick={handleSend}
          disabled={
            (!inputValue.trim() && !selectedFile) || isLoading || isDisabled
          }
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
