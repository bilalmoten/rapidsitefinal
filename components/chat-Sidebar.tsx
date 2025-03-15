import React, { useState, useEffect } from "react";
import {
  Upload,
  Link as LinkIcon,
  Palette,
  Paintbrush,
  Wand2,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

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
  onColorSchemeChange: (colors: string[]) => void;
}

const PRESET_THEMES = {
  Modern: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
  Elegant: ["#18181b", "#3f3f46", "#71717a", "#a1a1aa"],
  Nature: ["#166534", "#15803d", "#22c55e", "#4ade80"],
  Ocean: ["#0c4a6e", "#0369a1", "#0ea5e9", "#7dd3fc"],
  Sunset: ["#9d174d", "#be185d", "#ec4899", "#f9a8d4"],
  Earth: ["#78350f", "#92400e", "#b45309", "#f59e0b"],
};

const generateRandomColors = (count: number): string[] => {
  return Array.from(
    { length: count },
    () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
  );
};

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onRemove: () => void;
  showRemove?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  onRemove,
  showRemove = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-14 h-14 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700 shadow-lg"
            style={{ backgroundColor: color }}
            onClick={() => setIsOpen(true)}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 z-[150]">
          <HexColorPicker
            color={color}
            onChange={(newColor) => {
              onChange(newColor);
            }}
          />
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2"
          />
        </PopoverContent>
      </Popover>
      {showRemove && (
        <button
          className="absolute -top-2 -right-2 rounded-full w-5 h-5 bg-white flex items-center justify-center shadow-md hover:bg-red-100 transition-colors z-[120]"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="w-3 h-3 text-red-500" />
        </button>
      )}
    </div>
  );
};

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
  onColorSchemeChange,
}) => {
  const [linkInput, setLinkInput] = useState("");

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colorScheme];
    newColors[index] = newColor;
    onColorSchemeChange(newColors);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    uploadHandler: (file: File) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadHandler(file);
    }
  };

  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput) return;

    try {
      const url = new URL(linkInput);
      if (url.protocol === "http:" || url.protocol === "https:") {
        onAddLink(linkInput);
        setLinkInput("");
      } else {
        alert("Please enter a valid http or https URL");
      }
    } catch (e) {
      alert("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  return (
    <div className="w-90 h-full bg-[#0a0a0b00] border-l border-neutral-70 z-[90]">
      <div className="p-4 border-b border-neutral-70">
        <h2 className="text-2xl font-bold text-neutral-10 p-2 ">
          Website Details
        </h2>
      </div>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-4 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </h3>
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-14 w-14">
                      <Paintbrush className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[150]">
                    {Object.entries(PRESET_THEMES).map(([name, colors]) => (
                      <DropdownMenuItem
                        key={name}
                        onClick={() => onColorSchemeChange(colors)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span>{name}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-14 w-14"
                  onClick={() => onColorSchemeChange(generateRandomColors(4))}
                >
                  <Wand2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {colorScheme.map((color, index) => (
                <ColorPicker
                  key={index}
                  color={color}
                  onChange={(newColor) => handleColorChange(index, newColor)}
                  onRemove={() => {
                    if (colorScheme.length > 3) {
                      const newColors = colorScheme.filter(
                        (_, i) => i !== index
                      );
                      onColorSchemeChange(newColors);
                    }
                  }}
                  showRemove={colorScheme.length > 3}
                />
              ))}
              {colorScheme.length < 6 && (
                <Button
                  variant="outline"
                  className="w-14 h-14 rounded-xl opacity-30 hover:opacity-50 transition-opacity"
                  onClick={() => {
                    const newColors = [...colorScheme, "#000000"];
                    onColorSchemeChange(newColors);
                  }}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Logo</h3>
            {logo ? (
              <div className="relative w-full aspect-video mb-3 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full aspect-video mb-3 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-sm text-gray-500">No logo uploaded</p>
              </div>
            )}
            <div className="relative">
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, onLogoUpload)}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="logo-upload"
              />
              <Button variant="outline" className="w-full pointer-events-none">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Images for Website</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {inspirationImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Website Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="relative">
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, onInspirationUpload)}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="inspiration-reference-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2 pointer-events-none"
              >
                <Upload className="h-4 w-4" />
                Add a Reference Image
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <LinkIcon className="h-5 w-5" />
              Useful Links
            </h3>

            <form onSubmit={handleAddLinkSubmit} className="flex gap-2 mb-3">
              <Input
                placeholder="https://example.com"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Add
              </Button>
            </form>

            {inspirationLinks.length > 0 ? (
              <div className="space-y-2">
                {inspirationLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 truncate max-w-[200px]"
                    >
                      {link}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        const newLinks = [...inspirationLinks];
                        newLinks.splice(index, 1);
                        onColorSchemeChange(newLinks);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No links added.</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Industry</h3>
            <Select value={industry} onValueChange={onIndustryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent className="z-[150]">
                <SelectItem value="none">Select an industry</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="nonprofit">Non-profit</SelectItem>
                <SelectItem value="realestate">Real Estate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
