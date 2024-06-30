import React from "react";

interface TextPopupProps {
  clickPosition: { x: number; y: number };
  onClose: () => void;
}

const TextPopup: React.FC<TextPopupProps> = ({ clickPosition, onClose }) => {
  if (!clickPosition) return null;

  return (
    <div
      className="absolute bg-white p-4 rounded-lg shadow-lg border border-gray-300"
      style={{
        top: `${clickPosition.y}px`, // Position at the Y coordinate of the click
        left: `${clickPosition.x}px`, // Position at the X coordinate of the click
        transform: "translate(-50%, -100%)", // Center it horizontally and vertically adjust
      }}
    >
      <p className="mb-2">Edit element</p>
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
