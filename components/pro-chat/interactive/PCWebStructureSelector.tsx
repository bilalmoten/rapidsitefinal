"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  Layout,
  Plus,
  Trash2,
  MoveVertical,
  FileEdit,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type definitions for website structure
export interface PageSection {
  id: string;
  title: string;
  type: string;
  description?: string;
}

export interface WebsitePage {
  id: string;
  title: string;
  path: string;
  sections: PageSection[];
  isHome?: boolean;
}

export interface WebsiteStructure {
  id: string;
  name: string;
  pages: WebsitePage[];
}

interface PCWebStructureSelectorProps {
  options: WebsiteStructure[];
  messageId: string;
  promptKey: string;
  isReadOnly?: boolean;
  onSubmit: (data: WebsiteStructure) => void;
}

export const PCWebStructureSelector: React.FC<PCWebStructureSelectorProps> = ({
  options,
  messageId,
  promptKey,
  isReadOnly = false,
  onSubmit,
}) => {
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(
    null
  );
  const [activeStructure, setActiveStructure] =
    useState<WebsiteStructure | null>(null);
  const [editingPage, setEditingPage] = useState<WebsitePage | null>(null);
  const [editingSection, setEditingSection] = useState<{
    page: WebsitePage;
    section: PageSection;
  } | null>(null);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [activePageId, setActivePageId] = useState<string | null>(null);

  const handleSelectStructure = (structure: WebsiteStructure) => {
    if (isReadOnly) return;
    setSelectedStructureId(structure.id);
    setActiveStructure(JSON.parse(JSON.stringify(structure))); // Deep clone
    setActivePageId(
      structure.pages.find((p) => p.isHome)?.id ||
        structure.pages[0]?.id ||
        null
    );
  };

  const handlePageClick = (pageId: string) => {
    setActivePageId(pageId);
  };

  const handleSubmit = () => {
    if (isReadOnly || !activeStructure) return;
    onSubmit(activeStructure);
  };

  const handleAddPage = () => {
    if (!activeStructure || !newPageTitle.trim()) return;

    const newPage: WebsitePage = {
      id: Date.now().toString(),
      title: newPageTitle,
      path: "/" + newPageTitle.toLowerCase().replace(/\s+/g, "-"),
      sections: [],
    };

    const updatedStructure = {
      ...activeStructure,
      pages: [...activeStructure.pages, newPage],
    };

    setActiveStructure(updatedStructure);
    setNewPageTitle("");
    setActivePageId(newPage.id);
  };

  const handleAddSection = (pageId: string) => {
    if (!activeStructure || !newSectionTitle.trim()) return;

    const updatedPages = activeStructure.pages.map((page) => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: [
            ...page.sections,
            {
              id: Date.now().toString(),
              title: newSectionTitle,
              type: "Content Section",
            },
          ],
        };
      }
      return page;
    });

    setActiveStructure({
      ...activeStructure,
      pages: updatedPages,
    });

    setNewSectionTitle("");
  };

  const handleDeletePage = (pageId: string) => {
    if (!activeStructure) return;

    const updatedPages = activeStructure.pages.filter(
      (page) => page.id !== pageId
    );

    if (activePageId === pageId) {
      setActivePageId(updatedPages[0]?.id || null);
    }

    setActiveStructure({
      ...activeStructure,
      pages: updatedPages,
    });
  };

  const handleDeleteSection = (pageId: string, sectionId: string) => {
    if (!activeStructure) return;

    const updatedPages = activeStructure.pages.map((page) => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: page.sections.filter((section) => section.id !== sectionId),
        };
      }
      return page;
    });

    setActiveStructure({
      ...activeStructure,
      pages: updatedPages,
    });
  };

  const moveSection = (
    pageId: string,
    sectionId: string,
    direction: "up" | "down"
  ) => {
    // Early return if no active structure
    if (!activeStructure) return;

    const pageIndex = activeStructure.pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    const sectionIndex = activeStructure.pages[pageIndex].sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex === -1) return;

    const newPages = [...activeStructure.pages];
    const sections = [...newPages[pageIndex].sections];

    // If moving up and not at the top
    if (direction === "up" && sectionIndex > 0) {
      // Swap with previous section
      [sections[sectionIndex], sections[sectionIndex - 1]] = [
        sections[sectionIndex - 1],
        sections[sectionIndex],
      ];
    }

    // If moving down and not at the bottom
    if (direction === "down" && sectionIndex < sections.length - 1) {
      // Swap with next section
      [sections[sectionIndex], sections[sectionIndex + 1]] = [
        sections[sectionIndex + 1],
        sections[sectionIndex],
      ];
    }

    newPages[pageIndex].sections = sections;

    // Create a new structure object with all required properties
    const updatedStructure: WebsiteStructure = {
      id: activeStructure.id,
      name: activeStructure.name,
      pages: newPages,
    };

    setActiveStructure(updatedStructure);
  };

  const activePage = activeStructure?.pages.find((p) => p.id === activePageId);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Layout className="h-4 w-4 text-primary" />
          Website Structure
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!activeStructure ? (
          // Structure selection
          <div className="grid grid-cols-1 gap-3 mb-4">
            {options.map((structure) => (
              <div
                key={structure.id}
                onClick={() => handleSelectStructure(structure)}
                className={`
                  relative rounded-md p-3 border border-input bg-background 
                  ${selectedStructureId === structure.id ? "ring-2 ring-primary" : ""} 
                  ${isReadOnly ? "opacity-80 pointer-events-none" : "cursor-pointer hover:bg-accent hover:text-accent-foreground"}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{structure.name}</span>
                  {selectedStructureId === structure.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {structure.pages.length} pages including{" "}
                  {structure.pages.map((p) => p.title).join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // Structure editor
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Pages sidebar */}
            <div className="md:col-span-1 border-r pr-4">
              <div className="font-medium mb-2">Pages</div>
              <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
                {activeStructure.pages.map((page) => (
                  <div
                    key={page.id}
                    className={`
                      flex items-center justify-between p-2 rounded-md text-sm
                      ${activePageId === page.id ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"}
                      cursor-pointer
                    `}
                    onClick={() => handlePageClick(page.id)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {page.isHome && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-1 py-0.5 rounded">
                          Home
                        </span>
                      )}
                      <span className="truncate">{page.title}</span>
                    </div>
                    {!page.isHome && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(page.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="New page name"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handleAddPage}
                  disabled={!newPageTitle.trim()}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Sections for active page */}
            <div className="md:col-span-3">
              {activePage ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      Sections for{" "}
                      <span className="text-primary">{activePage.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Path: {activePage.path}
                    </div>
                  </div>

                  <div className="p-2 border rounded-md bg-muted/30 mt-1">
                    <h4 className="text-sm font-medium mb-2">Sections:</h4>
                    <div className="space-y-2">
                      {activePage.sections.map((section) => (
                        <div
                          key={section.id}
                          className="p-2 border rounded-md bg-background flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-xs">
                              {section.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {section.type}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                moveSection(activePage.id, section.id, "up")
                              }
                              disabled={
                                activePage.sections.indexOf(section) === 0 ||
                                isReadOnly
                              }
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                moveSection(activePage.id, section.id, "down")
                              }
                              disabled={
                                activePage.sections.indexOf(section) ===
                                  activePage.sections.length - 1 || isReadOnly
                              }
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() =>
                                handleDeleteSection(activePage.id, section.id)
                              }
                              disabled={isReadOnly}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="New section title"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleAddSection(activePage.id)}
                      disabled={!newSectionTitle.trim()}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Select a page to manage its sections
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end pt-0">
        <AnimatePresence>
          {activeStructure && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-2"
            >
              {activeStructure !==
                options.find((o) => o.id === selectedStructureId) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStructure(null)}
                >
                  Cancel
                </Button>
              )}
              <Button size="sm" onClick={handleSubmit}>
                Apply Structure
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
};
