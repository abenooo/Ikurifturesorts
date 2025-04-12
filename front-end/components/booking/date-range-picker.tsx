"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  dateRange: [Date | null, Date | null]
  setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>
  className?: string
}

export function DateRangePicker({ dateRange, setDateRange, className }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dateRange[0],
    to: dateRange[1],
  })

  // Update parent state when local state changes
  React.useEffect(() => {
    if (date?.from) {
      setDateRange([date.from, date.to])
    }
  }, [date, setDateRange])

  // Update local state when parent state changes
  React.useEffect(() => {
    if (dateRange[0] !== date?.from || dateRange[1] !== date?.to) {
      setDate({
        from: dateRange[0],
        to: dateRange[1],
      })
    }
  }, [dateRange, date])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select date range</span>
            )}
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
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
