"use client";

import * as React from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { addDays, format, startOfToday, endOfToday, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface GlobalDateFilterProps {
  className?: string;
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
}

export function GlobalDateFilter({
  className,
  date,
  onDateChange,
}: GlobalDateFilterProps) {
  const presets = [
    { label: "Today", value: { from: startOfToday(), to: endOfToday() } },
    { label: "Yesterday", value: { from: subDays(startOfToday(), 1), to: subDays(endOfToday(), 1) } },
    { label: "Last 7 Days", value: { from: subDays(startOfToday(), 6), to: endOfToday() } },
    { label: "Last 30 Days", value: { from: subDays(startOfToday(), 29), to: endOfToday() } },
    { label: "This Month", value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) } },
    { label: "Last Month", value: { from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) } },
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-medium bg-white h-[44px] rounded-xl border-gray-200 hover:bg-gray-50 transition-all",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#253154]" />
            <span className="text-[#253154]">
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
                <span>Pick a date</span>
              )}
            </span>
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-col md:flex-row bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden" align="start">
          <div className="flex flex-col border-r border-gray-100 bg-gray-50/30 p-2 min-w-[160px]">
             <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Presets</h4>
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onDateChange(preset.value)}
                className="text-left px-3 py-2 text-sm rounded-lg hover:bg-white hover:shadow-sm transition-all text-[#253154] font-medium"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="p-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
