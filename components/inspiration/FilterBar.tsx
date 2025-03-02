import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type FilterOptions = {
  search: string;
  sort: string;
  industryTypes: string[];
  features: string[];
  categories: string[];
};

interface FilterBarProps {
  options: FilterOptions;
  onFilterChange: (newOptions: FilterOptions) => void;
  availableIndustries: string[];
  availableFeatures: string[];
  availableCategories: string[];
}

export default function FilterBar({
  options,
  onFilterChange,
  availableIndustries,
  availableFeatures,
  availableCategories,
}: FilterBarProps) {
  const [localOptions, setLocalOptions] =
    React.useState<FilterOptions>(options);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = { ...options, search: e.target.value };
    onFilterChange(newOptions);
  };

  const handleSortChange = (value: string) => {
    const newOptions = { ...options, sort: value };
    onFilterChange(newOptions);
  };

  const handleFilterChange = (
    category: "industryTypes" | "features" | "categories",
    value: string
  ) => {
    setLocalOptions((prev) => {
      const current = [...prev[category]];
      const index = current.indexOf(value);

      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }

      return {
        ...prev,
        [category]: current,
      };
    });
  };

  const applyFilters = () => {
    onFilterChange(localOptions);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const resetOptions = {
      ...options,
      industryTypes: [],
      features: [],
      categories: [],
    };
    setLocalOptions(resetOptions);
    onFilterChange(resetOptions);
    setIsOpen(false);
  };

  // Initialize local state when props change
  React.useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search websites..."
            value={options.search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        <div className="flex gap-3">
          <Select value={options.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="cloned">Most Cloned</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                {(options.industryTypes.length > 0 ||
                  options.features.length > 0 ||
                  options.categories.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {options.industryTypes.length +
                      options.features.length +
                      options.categories.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Websites</SheetTitle>
                <SheetDescription>
                  Refine the gallery by selecting options below
                </SheetDescription>
              </SheetHeader>

              <div className="py-4 space-y-6">
                {/* Industry Type Filters */}
                <div className="space-y-4">
                  <h3 className="font-medium">Industry Type</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {availableIndustries.map((industry) => (
                      <div
                        key={industry}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`industry-${industry}`}
                          checked={localOptions.industryTypes.includes(
                            industry
                          )}
                          onCheckedChange={() =>
                            handleFilterChange("industryTypes", industry)
                          }
                        />
                        <Label
                          htmlFor={`industry-${industry}`}
                          className="text-sm cursor-pointer"
                        >
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Filters */}
                <div className="space-y-4">
                  <h3 className="font-medium">Features</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {availableFeatures.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={localOptions.features.includes(feature)}
                          onCheckedChange={() =>
                            handleFilterChange("features", feature)
                          }
                        />
                        <Label
                          htmlFor={`feature-${feature}`}
                          className="text-sm cursor-pointer"
                        >
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories Filters */}
                <div className="space-y-4">
                  <h3 className="font-medium">Categories</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {availableCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={localOptions.categories.includes(category)}
                          onCheckedChange={() =>
                            handleFilterChange("categories", category)
                          }
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter>
                <div className="flex w-full gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters Display */}
      {(options.industryTypes.length > 0 ||
        options.features.length > 0 ||
        options.categories.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {options.industryTypes.map((industry) => (
            <Badge
              key={`industry-${industry}`}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {industry}
              <button
                onClick={() => {
                  const newOptions = {
                    ...options,
                    industryTypes: options.industryTypes.filter(
                      (i) => i !== industry
                    ),
                  };
                  onFilterChange(newOptions);
                }}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                ✕
              </button>
            </Badge>
          ))}

          {options.features.map((feature) => (
            <Badge
              key={`feature-${feature}`}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {feature}
              <button
                onClick={() => {
                  const newOptions = {
                    ...options,
                    features: options.features.filter((f) => f !== feature),
                  };
                  onFilterChange(newOptions);
                }}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                ✕
              </button>
            </Badge>
          ))}

          {options.categories.map((category) => (
            <Badge
              key={`category-${category}`}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {category}
              <button
                onClick={() => {
                  const newOptions = {
                    ...options,
                    categories: options.categories.filter(
                      (c) => c !== category
                    ),
                  };
                  onFilterChange(newOptions);
                }}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                ✕
              </button>
            </Badge>
          ))}

          {(options.industryTypes.length > 0 ||
            options.features.length > 0 ||
            options.categories.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs h-7"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
