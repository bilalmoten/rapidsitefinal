import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface TopBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void; // Add onSave prop
}

const TopBar: React.FC<TopBarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onSave,
}) => {
  return (
    <div className="bg-white p-4 flex justify-between items-center border-b border-gray-300 text-black">
      <div className="flex space-x-2">
        <button className="px-3 py-1 bg-gray-100 rounded">Button 1</button>
        <button className="px-3 py-1 bg-gray-100 rounded">Button 2</button>
        <button className="px-3 py-1 bg-gray-100 rounded">Button 3</button>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onZoomOut}>
          <Minimize2 size={20} />
        </button>
        <span>{zoom}%</span>
        <button onClick={onZoomIn}>
          <Maximize2 size={20} />
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Save
        </button>{" "}
      </div>
    </div>
  );
};

export default TopBar;
