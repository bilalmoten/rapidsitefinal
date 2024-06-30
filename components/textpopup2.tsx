import React, { useEffect, useRef } from "react";

interface TextPopupProps {
  selectedElement: Element | null;
  clickPosition: { x: number; y: number };
  onClose: () => void;
}

const TextPopup: React.FC<TextPopupProps> = ({
  selectedElement,
  clickPosition,
  onClose,
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

  return (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        top: `${clickPosition.y}px`,
        left: `${clickPosition.x}px`,
        transform: "translate(-50%, -50%)",
      }}
      className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 max-w-sm"
    >
      <h2 className="text-black mb-2">
        Request changes to &lt;{selectedElement.tagName.toLowerCase()}&gt;
      </h2>
      <textarea
        className="w-full h-24 p-2 border rounded-md"
        placeholder="Explain your changes"
      />
      <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
        Request
      </button>
    </div>
  );
};

export default TextPopup;
