import React, { useEffect, useRef, useState } from "react";
import { Zap, Sparkles, X, Loader2 } from "lucide-react";

interface TextPopupProps {
  selectedElement: Element | null;
  clickPosition: { x: number; y: number };
  onClose: () => void;
  screenHeight: number;
  screenWidth: number;
  onSubmitRequest: (request: string, mode: "quick" | "quality") => void;
}

const TextPopup: React.FC<TextPopupProps> = ({
  selectedElement,
  clickPosition,
  onClose,
  screenHeight,
  screenWidth,
  onSubmitRequest,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [request, setRequest] = useState("");
  const [mode, setMode] = useState<"quick" | "quality">("quick");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        if (!isProcessing) onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, isProcessing]);

  if (!selectedElement) return null;

  const maxTop = screenHeight - 350;
  const maxLeft = screenWidth - screenWidth / 1.5;
  const top = Math.min(clickPosition.y, maxTop);
  const left = Math.min(clickPosition.x, maxLeft);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await onSubmitRequest(request, mode);
      setRequest("");
      onClose();
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        transform: "translate(5%, 37%)",
      }}
      className={`bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-200 w-[420px] text-black transition-opacity duration-200 z-20 ${
        isProcessing ? "opacity-90" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isProcessing ? "bg-yellow-500 animate-pulse" : "bg-blue-500"
            }`}
          ></div>
          <h2 className="font-medium">
            {isProcessing
              ? "Processing changes..."
              : `Edit ${selectedElement.tagName.toLowerCase()}`}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isProcessing}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="bg-gray-50 p-1 rounded-lg mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setMode("quick")}
            disabled={isProcessing}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
              mode === "quick"
                ? "bg-white shadow-sm text-blue-600 ring-1 ring-gray-200"
                : "text-gray-600 hover:bg-gray-100"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Quick mode: Uses Gemini Flash with lower temperature for more predictable edits"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Quick</span>
          </button>
          <button
            onClick={() => setMode("quality")}
            disabled={isProcessing}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
              mode === "quality"
                ? "bg-white shadow-sm text-blue-600 ring-1 ring-gray-200"
                : "text-gray-600 hover:bg-gray-100"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Quality mode: Uses Gemini Flash with higher temperature for more creative edits"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Quality</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder={
              mode === "quick"
                ? "Quick edit - more predictable changes using Gemini AI..."
                : "Quality edit - more creative changes using Gemini AI..."
            }
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg 
                     text-sm placeholder:text-gray-400 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
            autoFocus
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400">
            {isProcessing ? "Please wait..." : "Press Esc to close"}
          </span>
          <button
            type="submit"
            disabled={!request.trim() || isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:hover:bg-blue-500
                     text-sm font-medium flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Apply Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextPopup;
