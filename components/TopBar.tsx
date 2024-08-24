import React, { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Maximize,
  MoreHorizontal,
  Code,
} from "lucide-react";

interface TopBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  subdomain: string;
  pageTitle: string;
  pages: string[];
  onPageChange: (newPage: string) => void;
  onViewportChange: (viewport: string) => void;
  onThemeChange: () => void;
  onCodeViewToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onSave,
  subdomain,
  pageTitle,
  pages,
  onPageChange,
  onViewportChange,
  onThemeChange,
  onCodeViewToggle,
}) => {
  const [activeViewport, setActiveViewport] = useState("desktop");
  const baseUrl = `https://${subdomain}.aiwebsitebuilder.tech/`;

  const handleViewportChange = (viewport: string) => {
    setActiveViewport(viewport);
    onViewportChange(viewport);
  };

  return (
    <div className="bg-white p-2 flex items-center border-b border-gray-300 text-black">
      <div className="flex items-center space-x-2 flex-grow">
        <span className="text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span className="text-sm text-gray-600">{baseUrl}</span>
        <select
          value={pageTitle}
          onChange={(e) => onPageChange(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-sm flex-grow"
        >
          {pages.map((page) => (
            <option key={page} value={page}>
              {page}.html
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2 border-l border-gray-300 pl-2">
        <button
          onClick={() => handleViewportChange("desktop")}
          className={`p-1 ${activeViewport === "desktop" ? "bg-gray-200" : ""}`}
        >
          <Monitor size={20} />
        </button>
        <button
          onClick={() => handleViewportChange("tablet")}
          className={`p-1 ${activeViewport === "tablet" ? "bg-gray-200" : ""}`}
        >
          <Tablet size={20} />
        </button>
        <button
          onClick={() => handleViewportChange("mobile")}
          className={`p-1 ${activeViewport === "mobile" ? "bg-gray-200" : ""}`}
        >
          <Smartphone size={20} />
        </button>
        <button onClick={onZoomIn} className="p-1">
          <Maximize size={20} />
        </button>
        <span className="text-sm">{zoom}%</span>
      </div>
      <div className="flex items-center space-x-2 border-l border-gray-300 pl-2">
        <button
          onClick={onThemeChange}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded"
        >
          Theme
        </button>
        <button
          onClick={onCodeViewToggle}
          className="px-3 py-1 bg-black text-white rounded"
        >
          Code
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Save
        </button>
        <button className="p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
