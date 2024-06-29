import React from "react";

interface TextPopupProps {
  selectedElement: Element | null;
  onClose: () => void;
}

const TextPopup: React.FC<TextPopupProps> = ({ selectedElement, onClose }) => {
  if (!selectedElement) return null;

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
      <p className="mb-2">Edit {selectedElement.tagName.toLowerCase()}</p>
      <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default TextPopup;
