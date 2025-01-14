import React, { RefObject } from "react";

interface MainEditingPanelProps {
  iframeRef: RefObject<HTMLIFrameElement>;
  zoom: number;
  isPickMode: boolean;
  hoveredElement: Element | null;
  selectedElement: Element | null;
  viewport: string;
}

const MainEditingPanel: React.FC<MainEditingPanelProps> = ({
  iframeRef,
  zoom,
  isPickMode,
  hoveredElement,
  selectedElement,
  viewport,
}) => {
  return (
    <div
      className="flex-1 relative overflow-auto"
      style={{
        width: "100%",
        height: viewport === "desktop" ? "100%" : "calc(100% - 24px)",
        paddingTop: viewport !== "desktop" ? "24px" : "0",
      }}
    >
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top left",
          minHeight: viewport === "desktop" ? "100%" : "100vh",
        }}
      />
      {isPickMode && hoveredElement && (
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          <div
            className="absolute bg-blue-200 opacity-40 rounded-lg"
            style={{
              top: `${hoveredElement.getBoundingClientRect().top - 4}px`,
              left: `${hoveredElement.getBoundingClientRect().left - 4}px`,
              width: `${hoveredElement.getBoundingClientRect().width + 8}px`,
              height: `${hoveredElement.getBoundingClientRect().height + 8}px`,
            }}
          />
          <div
            className="border-2 border-blue-500 border-dashed absolute rounded-lg"
            style={{
              top: `${hoveredElement.getBoundingClientRect().top - 4}px`,
              left: `${hoveredElement.getBoundingClientRect().left - 4}px`,
              width: `${hoveredElement.getBoundingClientRect().width + 8}px`,
              height: `${hoveredElement.getBoundingClientRect().height + 8}px`,
            }}
          />
          <div
            className="absolute bg-blue-500 text-white text-xs font-semibold px-1 rounded"
            style={{
              top: `${hoveredElement.getBoundingClientRect().top - 16}px`,
              left: `${hoveredElement.getBoundingClientRect().left}px`,
            }}
          >
            {hoveredElement.tagName.toLowerCase()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainEditingPanel;
