// components/advanced-chat/interactions/SiteStructureEditor.tsx
"use client";

import React, { useState, FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ListTree,
  Trash2,
  PlusCircle,
  GripVertical,
  Pencil,
  Check,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  FileText,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import type { SiteStructureEditorProps, SiteNode } from "@/types/advanced-chat";
// Consider react-beautiful-dnd or dnd-kit for drag & drop later

const SiteStructureEditor = ({
  onSubmit,
  initialStructure,
  readOnly = false,
}: SiteStructureEditorProps): JSX.Element => {
  console.log("SiteStructureEditor rendering with props:", {
    initialStructure,
    readOnly,
  });

  const [structure, setStructure] = useState<SiteNode[]>(() => {
    // Check if initialStructure exists and is not empty
    if (
      initialStructure &&
      Array.isArray(initialStructure) &&
      initialStructure.length > 0
    ) {
      console.log(
        "SiteStructureEditor: Using provided initialStructure:",
        initialStructure
      );
      return initialStructure;
    } else {
      console.log(
        "SiteStructureEditor: Using default structure, initialStructure was",
        initialStructure
      );
      return [
        {
          id: uuidv4(),
          type: "page",
          name: "Home",
          children: [
            {
              id: uuidv4(),
              type: "section",
              name: "Hero Section",
              children: [],
            },
            { id: uuidv4(), type: "section", name: "Features", children: [] },
            {
              id: uuidv4(),
              type: "section",
              name: "Testimonials",
              children: [],
            },
            {
              id: uuidv4(),
              type: "section",
              name: "Contact Form",
              children: [],
            },
          ],
        },
      ];
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );

  // Toggle node expansion
  const toggleNodeExpanded = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Add a top-level node
  const addNode = (type: "page" | "section") => {
    const newNode: SiteNode = {
      id: uuidv4(),
      type,
      name: type === "page" ? "New Page" : "New Section",
      children: [],
    };
    setStructure([...structure, newNode]);
  };

  // Add a child node to a parent
  const addChildNode = (parentId: string, type: "section") => {
    const updatedStructure = [...structure];

    // Helper function to recursively find and update the parent
    const addChildToNode = (nodes: SiteNode[], parentId: string): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i]; // Capture node
        if (currentNode.id === parentId) {
          // Found the parent, add child
          const children = currentNode.children || [];
          currentNode.children = [
            ...children,
            {
              id: uuidv4(),
              type,
              name: "New Section",
              children: [],
            },
          ];
          return true;
        }

        // Check children recursively using the captured node
        if (currentNode.children && currentNode.children.length > 0) {
          // Now safe to access currentNode.children
          if (addChildToNode(currentNode.children, parentId)) {
            return true;
          }
        }
      }
      return false;
    };

    if (addChildToNode(updatedStructure, parentId)) {
      setStructure(updatedStructure);
      // Auto-expand the parent
      setExpandedNodes((prev) => ({
        ...prev,
        [parentId]: true,
      }));
    }
  };

  // Remove a node and its children
  const removeNode = (id: string) => {
    // Don't remove if we'd end up with no pages
    if (structure.length <= 1 && structure[0].id === id) return;

    // Helper function to recursively filter out the node and its children
    const filterNodes = (nodes: SiteNode[]): SiteNode[] => {
      return nodes.filter((node) => {
        if (node.id === id) return false;
        if (node.children && node.children.length > 0) {
          node.children = filterNodes(node.children);
        }
        return true;
      });
    };

    setStructure(filterNodes(structure));
  };

  const startEditing = (node: SiteNode) => {
    setEditingId(node.id);
    setEditingName(node.name);
  };

  const saveEdit = (id: string) => {
    // Helper function to recursively find and update the node
    const updateNodeName = (nodes: SiteNode[]): SiteNode[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            name:
              editingName.trim() ||
              (node.type === "page" ? "Untitled Page" : "Untitled Section"),
          };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: updateNodeName(node.children),
          };
        }
        return node;
      });
    };

    setStructure(updateNodeName(structure));
    setEditingId(null);
    setEditingName("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleSubmit = () => {
    // Ensure no nodes have empty names before submitting
    const ensureNodeNames = (nodes: SiteNode[]): SiteNode[] => {
      return nodes.map((node) => ({
        ...node,
        name:
          node.name.trim() ||
          (node.type === "page" ? "Untitled Page" : "Untitled Section"),
        children: node.children?.length ? ensureNodeNames(node.children) : [],
      }));
    };

    const finalizedStructure = ensureNodeNames(structure);
    console.log(
      "SiteStructureEditor: Submitting finalized structure with",
      finalizedStructure.length,
      "top-level nodes"
    );

    // Debug: Log the entire structure
    console.log(
      "SiteStructureEditor: Structure JSON:",
      JSON.stringify(finalizedStructure, null, 2)
    );

    try {
      // Submit the structure directly
      onSubmit({ structure: finalizedStructure });
      console.log("SiteStructureEditor: Structure submitted successfully");
    } catch (error) {
      console.error("Error submitting structure:", error);
    }
  };

  // For read-only mode, we'll render a simplified version of the structure
  if (readOnly) {
    console.log(
      "SiteStructureEditor: Rendering in read-only mode with structure:",
      initialStructure
    );

    // Recursive function to render the structure hierarchy
    const renderReadOnlyNode = (node: SiteNode, level: number = 0) => {
      const isPage = node.type === "page";
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id} className={`${level > 0 ? "ml-3" : ""} my-1.5`}>
          <div className="flex items-center gap-2 py-1">
            {/* Icon based on node type */}
            {isPage ? (
              <FileText className="h-4 w-4 text-primary" />
            ) : (
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            )}

            {/* Node name with styling based on type */}
            <span
              className={`text-sm ${isPage ? "font-medium" : ""}`}
              style={{ maxWidth: "180px" }}
              title={node.name}
            >
              {node.name || (isPage ? "Untitled Page" : "Untitled Section")}
            </span>

            {/* Type indicator */}
            <span className="text-xs text-muted-foreground ml-auto">
              {node.type}
            </span>
          </div>

          {/* Render children recursively if they exist */}
          {hasChildren && node.children && (
            <div className="border-l-2 border-muted/50 ml-2 pl-2 mt-1">
              {node.children.map((child) =>
                renderReadOnlyNode(child, level + 1)
              )}
            </div>
          )}
        </div>
      );
    };

    return (
      <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ListTree className="h-4 w-4" /> Website Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {initialStructure &&
            Array.isArray(initialStructure) &&
            initialStructure.length > 0 ? (
              initialStructure.map((node) => renderReadOnlyNode(node))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No structure defined
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Recursive node renderer
  const renderNode = (node: SiteNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id] !== false; // Default to expanded

    return (
      <div className="node-container" key={node.id}>
        <div
          className={cn(
            "flex items-center gap-2 p-1.5 rounded group",
            level === 0 ? "bg-muted/80" : "bg-muted/30",
            level > 0 ? "ml-4 border-l-2 pl-2" : ""
          )}
        >
          {/* Expand/Collapse button if has children */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleNodeExpanded(node.id)}
              className="h-5 w-5 p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-5"></div> // Spacer
          )}

          {/* Node icon */}
          {node.type === "page" ? (
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
          )}

          {/* Type label */}
          <span className="text-xs font-medium capitalize text-muted-foreground w-10 flex-shrink-0">
            {node.type}
          </span>

          {/* Name - editable or static */}
          {editingId === node.id ? (
            <Input
              type="text"
              value={editingName}
              onChange={handleEditInputChange}
              onKeyDown={(e) => handleEditKeyDown(e, node.id)}
              onBlur={() => saveEdit(node.id)}
              autoFocus
              className="h-7 text-sm flex-grow"
            />
          ) : (
            <span className="text-sm flex-grow truncate">{node.name}</span>
          )}

          {/* Actions */}
          <div className="flex gap-1 ml-auto">
            {/* Edit button */}
            {editingId === node.id ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => saveEdit(node.id)}
                className="h-6 w-6 flex-shrink-0"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => startEditing(node)}
                className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Add section button (for pages and sections) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => addChildNode(node.id, "section")}
              className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100"
              title="Add Section"
            >
              <PlusCircle className="h-3.5 w-3.5" />
            </Button>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeNode(node.id)}
              className="h-6 w-6 flex-shrink-0 text-destructive opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="children-container">
            {node.children?.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto my-2 shadow-sm border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ListTree className="h-4 w-4" /> Website Structure
        </CardTitle>
        <CardDescription className="text-xs">
          Define the main pages and sections of your website.
          <p className="mt-1 italic">
            Tip: Add sections to pages to create a detailed structure.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {structure.map((node) => renderNode(node))}
        </div>

        {/* Add Page Button */}
        <div className="flex gap-2 mt-3 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addNode("page")}
            className="flex-1 text-xs"
          >
            <PlusCircle className="h-3 w-3 mr-1" /> Add Page
          </Button>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          size="sm"
          className="w-full mt-4 text-xs h-8"
        >
          <Check className="h-3 w-3 mr-1" /> Confirm Structure
        </Button>
      </CardContent>
    </Card>
  );
};

export default SiteStructureEditor;
