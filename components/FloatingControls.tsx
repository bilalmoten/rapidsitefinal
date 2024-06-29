import React from "react";
import { Edit3 } from "lucide-react";

interface FloatingControlsProps {
  isPickMode: boolean;
  togglePickMode: () => void;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPickMode,
  togglePickMode,
}) => {
  return (
    <div className="  bg-white p-4 flex justify-between items-center border-t border-gray-300">
      <button
        className={`px-4 py-2 rounded flex items-center ${
          isPickMode ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={togglePickMode}
      >
        <Edit3 size={20} className="mr-2" />
        {isPickMode ? "Exit Pick Mode" : "Pick and Edit"}
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Control 2
      </button>
    </div>
  );
};

export default FloatingControls;
