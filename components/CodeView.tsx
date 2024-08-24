import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // You can choose a different theme
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";

interface CodeViewProps {
  content: string;
  onClose: () => void;
}

const CodeView: React.FC<CodeViewProps> = ({ content, onClose }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "website_code.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">HTML Code</h2>
          <div>
            <button
              onClick={downloadCode}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <pre className="language-markup">
            <code>{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeView;
