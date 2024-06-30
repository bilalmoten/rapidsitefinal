"use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Maximize2, Minimize2, Edit3 } from "lucide-react";

// interface ClientEditorProps {
//   content: string;
// }

// const ClientEditor: React.FC<ClientEditorProps> = ({ content }) => {
//   const [siteContent, setSiteContent] = useState<string>(content);
//   const [zoom, setZoom] = useState(100);
//   const [isPickMode, setIsPickMode] = useState(false);
//   const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
//   const [selectedElement, setSelectedElement] = useState<Element | null>(null);
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) {
//       console.log("iframe not found");
//       return;
//     }

//     const handleLoad = () => {
//       const iframeDoc = iframe.contentDocument;
//       if (!iframeDoc) {
//         console.log("iframeDoc not found");
//         return;
//       }

//       console.log("iframe loaded, writing content...");
//       iframeDoc.open();
//       iframeDoc.write(`
//       <style>
//         .hovered-element {
//           outline: 2px dashed blue !important;
//           outline-offset: -2px;
//         }
//       </style>
//       ${siteContent}
//     `);
//       iframeDoc.close();
//       updateEventListeners(iframeDoc);
//       console.log("Content written to iframe");
//     };

//     const updateEventListeners = (iframeDoc: Document) => {
//       removeEventListeners(iframeDoc);
//       if (isPickMode) {
//         addEventListeners(iframeDoc);
//         console.log("Event listeners added");
//       }
//     };

//     const addEventListeners = (doc: Document) => {
//       if (doc.body) {
//         doc.body.addEventListener("mouseover", handleMouseOver);
//         doc.body.addEventListener("mouseout", handleMouseOut);
//         doc.body.addEventListener("click", handleClick);
//       }
//     };

//     const removeEventListeners = (doc: Document) => {
//       if (doc.body) {
//         doc.body.removeEventListener("mouseover", handleMouseOver);
//         doc.body.removeEventListener("mouseout", handleMouseOut);
//         doc.body.removeEventListener("click", handleClick);
//       }
//     };

//     // Check if the iframe is already loaded
//     if (iframe.contentDocument?.readyState === "complete") {
//       handleLoad();
//     } else {
//       iframe.addEventListener("load", handleLoad);
//     }

//     return () => {
//       iframe.removeEventListener("load", handleLoad);
//       const iframeDoc = iframe.contentDocument;
//       if (iframeDoc) {
//         removeEventListeners(iframeDoc);
//       }
//     };
//   }, [siteContent, isPickMode]);

//   const handleMouseOver = (e: MouseEvent) => {
//     e.stopPropagation();
//     const target = e.target as Element;
//     setHoveredElement(target);
//     target.classList.add("hovered-element");
//   };

//   const handleMouseOut = (e: MouseEvent) => {
//     const target = e.target as Element;
//     target.classList.remove("hovered-element");
//     setHoveredElement(null);
//   };

//   const handleClick = (e: MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const target = e.target as Element;
//     setSelectedElement(target);
//   };

//   const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
//   const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
//   const togglePickMode = () => setIsPickMode(!isPickMode);

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Main content area */}
//       <div className="flex-1 flex flex-col">
//         {/* Top controls */}
//         <div className="bg-white p-4 flex justify-between items-center border-b">
//           <div className="flex space-x-2">
//             <button className="px-3 py-1 bg-gray-100 rounded">Button 1</button>
//             <button className="px-3 py-1 bg-gray-100 rounded">Button 2</button>
//             <button className="px-3 py-1 bg-gray-100 rounded">Button 3</button>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button onClick={handleZoomOut}>
//               <Minimize2 size={20} />
//             </button>
//             <span>{zoom}%</span>
//             <button onClick={handleZoomIn}>
//               <Maximize2 size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Website preview area */}
//         <div className="flex-1 relative overflow-hidden">
//           <iframe
//             ref={iframeRef}
//             className="w-full h-full border-0"
//             style={{
//               transform: `scale(${zoom / 100})`,
//               transformOrigin: "top left",
//             }}
//           />
//           {isPickMode && hoveredElement && (
//             <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
//               <div
//                 className="border-2 border-blue-500 border-dashed absolute"
//                 style={{
//                   top: `${hoveredElement.getBoundingClientRect().top}px`,
//                   left: `${hoveredElement.getBoundingClientRect().left}px`,
//                   width: `${hoveredElement.getBoundingClientRect().width}px`,
//                   height: `${hoveredElement.getBoundingClientRect().height}px`,
//                 }}
//               />
//             </div>
//           )}
//           {isPickMode && selectedElement && (
//             <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
//               <p>Edit {selectedElement.tagName.toLowerCase()}</p>
//               <button
//                 className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
//                 onClick={() => setSelectedElement(null)}
//               >
//                 Close
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Floating controls at the bottom */}
//         <div className="absolute bottom-4 left-4 right-4 flex justify-between">
//           <button
//             className={`px-4 py-2 rounded flex items-center ${
//               isPickMode ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//             onClick={togglePickMode}
//           >
//             <Edit3 size={20} className="mr-2" />
//             {isPickMode ? "Exit Pick Mode" : "Pick and Edit"}
//           </button>
//           <button className="bg-blue-500 text-white px-4 py-2 rounded">
//             Control 2
//           </button>
//         </div>
//       </div>

//       {/* Sidebar for chat window */}
//       <div className="w-1/4 bg-white p-4 border-l">
//         <h2 className="text-lg font-bold mb-4">Chat Window</h2>
//         {/* Add your chat interface here */}
//       </div>
//     </div>
//   );
// };

// export default ClientEditor;

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import ChatWindow from "./ChatWindow";
// import MainEditingPanel from "./MainEditingPanel";
// import FloatingControls from "./FloatingControls";
// import TopBar from "./TopBar";
// import PagesPanel from "./PagesPanel";
// import TextPopup from "./TextPopup";

// interface ClientEditorProps {
//   content: string;
// }

// const ClientEditor: React.FC<ClientEditorProps> = ({ content }) => {
//   const [siteContent, setSiteContent] = useState<string>(content);
//   const [zoom, setZoom] = useState(100);
//   const [isPickMode, setIsPickMode] = useState(false);
//   const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
//   const [selectedElement, setSelectedElement] = useState<Element | null>(null);
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) {
//       console.log("iframe not found");
//       return;
//     }

//     const handleLoad = () => {
//       const iframeDoc = iframe.contentDocument;
//       if (!iframeDoc) {
//         console.log("iframeDoc not found");
//         return;
//       }

//       console.log("iframe loaded, writing content...");
//       iframeDoc.open();
//       iframeDoc.write(`

//         ${siteContent}
//       `);
//       iframeDoc.close();
//       updateEventListeners(iframeDoc);
//       console.log("Content written to iframe");
//     };

//     const updateEventListeners = (iframeDoc: Document) => {
//       removeEventListeners(iframeDoc);
//       if (isPickMode) {
//         addEventListeners(iframeDoc);
//         console.log("Event listeners added");
//       }
//     };

//     const addEventListeners = (doc: Document) => {
//       if (doc.body) {
//         doc.body.addEventListener("mouseover", handleMouseOver);
//         doc.body.addEventListener("mouseout", handleMouseOut);
//         doc.body.addEventListener("click", handleClick);
//       }
//     };

//     const removeEventListeners = (doc: Document) => {
//       if (doc.body) {
//         doc.body.removeEventListener("mouseover", handleMouseOver);
//         doc.body.removeEventListener("mouseout", handleMouseOut);
//         doc.body.removeEventListener("click", handleClick);
//       }
//     };

//     // Check if the iframe is already loaded
//     if (iframe.contentDocument?.readyState === "complete") {
//       handleLoad();
//     } else {
//       iframe.addEventListener("load", handleLoad);
//     }

//     return () => {
//       iframe.removeEventListener("load", handleLoad);
//       const iframeDoc = iframe.contentDocument;
//       if (iframeDoc) {
//         removeEventListeners(iframeDoc);
//       }
//     };
//   }, [siteContent, isPickMode]);

//   const handleMouseOver = (e: MouseEvent) => {
//     e.stopPropagation();
//     const target = e.target as Element;
//     setHoveredElement(target);
//     target.classList.add("hovered-element");
//   };

//   const handleMouseOut = (e: MouseEvent) => {
//     const target = e.target as Element;
//     target.classList.remove("hovered-element");
//     setHoveredElement(null);
//   };

//   const handleClick = (e: MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const target = e.target as Element;
//     setSelectedElement(target);
//   };

//   const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
//   const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
//   const togglePickMode = () => setIsPickMode(!isPickMode);

//   return (
//     <div className="flex flex-col h-screen bg-white">
//       <div className="flex flex-1">
//         <ChatWindow />
//         <div className="flex-1 flex flex-col relative">
//           <TopBar
//             zoom={zoom}
//             onZoomIn={handleZoomIn}
//             onZoomOut={handleZoomOut}
//           />
//           <MainEditingPanel
//             iframeRef={iframeRef}
//             zoom={zoom}
//             isPickMode={isPickMode}
//             hoveredElement={hoveredElement}
//             selectedElement={selectedElement}
//           />
//           {isPickMode && selectedElement && (
//             <TextPopup
//               selectedElement={selectedElement}
//               onClose={() => setSelectedElement(null)}
//             />
//           )}
//           <FloatingControls
//             isPickMode={isPickMode}
//             togglePickMode={togglePickMode}
//           />
//         </div>
//         <PagesPanel />
//       </div>
//     </div>
//   );
// };

// export default ClientEditor;

import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import MainEditingPanel from "./MainEditingPanel";
import FloatingControls from "./FloatingControls";
import TopBar from "./TopBar";
import PagesPanel from "./PagesPanel";
import TextPopup from "./textpopup2";

interface ClientEditorProps {
  content: string;
}

const ClientEditor: React.FC<ClientEditorProps> = ({ content }) => {
  const [siteContent, setSiteContent] = useState<string>(content);
  const [zoom, setZoom] = useState(100);
  const [isPickMode, setIsPickMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isanyelementselected, setisanyelementselected] = useState(false);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      console.log("iframe not found");
      return;
    }

    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) {
        console.log("iframeDoc not found");
        return;
      }

      console.log("iframe loaded, writing content...");
      iframeDoc.open();
      iframeDoc.write(`  
        
        ${siteContent}  
      `);
      iframeDoc.close();
      updateEventListeners(iframeDoc);
      console.log("Content written to iframe");
    };

    const updateEventListeners = (iframeDoc: Document) => {
      removeEventListeners(iframeDoc);
      if (isPickMode || isEditMode) {
        addEventListeners(iframeDoc);
        console.log("Event listeners added");
      }
    };

    const addEventListeners = (doc: Document) => {
      if (doc.body) {
        doc.body.addEventListener("mouseover", handleMouseOver);
        doc.body.addEventListener("mouseout", handleMouseOut);
        doc.body.addEventListener("click", handleClick);
      }
    };

    const removeEventListeners = (doc: Document) => {
      if (doc.body) {
        doc.body.removeEventListener("mouseover", handleMouseOver);
        doc.body.removeEventListener("mouseout", handleMouseOut);
        doc.body.removeEventListener("click", handleClick);
      }
    };

    // Check if the iframe is already loaded
    if (iframe.contentDocument?.readyState === "complete") {
      handleLoad();
    } else {
      iframe.addEventListener("load", handleLoad);
    }

    return () => {
      iframe.removeEventListener("load", handleLoad);
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        removeEventListeners(iframeDoc);
      }
    };
  }, [siteContent, isPickMode, isEditMode]);

  const handleMouseOver = (e: MouseEvent) => {
    if ((!isPickMode && !isEditMode) || isanyelementselected) return;

    if (isanyelementselected == false) {
      e.stopPropagation();
      const target = e.target as Element;
      setHoveredElement(target);
      target.classList.add("hovered-element");
    }
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (!isPickMode && !isEditMode) return;
    const target = e.target as Element;
    target.classList.remove("hovered-element");
    setHoveredElement(null);
  };

  const handleClick = (e: MouseEvent) => {
    if (selectedElement) {
      setSelectedElement(null);
      setClickPosition(null);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    const target = e.target as Element;
    setSelectedElement(target);
    setClickPosition({ x: e.clientX, y: e.clientY });
    setisanyelementselected(true);

    console.log("Element selected");
    setClickPosition({ x: e.clientX, y: e.clientY });
    if (isEditMode) {
      if (target.tagName === "IMG") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.result) {
                target.setAttribute("src", reader.result as string);
                setSiteContent(
                  iframeRef.current?.contentDocument?.body?.innerHTML || ""
                );
              }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } else if (
        ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "DIV"].includes(
          target.tagName
        )
      ) {
        target.setAttribute("contenteditable", "true");
        (target as HTMLElement).focus();

        const handleBlur = () => {
          target.removeAttribute("contenteditable");
          setSiteContent(
            iframeRef.current?.contentDocument?.body?.innerHTML || ""
          );
          target.removeEventListener("blur", handleBlur);
        };

        target.addEventListener("blur", handleBlur);
      }
    }
    setSelectedElement(target);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const togglePickMode = () => setIsPickMode(!isPickMode);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex flex-1">
        <ChatWindow />
        <div className="flex-1 flex flex-col relative">
          <TopBar
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
          <MainEditingPanel
            iframeRef={iframeRef}
            zoom={zoom}
            isPickMode={isPickMode}
            hoveredElement={hoveredElement}
            selectedElement={selectedElement}
          />
          {isPickMode && selectedElement && clickPosition && (
            <TextPopup
              selectedElement={selectedElement}
              clickPosition={clickPosition}
              onClose={() => {
                setSelectedElement(null);
                setisanyelementselected(false);
              }}
            />
          )}
          <FloatingControls
            isPickMode={isPickMode}
            isEditMode={isEditMode}
            togglePickMode={togglePickMode}
            toggleEditMode={toggleEditMode}
          />
        </div>
        <PagesPanel />
      </div>
    </div>
  );
};

export default ClientEditor;
