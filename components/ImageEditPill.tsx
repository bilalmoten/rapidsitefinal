import { Upload, Link, Sparkles, X } from "lucide-react";

interface ImageEditPillProps {
  position: { x: number; y: number };
  onUpload: () => void;
  onAddLink: () => void;
  onAIGenerate: () => void;
  onClose: () => void;
}

const ImageEditPill: React.FC<ImageEditPillProps> = ({
  position,
  onUpload,
  onAddLink,
  onAIGenerate,
  onClose,
}) => {
  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-2 border dark:border-gray-700"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        onClick={onUpload}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        title="Upload Image"
      >
        <Upload className="w-4 h-4 dark:text-gray-300" />
      </button>
      <button
        onClick={onAddLink}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        title="Add Link"
      >
        <Link className="w-4 h-4 dark:text-gray-300" />
      </button>
      <button
        onClick={onAIGenerate}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        title="AI Generate"
      >
        <Sparkles className="w-4 h-4 dark:text-gray-300" />
      </button>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        title="Close"
      >
        <X className="w-4 h-4 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default ImageEditPill;
