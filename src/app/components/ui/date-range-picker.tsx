"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { useIsMobile } from "./use-mobile";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });
  const isMobile = useIsMobile();

  const displayText = React.useMemo(() => {
    if (date?.from) {
      if (date.to) {
        return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
      }
      return format(date.from, "LLL dd, y");
    }
    return "Pick a date";
  }, [date]);

  if (isMobile) {
    return (
      <div className={cn("grid gap-2", className)}>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayText}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Date Range</DrawerTitle>
            </DrawerHeader>
            <div className="flex justify-center p-4">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Apply</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
