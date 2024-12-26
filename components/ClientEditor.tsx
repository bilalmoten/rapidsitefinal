// components/ClientEditor.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatWindow from "./ChatWindow";
import MainEditingPanel from "./MainEditingPanel";
import FloatingControls from "./FloatingControls";
import TopBar from "./TopBar";
// import PagesPanel from "./PagesPanel";
import TextPopup from "./textpopup2";
import useUndoRedo from "@/hooks/useUndoRedo"; // Adjust the path as necessary
import { toast } from "sonner";
import AddressBar from "./AddressBar";
// import { supabaseClient } from "@/utils/supabase/client";
import CodeView from "./CodeView";
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
import { createClient } from "@/utils/supabase/client";
import {
  checkAndUpdateAIEdits,
  checkWebsiteGenerationLimit,
  checkAIEditsLimit,
  incrementAIEdits,
} from "@/utils/usage-tracker";
// import debounce from "lodash.debounce";
// import DOMPurify from "dompurify";

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
  // const [siteContent, setSiteContent] = useState<string>(initialContent);
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
  // const [undoStack, setUndoStack] = useState<string[]>([initialContent]); // Store HTML states
  // const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const {
    present: siteContent,
    set: setSiteContent,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useUndoRedo<string>(initialContent, 100);
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
      // fontSize: "base",
    },
  });
  const [formatBarAction, setFormatBarAction] =
    useState<TextFormatAction | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pageCache, setPageCache] = useState<{ [key: string]: string }>({});
  const [isSwitchingPage, setIsSwitchingPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [viewportDimensions, setViewportDimensions] = useState({
    width: 0,
    height: 0,
  });
  const viewportRef = useRef<HTMLDivElement>(null);

  // Add resize observer
  useEffect(() => {
    if (!viewportRef.current || viewport === "desktop") return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setViewportDimensions({
        width: Math.round(width),
        height: Math.round(height),
      });
    });

    resizeObserver.observe(viewportRef.current);
    return () => resizeObserver.disconnect();
  }, [viewport]);

  const handleReset = () => {
    if (!viewportRef.current) return;
    viewportRef.current.style.width = viewport === "tablet" ? "768px" : "375px";
    viewportRef.current.style.height =
      viewport === "tablet" ? "1024px" : "667px";
  };

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  const handlePageChange = async (newPage: string) => {
    if (isSwitchingPage || isLoadingPage) return;
    setIsSwitchingPage(true);
    setIsLoadingPage(true);

    try {
      // Save current page before switching
      await handleSave();

      setPageTitle(newPage);
      console.log("Switching to new page:", newPage);

      if (pageCache[newPage]) {
        const cachedContent = pageCache[newPage];
        reset(cachedContent); // Reset the history with the new content
        setSiteContent(cachedContent); // Set the content, pushing it to history
        toast.success(`Loaded cached page: ${newPage}`);
      } else {
        const supabaseClient = await createClient();
        const { data: page, error } = await supabaseClient
          .from("pages")
          .select("content")
          .eq("user_id", userId)
          .eq("website_id", websiteId)
          .eq("title", newPage)
          .single();

        if (error || !page) {
          console.error(
            "Error fetching page content or page not found:",
            error
          );
          toast.error("Error loading page content");
          return;
        }

        let newContent = page.content;

        console.log("Fetched new page content of length:", newContent.length);

        // Reset undo/redo stack when changing pages
        reset(newContent); // Resets the history with the new content
        setSiteContent(newContent); // Pushes the new content to history

        // Cache the new page content
        setPageCache((prevCache) => ({ ...prevCache, [newPage]: newContent }));

        // Notify the user of successful page load
        toast.success(`Successfully loaded page: ${newPage}`);
      }
    } catch (err) {
      console.error("Unexpected error during page change:", err);
      toast.error("An unexpected error occurred while changing the page.");
    } finally {
      setIsSwitchingPage(false);
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const updateIframeContent = () => {
      if (!iframe.contentDocument) return;

      // Set the entire HTML content, including head and body
      iframe.srcdoc = siteContent;

      // Re-attach event listeners after content is loaded
      iframe.onload = () => {
        const iframeDoc = iframe.contentDocument;
        if (iframeDoc) {
          updateEventListeners(iframeDoc);
        }
      };
    };

    updateIframeContent();

    // Attach global keydown listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      iframe.onload = null;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [siteContent, isPickMode, isEditMode]);

  const handleSave = async () => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      // Remove all contenteditable attributes before saving
      const editableElements = iframeDoc.querySelectorAll(
        '[contenteditable="true"]'
      );
      editableElements.forEach((el) => el.removeAttribute("contenteditable"));

      // Get the entire HTML content
      const updatedContent = iframeDoc.documentElement.outerHTML;
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
        success: () => {
          setHasUnsavedChanges(false);
          return "Site saved!";
        },
        error: "Error saving site",
      });

      // Update the undo stack with the saved state
      // Optional: You can decide whether saving should clear the undo stack or not
    }
  };

  const handleMouseOver = (e: MouseEvent) => {
    if (!isPickMode || isAnyElementSelected || isTextPopupOpen) return;
    e.stopPropagation();
    const target = e.target as Element;
    setHoveredElement(target);
    target.classList.add("hovered-element");

    // Get the position relative to the viewport
    const rect = target.getBoundingClientRect();

    // Convert iframe coordinates to screen coordinates
    const iframeRect = iframeRef.current?.getBoundingClientRect();
    if (iframeRect) {
      setPillPosition({
        x: iframeRect.left + rect.left + rect.width / 2,
        y: iframeRect.top + rect.top + rect.height / 2,
      });
    }
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
  const handleMouseOut = (e: MouseEvent) => {
    if (!isPickMode || isAnyElementSelected || isTextPopupOpen) return;
    const target = e.target as Element;
    target.classList.remove("hovered-element");
    setHoveredElement(null);
    setPillPosition(null);
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
        const selectedElements =
          iframeRef.current?.contentDocument?.querySelectorAll(
            ".selected-element"
          );
        selectedElements?.forEach((el) =>
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
        ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "div"].includes(
          target.tagName.toLowerCase()
        )
      ) {
        handleTextEdit(target);
      }
    }
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
    const iframeRect = iframeRef.current?.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const position = {
      x: iframeRect
        ? iframeRect.left + rect.left + rect.width / 2
        : rect.left + rect.width / 2,
      y: iframeRect ? iframeRect.top + rect.top - 45 : rect.top - 45,
    };

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

  const updateElementContent = (element: Element) => {
    const updatedContent = updateElementInHTML(element, (el) => {
      el.innerHTML = element.innerHTML;
      // Copy over all classes
      el.className = element.className;
      return el.outerHTML;
    });

    // Push to undo stack
    // pushNewState(updatedContent);
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

  const updateEventListeners = (iframeDoc: Document) => {
    if (!iframeDoc?.body) return;

    // Remove existing listeners to prevent duplicates
    iframeDoc.body.removeEventListener("mouseover", handleMouseOver);
    iframeDoc.body.removeEventListener("mouseout", handleMouseOut);
    iframeDoc.body.removeEventListener("click", handleClick);

    // Attach listeners based on modes
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
      // Check for Undo/Redo shortcuts
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === "z") {
          e.preventDefault();
          handleUndo();
        } else if (e.key === "y") {
          e.preventDefault();
          handleRedo();
        }
      }

      // Handle global Escape key
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
    [isAnyElementSelected, isTextPopupOpen, handleUndo, handleRedo]
  );

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
          // Update the saved content
          updateElementAttribute(target, "src", imageUrl);
        }
      }
    };
    input.click();
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

  const handleUserRequest = async (
    request: string,
    mode: "quick" | "quality"
  ) => {
    if (!selectedElement || !iframeRef.current?.contentDocument) return;

    try {
      // First check if user can make edits
      const { canEdit, remaining } = await checkAIEditsLimit(userId);

      if (!canEdit) {
        toast.error("AI edit limit reached. Please upgrade your plan.");
        return;
      }

      if (remaining <= 3) {
        toast.warning(`Only ${remaining} AI edits remaining`);
      }

      // Proceed with the edit request
      const response = await fetch("/api/handle_element_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullPageCode: initialContent,
          model: mode === "quick" ? "o1-mini" : "gpt-4o-mini",
          elementCode: selectedElement.outerHTML,
          userRequest: request,
        }),
      });

      if (response.ok) {
        // If edit was successful, increment the count
        await incrementAIEdits(userId);
      }

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

            // Store the new state
            // pushNewState(updatedContent);
            setSiteContent(updatedContent);
            await handleSave();

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

            // Optional: Notify user
            toast.success("Element updated successfully", {
              action: {
                label: "Undo",
                onClick: () => handleUndo(),
              },
            });
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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col relative h-screen">
        <TopBar
          isCodeViewActive={isCodeViewActive}
          onCodeViewToggle={() => setIsCodeViewActive(!isCodeViewActive)}
          onSave={handleSave}
          subdomain={subdomain}
          pageTitle={pageTitle}
          pages={pages}
          onPageChange={handlePageChange}
          onViewportChange={setViewport}
          onThemeChange={() => {}}
          iframeRef={iframeRef}
          viewport={viewport}
          hasUnsavedChanges={hasUnsavedChanges}
          viewportDimensions={
            viewport !== "desktop" ? viewportDimensions : undefined
          }
          onResetViewport={viewport !== "desktop" ? handleReset : undefined}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-200 p-2 m-2 rounded-lg overflow-hidden">
          <div
            ref={viewportRef}
            className={`relative bg-white shadow-lg ${
              viewport !== "desktop" ? "rounded-lg overflow-hidden" : ""
            }`}
            style={{
              width:
                viewport === "desktop"
                  ? "100%"
                  : viewport === "tablet"
                  ? "768px"
                  : "375px",
              height:
                viewport === "desktop"
                  ? "100%"
                  : viewport === "tablet"
                  ? "1024px"
                  : "667px",
              maxWidth: viewport === "desktop" ? "100%" : "none",
              maxHeight:
                viewport === "desktop" ? "100%" : "calc(100vh - 160px)",
              transform: viewport === "desktop" ? "none" : "scale(0.9)",
              resize: viewport !== "desktop" ? "both" : "none",
              overflow: "auto",
              transitionProperty: "transform, scale",
              transitionDuration: "0.3s",
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
        {isPickMode && selectedElement && clickPosition && isTextPopupOpen && (
          <TextPopup
            selectedElement={selectedElement}
            clickPosition={clickPosition}
            onClose={() => {
              setSelectedElement(null);
              setIsAnyElementSelected(false);
              setIsTextPopupOpen(false);
              const selectedElements =
                iframeRef.current?.contentDocument?.querySelectorAll(
                  ".selected-element"
                );
              selectedElements?.forEach((el) =>
                el.classList.remove("selected-element")
              );
            }}
            screenHeight={window.innerHeight}
            screenWidth={window.innerWidth}
            onSubmitRequest={(req) => handleUserRequest(req, "quick")}
          />
        )}
        <FloatingControls
          isPickMode={isPickMode}
          isEditMode={isEditMode}
          togglePickMode={togglePickMode}
          toggleEditMode={toggleEditMode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
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
        {isLoadingPage && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div className="loader">Loading...</div>{" "}
            {/* Ensure you have CSS for .loader */}
          </div>
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
