"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-markup";

interface CodeViewProps {
  content: string;
  onClose: () => void;
}

const CodeView: React.FC<CodeViewProps> = ({ content, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("File downloaded successfully");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">HTML Code</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "transition-all",
                copied && "bg-green-500/10 text-green-500 hover:bg-green-500/20"
              )}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4">
          <pre className="relative rounded-lg bg-muted p-4 overflow-x-auto">
            <code className="language-markup text-sm font-mono">{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeView;
