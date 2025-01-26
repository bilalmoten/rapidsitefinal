"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowUpDown,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

// Helper function to analyze common fields
function analyzeCommonFields(submissions: any[]) {
  const fieldFrequency: Record<string, number> = {};
  submissions.forEach((submission) => {
    Object.keys(submission.form_data || {}).forEach((field) => {
      fieldFrequency[field] = (fieldFrequency[field] || 0) + 1;
    });
  });

  const threshold = submissions.length * 0.5;
  return Object.entries(fieldFrequency)
    .filter(([_, count]) => count >= threshold)
    .map(([field]) => field);
}

// Helper to truncate text
function truncateText(text: string, length: number = 50) {
  if (!text) return "-";
  return text.length > length ? text.slice(0, length) + "..." : text;
}

// Helper to safely get nested object value
function getNestedValue(obj: any, key: string) {
  try {
    return obj.form_data?.[key] ?? "-";
  } catch (e) {
    return "-";
  }
}

interface FormSubmissionsTableProps {
  submissions: any[];
  websiteId: string;
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export function FormSubmissionsTable({
  submissions,
  websiteId,
}: FormSubmissionsTableProps) {
  const router = useRouter();
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [viewSubmission, setViewSubmission] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [isLoading, setIsLoading] = useState(false);

  // Analyze common fields
  const commonFields = submissions ? analyzeCommonFields(submissions) : [];

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    let result = [...(submissions || [])];

    // Apply date range filter
    if (dateRange?.from) {
      result = result.filter(
        (submission) => new Date(submission.created_at) >= dateRange.from!
      );
    }
    if (dateRange?.to) {
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(
        (submission) => new Date(submission.created_at) <= endDate
      );
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter((submission) =>
        Object.values(submission.form_data || {}).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "date") {
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
        } else {
          aValue = getNestedValue(a, sortConfig.key);
          bValue = getNestedValue(b, sortConfig.key);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [submissions, searchQuery, sortConfig, dateRange]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  // Export selected submissions
  const handleExport = () => {
    const submissionsToExport =
      filteredSubmissions?.filter((s) => selectedSubmissions.includes(s.id)) ||
      [];

    if (submissionsToExport.length === 0) return;

    // Format date properly and escape fields that might contain commas
    const csvContent = [
      // Headers with quotes to handle commas
      [
        `"Date and Time"`,
        ...commonFields.map((field) => `"${field}"`),
        `"Additional Fields"`,
      ].join(","),
      // Data rows
      ...submissionsToExport.map((submission) => {
        const row = [
          `"${new Date(submission.created_at).toLocaleString()}"`, // Date in one column
          ...commonFields.map(
            (field) =>
              `"${String(getNestedValue(submission, field)).replace(/"/g, '""')}"` // Escape quotes
          ),
          `"${JSON.stringify(
            Object.entries(submission.form_data || {})
              .filter(([key]) => !commonFields.includes(key))
              .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
          ).replace(/"/g, '""')}"`, // Escape quotes in JSON
        ];
        return row.join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url); // Clean up
  };

  // Delete selected submissions
  const handleDelete = async () => {
    if (selectedSubmissions.length === 0) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_websites_form_submissions")
        .delete()
        .in("id", selectedSubmissions);

      if (error) {
        console.error("Error deleting submissions:", error);
        // You might want to show an error toast here
        return;
      }

      setSelectedSubmissions([]);
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting submissions:", error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-[28px] font-medium text-white">
            Form Submissions
          </h2>
          <p className="text-sm text-neutral-40">
            View and manage form submissions from your website
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-40" />
            <Input
              placeholder="Search submissions..."
              className="pl-8 w-[250px] bg-transparent border-neutral-70 text-neutral-20 placeholder:text-neutral-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          </div>
          {/* Show buttons on larger screens */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              className="border-neutral-70 text-neutral-20"
              disabled={selectedSubmissions.length === 0}
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
            <Button
              variant="outline"
              className="border-neutral-70 text-red-500 hover:text-red-400"
              disabled={selectedSubmissions.length === 0}
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
          {/* Show dropdown on mobile */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-neutral-70 text-neutral-20"
                  disabled={selectedSubmissions.length === 0}
                >
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-70">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-70 hover:bg-neutral-80/10">
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={
                    selectedSubmissions.length === filteredSubmissions.length
                  }
                  onCheckedChange={(checked) => {
                    setSelectedSubmissions(
                      checked ? filteredSubmissions.map((s) => s.id) : []
                    );
                  }}
                />
              </TableHead>
              <TableHead className="w-[160px] text-neutral-20">
                <Button
                  variant="ghost"
                  className="p-0 h-8 text-neutral-20 hover:text-primary-main hover:bg-transparent"
                  onClick={() => handleSort("date")}
                >
                  <span>Date</span>
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sortConfig?.key === "date" &&
                        "text-primary-main transform transition-transform",
                      sortConfig?.key === "date" &&
                        sortConfig.direction === "desc" &&
                        "rotate-180"
                    )}
                  />
                </Button>
              </TableHead>
              {commonFields.map((field) => (
                <TableHead key={field} className="text-neutral-20">
                  <Button
                    variant="ghost"
                    className="p-0 h-8 text-neutral-20 hover:text-primary-main hover:bg-transparent capitalize"
                    onClick={() => handleSort(field)}
                  >
                    <span>{field}</span>
                    <ArrowUpDown
                      className={cn(
                        "ml-2 h-4 w-4",
                        sortConfig?.key === field &&
                          "text-primary-main transform transition-transform",
                        sortConfig?.key === field &&
                          sortConfig.direction === "desc" &&
                          "rotate-180"
                      )}
                    />
                  </Button>
                </TableHead>
              ))}
              <TableHead className="w-[100px] text-neutral-20">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 w-4 bg-neutral-800 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
                  </TableCell>
                  {commonFields.map((_, i) => (
                    <TableCell key={i}>
                      <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="h-4 w-16 bg-neutral-800 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredSubmissions && filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  className="border-neutral-70 hover:bg-neutral-80/10"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedSubmissions.includes(submission.id)}
                      onCheckedChange={(checked) => {
                        setSelectedSubmissions(
                          checked
                            ? [...selectedSubmissions, submission.id]
                            : selectedSubmissions.filter(
                                (id) => id !== submission.id
                              )
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-primary-main">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {new Date(submission.created_at).toLocaleString()}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {new Date(submission.created_at).toLocaleString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                                timeZoneName: "short",
                              }
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  {commonFields.map((field) => (
                    <TableCell
                      key={field}
                      className="text-neutral-40 cursor-pointer hover:text-primary-main"
                      onClick={() => setViewSubmission(submission)}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {truncateText(
                              String(getNestedValue(submission, field))
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to view full details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  ))}
                  <TableCell>
                    <details className="text-neutral-40">
                      <summary className="cursor-pointer hover:text-primary-main flex items-center gap-1">
                        <span>More</span>
                        <ChevronRight className="h-4 w-4 inline-block transform transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="mt-2 space-y-1 pl-4 border-l border-neutral-70">
                        {Object.entries(submission.form_data || {})
                          .filter(([key]) => !commonFields.includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="text-neutral-20 font-medium capitalize">
                                {key}:{" "}
                              </span>
                              <span className="text-neutral-40">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </details>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-neutral-70">
                <TableCell
                  colSpan={commonFields.length + 3}
                  className="text-center py-12 text-neutral-40"
                >
                  <div className="space-y-2">
                    <p>No form submissions found</p>
                    <p className="text-sm">
                      {searchQuery
                        ? "Try adjusting your filters"
                        : "Form submissions will appear here once your website starts receiving them"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Full Submission Dialog */}
      <Dialog
        open={!!viewSubmission}
        onOpenChange={() => setViewSubmission(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Submission Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {viewSubmission &&
                new Date(viewSubmission.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {viewSubmission &&
              Object.entries(viewSubmission.form_data || {}).map(
                ([key, value]) => (
                  <div key={key} className="space-y-1">
                    <h4 className="text-sm font-medium text-neutral-20 capitalize">
                      {key}
                    </h4>
                    <p className="text-sm text-neutral-40 whitespace-pre-wrap">
                      {String(value)}
                    </p>
                  </div>
                )
              )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Submissions</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSubmissions.length}{" "}
              selected submissions? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
