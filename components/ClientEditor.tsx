// components/ClientEditor.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import MainEditingPanel from "./MainEditingPanel";
import FloatingControls from "./FloatingControls";
import TopBar from "./TopBar";
import PagesPanel from "./PagesPanel";
import TextPopup from "./textpopup2";
import { toast } from "sonner";
import AddressBar from "./AddressBar";
import { createClient } from "@/utils/supabase/client";

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
  const [isEditMode, setIsEditMode] = useState(false);
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
  const [isCodeView, setIsCodeView] = useState(false);

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
      updateEventListeners(iframeDoc);
    };

    const updateEventListeners = (iframeDoc: Document) => {
      removeEventListeners(iframeDoc);
      if (isPickMode || isEditMode) {
        addEventListeners(iframeDoc);
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
    if ((!isPickMode && !isEditMode) || isAnyElementSelected) return;
    e.stopPropagation();
    const target = e.target as Element;
    setHoveredElement(target);
    target.classList.add("hovered-element");
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
      setIsAnyElementSelected(false);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as Element;
    setSelectedElement(target);
    setClickPosition({ x: e.clientX, y: e.clientY });
    setIsAnyElementSelected(true);
    if (isEditMode) {
      if (target.tagName === "IMG") {
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
    target.setAttribute("contenteditable", "true");
    (target as HTMLElement).focus();
    const handleBlur = () => {
      target.removeAttribute("contenteditable");
      updateElementContent(target);
      target.removeEventListener("blur", handleBlur);
      setSelectedElement(null);
      setIsAnyElementSelected(false);
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
    setIsEditMode(false);
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsPickMode(false);
  };

  const handleSave = async () => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      const updatedContent = iframeDoc.body.innerHTML;
      setSiteContent(updatedContent);

      console.log("Saving with websiteId:", websiteId); // Add this line for debugging

      const response = fetch("/api/save_website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add this line
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
    // Implement logic to change the iframe size based on viewport
  };

  const handleThemeChange = () => {
    // Implement theme change logic
  };

  const handleCodeViewToggle = () => {
    setIsCodeView(!isCodeView);
  };

  return (
    <div className="flex h-[calc(100vh-110px)] bg-white">
      <div className="flex-1 flex flex-col relative">
        <TopBar
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onSave={handleSave}
          subdomain={subdomain}
          pageTitle={pageTitle}
          pages={pages}
          onPageChange={handlePageChange}
          onViewportChange={handleViewportChange}
          onThemeChange={handleThemeChange}
          onCodeViewToggle={handleCodeViewToggle}
        />
        {isCodeView ? (
          <div />
        ) : (
          // <CodeEditor content={siteContent} onChange={setSiteContent} />
          <MainEditingPanel
            iframeRef={iframeRef}
            zoom={zoom}
            isPickMode={isPickMode}
            hoveredElement={hoveredElement}
            selectedElement={selectedElement}
          />
        )}
        {isPickMode && selectedElement && clickPosition && (
          <TextPopup
            selectedElement={selectedElement}
            clickPosition={clickPosition}
            onClose={() => {
              setSelectedElement(null);
              setIsAnyElementSelected(false);
            }}
            screenHeight={window.innerHeight}
            screenWidth={window.innerWidth}
          />
        )}
        <FloatingControls
          isPickMode={isPickMode}
          isEditMode={isEditMode}
          togglePickMode={togglePickMode}
          toggleEditMode={toggleEditMode}
        />
      </div>
      <ChatWindow
      // userId={userId}
      // websiteId={websiteId}
      // Add any other props that ChatWindow needs
      />
    </div>
  );
};

export default ClientEditor;
