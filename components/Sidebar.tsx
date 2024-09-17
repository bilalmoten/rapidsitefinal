import React from "react";
import { Upload, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarProps {
  colorScheme: string[];
  logo: string | null;
  inspirationImages: string[];
  inspirationLinks: string[];
  industry: string;
  onLogoUpload: (file: File) => void;
  onInspirationUpload: (file: File) => void;
  onAddLink: (link: string) => void;
  onIndustryChange: (industry: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  colorScheme,
  logo,
  inspirationImages,
  inspirationLinks,
  industry,
  onLogoUpload,
  onInspirationUpload,
  onAddLink,
  onIndustryChange,
}) => {
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    uploadHandler: (file: File) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadHandler(file);
    }
  };

  const handleAddLink = () => {
    const link = prompt("Enter an inspiration link:");
    if (link) {
      onAddLink(link);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Website Details</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Color Scheme</h3>
        <div className="flex space-x-2">
          {colorScheme.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Logo</h3>
        {logo ? (
          <img src={logo} alt="Logo" className="max-w-full h-auto mb-2" />
        ) : (
          <p className="text-sm text-gray-500 mb-2">No logo uploaded</p>
        )}
        <Input
          type="file"
          onChange={(e) => handleFileUpload(e, onLogoUpload)}
          accept="image/*"
          className="hidden"
          id="logo-upload"
        />
        <label htmlFor="logo-upload" className="w-full">
          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Logo
          </Button>
        </label>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Inspiration Images</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {inspirationImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Inspiration ${index + 1}`}
              className="w-full h-auto"
            />
          ))}
        </div>
        <Input
          type="file"
          onChange={(e) => handleFileUpload(e, onInspirationUpload)}
          accept="image/*"
          className="hidden"
          id="inspiration-upload"
        />
        <label htmlFor="inspiration-upload" className="w-full">
          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Inspiration
          </Button>
        </label>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Inspiration Links</h3>
        <ul className="list-disc list-inside mb-2">
          {inspirationLinks.map((link, index) => (
            <li key={index} className="text-sm truncate">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <Button onClick={handleAddLink} variant="outline" className="w-full">
          <LinkIcon className="h-4 w-4 mr-2" />
          Add Inspiration Link
        </Button>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Industry</h3>
        <Select value={industry} onValueChange={onIndustryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            {/* Add more industries as needed */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Sidebar;
