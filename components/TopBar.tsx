import React, { useEffect, useState, useCallback } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  MoreHorizontal,
} from "lucide-react";

interface TopBarProps {
  onSave: () => void;
  subdomain: string;
  pageTitle: string;
  pages: string[];
  onPageChange: (newPage: string) => void;
  onViewportChange: (viewport: string) => void;
  onThemeChange: () => void;
  onCodeViewToggle: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  viewport: string;
  isCodeViewActive: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  onSave,
  subdomain,
  pageTitle,
  pages,
  onPageChange,
  onViewportChange,
  onThemeChange,
  onCodeViewToggle,
  iframeRef,
  viewport,
  isCodeViewActive,
}) => {
  const baseUrl = `https://${subdomain}.aiwebsitebuilder.tech/`;

  const [isFullscreen, setIsFullscreen] = useState(false);

  const applyViewportStyles = useCallback(
    (viewportType: string) => {
      if (iframeRef.current) {
        const parentDiv = iframeRef.current.parentElement;
        if (parentDiv) {
          switch (viewportType) {
            case "desktop":
              parentDiv.style.width = "100%";
              parentDiv.style.height = "100%";
              break;
            case "tablet":
              parentDiv.style.width = "768px";
              parentDiv.style.height = "780px";
              break;
            case "mobile":
              parentDiv.style.width = "375px";
              parentDiv.style.height = "667px";
              break;
          }
          iframeRef.current.style.width = "100%";
          iframeRef.current.style.height = "100%";
          iframeRef.current.style.overflow = "auto";
        }
      }
    },
    [iframeRef]
  );

  const handleViewportChange = (newViewport: string) => {
    onViewportChange(newViewport);
    applyViewportStyles(newViewport);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      applyViewportStyles(viewport);
    }
  }, [isFullscreen, viewport, applyViewportStyles]);

  return (
    <div className="bg-white p-2 flex items-center border-b border-gray-300 text-black ">
      <div className="flex items-center space-x-2 px-16 flex-grow">
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
      <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
        <button
          onClick={() => handleViewportChange("desktop")}
          className={`p-1 ${viewport === "desktop" ? "bg-gray-200" : ""}`}
        >
          <Monitor size={20} />
        </button>
        <button
          onClick={() => handleViewportChange("tablet")}
          className={`p-1 ${viewport === "tablet" ? "bg-gray-200" : ""}`}
        >
          <Tablet size={20} />
        </button>
        <button
          onClick={() => handleViewportChange("mobile")}
          className={`p-1 ${viewport === "mobile" ? "bg-gray-200" : ""}`}
        >
          <Smartphone size={20} />
        </button>
        <button
          onClick={toggleFullScreen}
          className="p-1 pr-3"
          title="Full-screen preview"
        >
          <Maximize2 size={20} />
        </button>
      </div>
      <div className="flex items-center space-x-4 border-l border-gray-300 pl-4">
        <button
          onClick={onThemeChange}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded"
        >
          Theme
        </button>
        <button
          onClick={onCodeViewToggle}
          className={`px-3 py-1 rounded ${
            isCodeViewActive ? "bg-blue-500 text-white" : "bg-black text-white"
          }`}
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
