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

  const handlePageChange = async (newPage: string) => {
    setPageTitle(newPage);
    const supabase = createClient();
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

    setSiteContent(page?.content || "");
  };

  const updateEventListeners = (iframeDoc: Document) => {
    iframeDoc.body.removeEventListener("mouseover", handleMouseOver);
    iframeDoc.body.removeEventListener("mouseout", handleMouseOut);
    iframeDoc.body.removeEventListener("click", handleClick);

    // Only add hover effects for pick mode
    if (isPickMode) {
      iframeDoc.body.addEventListener("mouseover", handleMouseOver);
      iframeDoc.body.addEventListener("mouseout", handleMouseOut);
    }

    // Add click listener for both modes
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

      const tailwindLink = iframeDoc.createElement("link");
      tailwindLink.rel = "stylesheet";
      tailwindLink.href =
        "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
      iframeDoc.head.appendChild(tailwindLink);

      // Only update event listeners when modes change
      updateEventListeners(iframeDoc);
    };

    iframe.srcdoc = siteContent;
    iframe.onload = handleLoad;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      iframe.onload = null;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [siteContent, isPickMode, isEditMode]); // Add isEditMode to dependencies

  const handleMouseOver = (e: MouseEvent) => {
    if (!isPickMode || isAnyElementSelected || isTextPopupOpen) return;
    e.stopPropagation();
    const target = e.target as Element;
    setHoveredElement(target);
    target.classList.add("hovered-element");
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (!isPickMode || isAnyElementSelected || isTextPopupOpen) return;
    const target = e.target as Element;
    target.classList.remove("hovered-element");
    setHoveredElement(null);
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
    if (!isEditMode) return; // Add this check

    target.setAttribute("contenteditable", "true");
    (target as HTMLElement).focus();

    const handleBlur = () => {
      if (target.getAttribute("contenteditable") === "true") {
        target.removeAttribute("contenteditable");
        updateElementContent(target);
        target.removeEventListener("blur", handleBlur);
      }
    };

    target.addEventListener("blur", handleBlur);
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
      el.textContent = element.textContent;
      return el.outerHTML;
    });
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

  const handleUserRequest = async (request: string) => {
    if (!selectedElement || !iframeRef.current?.contentDocument) return;

    const elementCode = selectedElement.outerHTML;

    try {
      const response = await fetch("/api/handle_element_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

            toast.success("Element updated successfully");
          } else {
            toast.error("Failed to access iframe document");
          }
        } else {
          toast.error("Failed to update element");
        }
      } else {
        toast.error("No updated code received");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process request");
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
        // Changed this line
        handleImageEdit(target);
      } else if (
        ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "DIV"].includes(
          target.tagName
        )
      ) {
        handleTextEdit(target);
      }
    }
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
            onSubmitRequest={handleUserRequest}
          />
        )}
        <FloatingControls
          isPickMode={isPickMode}
          isEditMode={isEditMode}
          togglePickMode={togglePickMode}
          toggleEditMode={toggleEditMode}
        />
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
