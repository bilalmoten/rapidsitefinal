import React from "react";
import { Edit3, Undo, Redo } from "lucide-react";

interface FloatingControlsProps {
  isPickMode: boolean;
  isEditMode: boolean;
  togglePickMode: () => void;
  toggleEditMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPickMode,
  isEditMode,
  togglePickMode,
  toggleEditMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="bg-white p-4 flex justify-between items-center border-b border-gray-300">
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded flex items-center ${
            isPickMode ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={togglePickMode}
        >
          <Edit3 size={20} className="mr-2" />
          {isPickMode ? "Exit Pick Mode" : "Pick and Edit"}
        </button>
        <button
          className={`px-4 py-2 rounded flex items-center ${
            isEditMode ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={toggleEditMode}
        >
          <Edit3 size={20} className="mr-2" />
          {isEditMode ? "Exit Edit Mode" : "Edit Mode"}
        </button>
        <button
          className={`px-4 py-2 rounded flex items-center ${
            !canUndo ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo size={20} className="mr-2" />
          Undo
        </button>
        <button
          className={`px-4 py-2 rounded flex items-center ${
            !canRedo ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo size={20} className="mr-2" />
          Redo
        </button>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Control 2
      </button>
    </div>
  );
};

export default FloatingControls;
