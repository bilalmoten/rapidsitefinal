import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface TopBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  subdomain: string;
  pageTitle: string;
  pages: string[];
  onPageChange: (newPage: string) => void;
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
}) => {
  const baseUrl = `https://${subdomain}.aiwebsitebuilder.tech/`;

  return (
    <div className="bg-white p-4 flex justify-between items-center border-b border-gray-300 text-black">
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
        </button>
      </div>
    </div>
  );
};

export default TopBar;
