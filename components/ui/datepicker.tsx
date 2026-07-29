"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ name, className }: { name?: string, className?: string }) {
  const [date, setDate] = React.useState<Date>()

  return (
    <>
      {name && <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} />}
      <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} data-empty={!date} className={cn("w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground", className)}>
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
      </Popover>
    </>
  )
}
