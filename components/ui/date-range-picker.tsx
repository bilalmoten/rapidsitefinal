"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange?: (date?: DateRange) => void;
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="space-y-3 p-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  const today = new Date();
                  onDateChange?.({ from: today, to: today });
                  setIsOpen(false);
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  const today = new Date();
                  onDateChange?.({
                    from: addDays(today, -7),
                    to: today,
                  });
                  setIsOpen(false);
                }}
              >
                Last 7 days
              </Button>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  const today = new Date();
                  onDateChange?.({
                    from: addDays(today, -30),
                    to: today,
                  });
                  setIsOpen(false);
                }}
              >
                Last 30 days
              </Button>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  onDateChange?.(undefined);
                  setIsOpen(false);
                }}
              >
                Reset
              </Button>
            </div>
            <div className="rounded-md border">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={onDateChange}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
