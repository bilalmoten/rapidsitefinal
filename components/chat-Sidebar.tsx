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
  showRemove = true,
}) => {
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);

  // Apply color only when popover closes or Apply is clicked
  useEffect(() => {
    if (!open) {
      if (tempColor !== color) {
        onChange(tempColor);
      }
    }
  }, [open]);

  // Update temp color when main color changes
  useEffect(() => {
    setTempColor(color);
  }, [color]);

  return (
    <div className="relative group">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="w-12 h-12 rounded-xl border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            style={{ backgroundColor: color }}
          >
            {showRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" sideOffset={5}>
          <div className="space-y-4">
            <div className="p-1 bg-secondary/20 rounded-lg">
              <HexColorPicker
                color={tempColor}
                onChange={setTempColor}
                style={{
                  width: "100%",
                  height: "240px",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg border"
                style={{ backgroundColor: tempColor }}
              />
              <Input
                value={tempColor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setTempColor(val);
                  }
                }}
                maxLength={7}
                className="font-mono text-sm h-10 bg-secondary/20"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setTempColor(color);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onChange(tempColor);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
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

  const handleAddLink = () => {
    const link = prompt(
      "Enter a link to your current website, social media, or reference images:"
    );
    if (link) {
      try {
        const url = new URL(link);
        if (url.protocol === "http:" || url.protocol === "https:") {
          onAddLink(link);
        } else {
          alert("Please enter a valid http or https URL");
        }
      } catch (e) {
        alert("Please enter a valid URL (e.g., https://example.com)");
      }
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Website Details</h2>
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
                  <DropdownMenuContent align="end" className="w-56">
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
                id="inspiration-upload"
              />
              <Button variant="outline" className="w-full pointer-events-none">
                <Upload className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Useful Links</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Add links to your current website, social media, or any reference
              images that will help build your website.
            </p>
            {inspirationLinks.length > 0 ? (
              <div className="space-y-2 mb-3">
                {inspirationLinks.map((link, index) => (
                  <div
                    key={index}
                    className="group relative p-2 text-sm bg-gray-100 dark:bg-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    <p className="truncate pr-6">{link}</p>
                    <button
                      onClick={() => {
                        const newLinks = inspirationLinks.filter(
                          (_, i) => i !== index
                        );
                        onAddLink(newLinks.join(","));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-3">No links added</p>
            )}
            <Button
              onClick={handleAddLink}
              variant="outline"
              className="w-full"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Industry</h3>
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
