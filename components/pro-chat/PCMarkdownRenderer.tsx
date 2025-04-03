"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface PCMarkdownRendererProps {
  content: string;
}

export const PCMarkdownRenderer: React.FC<PCMarkdownRendererProps> = ({
  content,
}) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override default link handling to open in new tab
          a: (props) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          // Make sure code blocks are properly formatted
          code: (props) => {
            // Check if we're dealing with inline code
            const isInline = !(
              props.node?.position?.start.line !==
              props.node?.position?.end.line
            );

            if (isInline) {
              return (
                <code
                  className={cn(
                    "px-1 py-0.5 rounded bg-muted",
                    props.className
                  )}
                  {...props}
                >
                  {props.children}
                </code>
              );
            }

            return (
              <div className="relative rounded-md overflow-hidden my-2">
                <pre
                  className={cn("p-4 overflow-x-auto text-sm", props.className)}
                >
                  <code className={props.className} {...props}>
                    {props.children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
