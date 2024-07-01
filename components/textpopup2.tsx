import React, { useEffect, useRef } from "react";

interface TextPopupProps {
  selectedElement: Element | null;
  clickPosition: { x: number; y: number };
  onClose: () => void;
  screenHeight: number;
  screenWidth: number;
}

const TextPopup: React.FC<TextPopupProps> = ({
  selectedElement,
  clickPosition,
  onClose,
  screenHeight,
  screenWidth,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
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
      <textarea
        className="w-full h-24 p-2 border rounded-md bg-slate-200"
        placeholder="Explain your changes"
      />
      <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
        Request
      </button>
    </div>
  );
};

export default TextPopup;
