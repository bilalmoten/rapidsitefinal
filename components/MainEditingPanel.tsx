import React, { RefObject } from "react";

interface MainEditingPanelProps {
  iframeRef: RefObject<HTMLIFrameElement>;
  zoom: number;
  isPickMode: boolean;
  hoveredElement: Element | null;
  selectedElement: Element | null;
}

const MainEditingPanel: React.FC<MainEditingPanelProps> = ({
  iframeRef,
  zoom,
  isPickMode,
  hoveredElement,
  selectedElement,
}) => {
  return (
    <div className="flex-1 relative overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg m-4">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0 rounded-lg"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top left",
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
