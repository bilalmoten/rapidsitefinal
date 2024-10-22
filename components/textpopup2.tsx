import React, { useEffect, useRef, useState } from "react";

interface TextPopupProps {
  selectedElement: Element | null;
  clickPosition: { x: number; y: number };
  onClose: () => void;
  screenHeight: number;
  screenWidth: number;
  onSubmitRequest: (request: string) => void;
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!selectedElement) return null;

  // Calculate the maximum top and left positions for the popup
  const maxTop = screenHeight - 350; // Adjust the value as needed
  const maxLeft = screenWidth - screenWidth / 1.5;
  // Calculate the actual top and left positions for the popup
  const top = Math.min(clickPosition.y, maxTop);
  const left = Math.min(clickPosition.x, maxLeft);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest(request);
    setRequest("");
    onClose();
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
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 max-w-sm text-black"
    >
      <h2 className="mb-2">
        Request changes to {selectedElement.tagName.toLowerCase()}:
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Enter your request..."
          className="w-full p-2 border rounded mb-2"
          autoFocus
        />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
          <span className="text-sm text-gray-500">Press Esc to close</span>
        </div>
      </form>
    </div>
  );
};

export default TextPopup;
