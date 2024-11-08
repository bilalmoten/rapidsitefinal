// components/ClientEditor.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatWindow from "./ChatWindow";
import MainEditingPanel from "./MainEditingPanel";
import FloatingControls from "./FloatingControls";
import TopBar from "./TopBar";
import PagesPanel from "./PagesPanel";
import TextPopup from "./textpopup2";
import { toast } from "sonner";
import AddressBar from "./AddressBar";
import { createClient } from "@/utils/supabase/client";
import CodeView from "./CodeView";
// import HoverPill from "./HoverPill";
import ImageEditPill from "./ImageEditPill";
import TextFormatBar from "./TextFormatBar";
import {
  applyFormatting,
  getElementFormatting,
  getFormatBarPosition,
  highlightElement,
  setActiveHighlight,
  applyFormattingToSelection,
} from "@/lib/editor/textFormatting";
import { TextFormatAction, TextFormats } from "@/types/editor";

interface ClientEditorProps {
  initialContent: string;
  userId: string; // User ID to identify the user
  websiteId: string; // Website ID to identify the website
  initialPageTitle: string; // Page title to identify the page
  subdomain: string;
  pages: string[];
}

const ClientEditor: React.FC<ClientEditorProps> = ({
  initialContent,
  userId,
  websiteId,
  initialPageTitle,
  subdomain,
  pages,
}) => {
  const [siteContent, setSiteContent] = useState<string>(initialContent);
  const [zoom, setZoom] = useState(100);
  const [isPickMode, setIsPickMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Ensure this is false by default
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isAnyElementSelected, setIsAnyElementSelected] = useState(false);
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pageTitle, setPageTitle] = useState<string>(initialPageTitle);
  const [viewport, setViewport] = useState("desktop");
  const [isCodeViewActive, setIsCodeViewActive] = useState(false);
  const [userRequest, setUserRequest] = useState("");
  const [isTextPopupOpen, setIsTextPopupOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([initialContent]); // Store HTML states
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [editMode, setEditMode] = useState<"quick" | "quality" | null>(null);
  const [pillPosition, setPillPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showImagePill, setShowImagePill] = useState(false);
  const [imagePillPosition, setImagePillPosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState<Element | null>(null);
  const [showFormatBar, setShowFormatBar] = useState(false);
  const [formatBarState, setFormatBarState] = useState<{
    isActive: boolean;
    position: { x: number; y: number };
    currentFormats: TextFormats;
  }>({
    isActive: false,
    position: { x: 0, y: 0 },
    currentFormats: {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontSize: "base",
    },
  });
  const [formatBarAction, setFormatBarAction] =
    useState<TextFormatAction | null>(null);

  const handlePageChange = async (newPage: string) => {
    // Save current page before switching
    await handleSave();

    setPageTitle(newPage);
    const supabase = await createClient();
    const { data: page, error } = await supabase
      .from("pages")
      .select("content")
      .eq("user_id", userId)
      .eq("website_id", websiteId)
      .eq("title", newPage)
      .single();

    if (error) {
      console.error("Error fetching page content:", error);
      toast.error("Error loading page content");
      return;
    }

    // Reset undo/redo stack when changing pages
    setUndoStack([page?.content || ""]);
    setCurrentStateIndex(0);
    setSiteContent(page?.content || "");
  };

  const updateEventListeners = (iframeDoc: Document) => {
    iframeDoc.body.removeEventListener("mouseover", handleMouseOver);
    iframeDoc.body.removeEventListener("mouseout", handleMouseOut);
    iframeDoc.body.removeEventListener("click", handleClick);

    if (isPickMode) {
      iframeDoc.body.addEventListener("mouseover", handleMouseOver);
      iframeDoc.body.addEventListener("mouseout", handleMouseOut);
    }

    if (isPickMode || isEditMode) {
      iframeDoc.body.addEventListener("click", handleClick);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && (isAnyElementSelected || isTextPopupOpen)) {
        e.preventDefault(); // Prevent default Escape key behavior
        setSelectedElement(null);
        setClickPosition(null);
        setIsAnyElementSelected(false);
        setIsTextPopupOpen(false);
        const selectedElements = document.querySelectorAll(".selected-element");
        selectedElements.forEach((el) =>
          el.classList.remove("selected-element")
        );
      }
    },
    [isAnyElementSelected, isTextPopupOpen]
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) return;

      iframeDoc.open();
      iframeDoc.write(siteContent);
      iframeDoc.close();

      // Add Tailwind CSS
      const tailwindLink = iframeDoc.createElement("link");
      tailwindLink.rel = "stylesheet";
      tailwindLink.href =
        "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
      iframeDoc.head.appendChild(tailwindLink);

      // Add your global styles with more specific selectors
      const globalStyles = iframeDoc.createElement("style");
      globalStyles.textContent = `
          /* Selection styles */
          *[contenteditable="true"] {
              position: relative;
              outline: none !important;
              z-index: 1;
          }

          *[contenteditable="true"]::selection {
              background: rgba(59, 130, 246, 0.3) !important;
              color: inherit;
          }

          *[contenteditable="true"]::-moz-selection {
              background: rgba(59, 130, 246, 0.3) !important;
              color: inherit;
          }

          /* Active element styles */
          .text-highlight-active {
              position: relative;
              background-color: rgba(59, 130, 246, 0.1) !important;
              border-radius: 4px;
          }

          .text-highlight-active::after {
              content: "";
              position: absolute;
              inset: -2px;
              border: 2px solid rgba(59, 130, 246, 0.5);
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
              border-radius: 4px;
              pointer-events: none;
              z-index: -1;
          }

          /* Hover highlight styles */
          .text-highlight {
              position: relative;
          }

          .text-highlight::after {
              content: "";
              position: absolute;
              inset: -2px;
              background-color: rgba(59, 130, 246, 0.15);
              border: 2px dashed rgba(59, 130, 246, 0.4);
              border-radius: 4px;
              pointer-events: none;
              z-index: -1;
          }
      `;
      iframeDoc.head.appendChild(globalStyles);

      updateEventListeners(iframeDoc);
    };

    iframe.srcdoc = siteContent;
    iframe.onload = handleLoad;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      iframe.onload = null;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [siteContent, isPickMode, isEditMode]);

  const handleMouseOver = (e: MouseEvent) => {
    if (!isPickMode || isAnyElementSelected || isTextPopupOpen) return;
    e.stopPropagation();
    const target = e.target as Element;
    setHoveredElement(target);
    target.classList.add("hovered-element");

    // Set pill position
    setPillPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (!isPickMode || isAnyElementSelected || isTextPopupOpen) return;
    const target = e.target as Element;
    target.classList.remove("hovered-element");
    setHoveredElement(null);
    setPillPosition(null);
  };

  const handleImageEdit = (target: Element) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("website_id", websiteId);
        formData.append("user_id", userId);

        const response = await fetch("/api/upload_image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("Error uploading image");
          toast.error("error: " + response.statusText);
          return;
        }

        const { imageUrl } = await response.json();
        if (imageUrl) {
          // Directly update the src attribute of the target image element
          (target as HTMLImageElement).src = imageUrl;
          // Then update the src attribute in the cloned document
          updateElementAttribute(target, "src", imageUrl);
        }
      }
    };
    input.click();
  };

  const handleTextEdit = (target: Element) => {
    if (!isEditMode) return;

    // Remove any existing contenteditable attributes
    const editableElements =
      iframeRef.current?.contentDocument?.querySelectorAll(
        '[contenteditable="true"]'
      );
    editableElements?.forEach((el) => {
      el.removeAttribute("contenteditable");
      el.classList.remove("text-highlight-active");
    });

    setSelectedElement(target);
    setShowFormatBar(true);

    // Get position considering iframe offset
    const position = getFormatBarPosition(target);

    setFormatBarState({
      isActive: true,
      position: position,
      currentFormats: getElementFormatting(target),
    });

    setActiveHighlight(target);
    target.setAttribute("contenteditable", "true");
    (target as HTMLElement).focus();

    // Add selection change handler
    const handleSelectionChange = () => {
      const selection = target.ownerDocument?.getSelection();
      if (selection && !selection.isCollapsed) {
        // Update format bar position based on selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const iframeRect = (
          target.ownerDocument as any
        ).defaultView.frameElement.getBoundingClientRect();

        setFormatBarState((prev) => ({
          ...prev,
          position: {
            x: rect.left + iframeRect.left + rect.width / 2,
            y: Math.max(rect.top + iframeRect.top - 45, 10),
          },
        }));

        // If there's a pending format action, apply it to the selection
        if (formatBarAction) {
          applyFormattingToSelection(target, formatBarAction);
          setFormatBarAction(null);
        }
      }
    };

    target.ownerDocument?.addEventListener(
      "selectionchange",
      handleSelectionChange
    );

    const handleBlur = (ev: FocusEvent) => {
      const formatBar = document.querySelector(".format-bar");
      const relatedTarget = ev.relatedTarget as Node | null;

      if (formatBar?.contains(relatedTarget)) {
        setTimeout(() => (target as HTMLElement).focus(), 0);
        return;
      }

      target.removeAttribute("contenteditable");
      updateElementContent(target);
      setFormatBarState((prev) => ({ ...prev, isActive: false }));
      setShowFormatBar(false);
      setSelectedElement(null);
      target.classList.remove("text-highlight-active");
      target.ownerDocument?.removeEventListener(
        "selectionchange",
        handleSelectionChange
      );
      target.removeEventListener("blur", handleBlur as EventListener);
    };

    target.addEventListener("blur", handleBlur as EventListener);
  };

  const updateElementAttribute = (
    element: Element,
    attribute: string,
    value: string
  ) => {
    const updatedContent = updateElementInHTML(element, (el) => {
      el.setAttribute(attribute, value);
      return el.outerHTML;
    });
    setSiteContent(updatedContent);
  };

  const updateElementContent = (element: Element) => {
    const updatedContent = updateElementInHTML(element, (el) => {
      el.innerHTML = element.innerHTML;
      // Copy over all classes
      el.className = element.className;
      return el.outerHTML;
    });

    // Push to undo stack
    pushNewState(updatedContent);
    setSiteContent(updatedContent);
  };

  const updateElementInHTML = (
    element: Element,
    updateFn: (el: Element) => string
  ): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(siteContent, "text/html");
    const xpath = getXPath(element);
    const result = doc.evaluate(
      xpath,
      doc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    if (result.singleNodeValue) {
      const nodeAsElement = result.singleNodeValue as HTMLElement;
      const updatedElement = updateFn(nodeAsElement);
      nodeAsElement.outerHTML = updatedElement;
      return doc.documentElement.outerHTML;
    }
    return siteContent;
  };

  const getXPath = (element: Element): string => {
    if (element.id !== "") {
      return `//*[@id="${element.id}"]`;
    }
    if (element === document.body) {
      return "/html/body";
    }
    let ix = 0;
    const siblings = element.parentNode?.childNodes || [];
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        return (
          getXPath(element.parentNode as Element) +
          "/" +
          element.tagName.toLowerCase() +
          "[" +
          (ix + 1) +
          "]"
        );
      }
      if (
        sibling.nodeType === 1 &&
        (sibling as Element).tagName === element.tagName
      ) {
        ix++;
      }
    }
    return "";
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const togglePickMode = () => {
    setIsPickMode(!isPickMode);
    if (isEditMode) setIsEditMode(false);
    // Reset selection state when toggling modes
    setSelectedElement(null);
    setClickPosition(null);
    setIsAnyElementSelected(false);
    setIsTextPopupOpen(false);
    const selectedElements = document.querySelectorAll(".selected-element");
    selectedElements.forEach((el) => el.classList.remove("selected-element"));
  };
  const toggleEditMode = () => {
    // If we're currently in edit mode, save before exiting
    if (isEditMode) {
      handleSave();
    }

    setIsEditMode(!isEditMode);
    if (isPickMode) setIsPickMode(false);

    // Reset selection state when toggling modes
    setSelectedElement(null);
    setClickPosition(null);
    setIsAnyElementSelected(false);
    setIsTextPopupOpen(false);
    const selectedElements = document.querySelectorAll(".selected-element");
    selectedElements.forEach((el) => el.classList.remove("selected-element"));
  };

  const handleSave = async () => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      // Remove all contenteditable attributes before saving
      const editableElements = iframeDoc.querySelectorAll(
        '[contenteditable="true"]'
      );
      editableElements.forEach((el) => el.removeAttribute("contenteditable"));

      // Get the cleaned HTML content
      const updatedContent = iframeDoc.body.innerHTML;
      setSiteContent(updatedContent);

      console.log("Saving with websiteId:", websiteId);

      const response = fetch("/api/save_website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userId,
          content: updatedContent,
          title: pageTitle,
          website_id: websiteId,
        }),
      });

      console.log("Title:", pageTitle);

      toast.promise(response, {
        loading: "Saving...",
        success: "Site saved!",
        error: "Error saving site",
      });
    }
  };

  const handleViewportChange = (newViewport: string) => {
    setViewport(newViewport);
    if (iframeRef.current) {
      switch (newViewport) {
        case "desktop":
          iframeRef.current.style.width = "100%";
          iframeRef.current.style.height = "100%";
          break;
        case "tablet":
          iframeRef.current.style.width = "768px";
          iframeRef.current.style.height = "780px";
          break;
        case "mobile":
          iframeRef.current.style.width = "375px";
          iframeRef.current.style.height = "667px";
          break;
      }
    }
  };

  const handleThemeChange = () => {
    // Implement theme change logic
  };

  const toggleCodeView = () => {
    setIsCodeViewActive(!isCodeViewActive);
  };

  const handleUserRequest = async (
    request: string,
    mode: "quick" | "quality"
  ) => {
    if (!selectedElement || !iframeRef.current?.contentDocument) return;

    const elementCode = selectedElement.outerHTML;
    const fullPageCode = initialContent;

    try {
      const response = await fetch("/api/handle_element_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullPageCode: fullPageCode,
          model: mode === "quick" ? "o1-mini" : "gpt-4o-mini",
          elementCode,
          userRequest: request,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      const result = await response.json();
      console.log("API response:", result);

      if (result.updatedCode) {
        // Store current state before making changes
        const currentContent =
          iframeRef.current.contentDocument?.documentElement.outerHTML || "";

        // Create a temporary element to hold the new content
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = result.updatedCode;
        const newElement = tempDiv.firstElementChild;

        if (newElement && selectedElement.parentNode) {
          // Replace the old element with the new one
          selectedElement.parentNode.replaceChild(newElement, selectedElement);

          // Update the site content state
          const iframeDoc = iframeRef.current.contentDocument;
          if (iframeDoc) {
            const updatedContent = iframeDoc.documentElement.outerHTML;

            toast.success("Element updated successfully", {
              action: {
                label: "Undo",
                onClick: () => handleUndo(),
              },
            });

            // Store the new state
            pushNewState(updatedContent);
            setSiteContent(updatedContent);

            // Force a re-render of the iframe
            iframeRef.current.srcdoc = updatedContent;

            // Reset selection state
            setSelectedElement(null);
            setIsAnyElementSelected(false);
            setIsTextPopupOpen(false);
            const selectedElements =
              iframeDoc.querySelectorAll(".selected-element");
            selectedElements.forEach((el: Element) =>
              el.classList.remove("selected-element")
            );

            // Re-enable hover effects
            updateEventListeners(iframeDoc);
          } else {
            toast.error("Failed to access iframe document");
          }
        } else {
          toast.error("Failed to update element");
        }
      } else {
        toast.error("No updated code received");
      }

      return response; // Return the response instead of result
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process request");
      throw error; // Re-throw the error to be caught by the TextPopup
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (!isPickMode && !isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as Element;

    if (isPickMode) {
      // Handle pick mode behavior
      if (isAnyElementSelected) {
        // Deselect element
        setSelectedElement(null);
        setClickPosition(null);
        setIsAnyElementSelected(false);
        setIsTextPopupOpen(false);
        const selectedElements = document.querySelectorAll(".selected-element");
        selectedElements.forEach((el) =>
          el.classList.remove("selected-element")
        );
      } else {
        // Select element and show text popup
        setSelectedElement(target);
        setClickPosition({ x: e.clientX, y: e.clientY });
        setIsAnyElementSelected(true);
        setIsTextPopupOpen(true);
        target.classList.add("selected-element");
      }
    } else if (isEditMode) {
      // Remove any existing contenteditable attributes first
      const editableElements =
        iframeRef.current?.contentDocument?.querySelectorAll(
          '[contenteditable="true"]'
        );
      editableElements?.forEach((el) => el.removeAttribute("contenteditable"));

      // Handle edit mode behavior
      if (target.tagName.toLowerCase() === "img") {
        setSelectedImage(target);
        setImagePillPosition({ x: e.clientX, y: e.clientY });
        setShowImagePill(true);
      } else if (
        ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "DIV"].includes(
          target.tagName
        )
      ) {
        handleTextEdit(target);
      }
    }
  };

  const pushNewState = (newContent: string) => {
    // Remove any states after current index (for when we're undoing and then making new changes)
    const newStack = undoStack.slice(0, currentStateIndex + 1);
    // Add new state
    newStack.push(newContent);
    // If we exceed 100 states, remove oldest
    if (newStack.length > 100) {
      newStack.shift();
    }
    setUndoStack(newStack);
    setCurrentStateIndex(newStack.length - 1);
  };

  const handleUndo = () => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex(currentStateIndex - 1);
      setSiteContent(undoStack[currentStateIndex - 1]);
      // Update iframe content
      if (iframeRef.current) {
        iframeRef.current.srcdoc = undoStack[currentStateIndex - 1];
      }
    }
  };

  const handleRedo = () => {
    if (currentStateIndex < undoStack.length - 1) {
      setCurrentStateIndex(currentStateIndex + 1);
      setSiteContent(undoStack[currentStateIndex + 1]);
      // Update iframe content
      if (iframeRef.current) {
        iframeRef.current.srcdoc = undoStack[currentStateIndex + 1];
      }
    }
  };

  // Add this near your other useEffect hooks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === "z") {
          e.preventDefault(); // Prevent browser's default undo
          handleUndo();
        } else if (e.key === "y") {
          e.preventDefault(); // Prevent browser's default redo
          handleRedo();
        }
      }
    };

    // Add the event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStateIndex, undoStack]); // Dependencies ensure we have latest state

  // Add handler for mode selection
  const handleModeSelect = (mode: "quick" | "quality") => {
    setEditMode(mode);
    // Show text popup with the selected mode
    setIsTextPopupOpen(true);
  };

  const handleImageUpload = () => {
    if (selectedImage) {
      handleImageEdit(selectedImage);
    }
    setShowImagePill(false);
  };

  const handleAddImageLink = () => {
    if (selectedImage) {
      const link = prompt("Enter image URL:");
      if (link) {
        (selectedImage as HTMLImageElement).src = link;
        updateElementAttribute(selectedImage, "src", link);
      }
    }
    setShowImagePill(false);
  };

  const handleAIGenerate = () => {
    // To be implemented later
    toast.info("AI Image Generation coming soon!");
    setShowImagePill(false);
  };

  return (
    <div className="flex h-[calc(100vh-110px)] bg-gray-100">
      <div className="flex-1 flex flex-col relative">
        <TopBar
          // zoom={zoom}
          // onZoomIn={handleZoomIn}
          // onZoomOut={handleZoomOut}
          isCodeViewActive={isCodeViewActive}
          onCodeViewToggle={toggleCodeView}
          onSave={handleSave}
          subdomain={subdomain}
          pageTitle={pageTitle}
          pages={pages}
          onPageChange={handlePageChange}
          onViewportChange={handleViewportChange}
          onThemeChange={handleThemeChange}
          // onCodeViewToggle={handleCodeViewToggle}
          iframeRef={iframeRef}
          viewport={viewport}
        />
        <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-200 p-4">
          <div
            className={`relative bg-white shadow-lg ${
              viewport !== "desktop" ? "rounded-lg overflow-hidden" : ""
            }`}
            style={{
              width: viewport === "desktop" ? "100%" : "auto",
              height: viewport === "desktop" ? "100%" : "auto",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {viewport !== "desktop" && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-300 flex items-center justify-center rounded-t-lg">
                <div className="w-16 h-1 bg-gray-400 rounded-full" />
              </div>
            )}
            <MainEditingPanel
              iframeRef={iframeRef}
              zoom={zoom}
              isPickMode={isPickMode}
              hoveredElement={hoveredElement}
              selectedElement={selectedElement}
              viewport={viewport}
            />
          </div>
        </div>
        {/* {isPickMode && pillPosition && !isAnyElementSelected && (
          <HoverPill
            position={pillPosition}
            onSelectMode={handleModeSelect}
            hoveredElement={hoveredElement}
          />
        )} */}
        {isPickMode && selectedElement && clickPosition && isTextPopupOpen && (
          <TextPopup
            selectedElement={selectedElement}
            clickPosition={clickPosition}
            onClose={() => {
              setSelectedElement(null);
              setIsAnyElementSelected(false);
              setIsTextPopupOpen(false);
              const selectedElements =
                document.querySelectorAll(".selected-element");
              selectedElements.forEach((el) =>
                el.classList.remove("selected-element")
              );
            }}
            screenHeight={window.innerHeight}
            screenWidth={window.innerWidth}
            onSubmitRequest={(request) => handleUserRequest(request, "quick")}
          />
        )}
        <FloatingControls
          isPickMode={isPickMode}
          isEditMode={isEditMode}
          togglePickMode={togglePickMode}
          toggleEditMode={toggleEditMode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={currentStateIndex > 0}
          canRedo={currentStateIndex < undoStack.length - 1}
        />
        {showImagePill && (
          <ImageEditPill
            position={imagePillPosition}
            onUpload={handleImageUpload}
            onAddLink={handleAddImageLink}
            onAIGenerate={handleAIGenerate}
            onClose={() => setShowImagePill(false)}
          />
        )}
        {showFormatBar && (
          <TextFormatBar
            position={formatBarState.position}
            isActive={formatBarState.isActive}
            currentFormats={formatBarState.currentFormats}
            onFormat={(action) => {
              if (selectedElement) {
                applyFormatting(selectedElement, action);
                // Update the format bar state to reflect changes
                setFormatBarState((prev) => ({
                  ...prev,
                  currentFormats: getElementFormatting(selectedElement),
                }));
                // Update the content in the main document
                updateElementContent(selectedElement);
              }
            }}
          />
        )}
      </div>
      <ChatWindow />
      {isCodeViewActive && (
        <CodeView
          content={siteContent}
          onClose={() => setIsCodeViewActive(false)}
        />
      )}
    </div>
  );
};

export default ClientEditor;
