"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { format } from "date-fns";
import * as React from "react";
import { type DayButton } from "react-day-picker";
import { cn } from "@/lib/utils";

export function ExpenseCalendarClient({ data }: { data: Record<string, number> }) {
    const [month, setMonth] = React.useState<Date>(new Date());

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    const CustomDayButton = (props: React.ComponentProps<typeof DayButton>) => {
        const dateStr = format(props.day.date, 'yyyy-MM-dd');
        const expenseTotal = data[dateStr];

        return (
            <div className="relative w-full h-full min-h-[80px] p-1 border rounded-md">
                <CalendarDayButton 
                    {...props} 
                    className={cn(props.className, "w-full h-auto aspect-auto justify-start items-start p-1 border-0 absolute top-0 left-0 hover:bg-transparent data-[selected-single=true]:bg-transparent data-[selected-single=true]:text-foreground")}
                />
                {expenseTotal ? (
                    <div className="absolute bottom-1 left-1 right-1 pointer-events-none">
                        <p className="text-[10px] sm:text-xs font-medium text-foreground px-1 py-0.5 rounded text-right truncate">
                            - {formatter.format(expenseTotal)}
                        </p>
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <div className="w-full bg-card border rounded-lg p-4 overflow-x-auto">
            <Calendar
                mode="single"
                month={month}
                onMonthChange={setMonth}
                className="w-full"
                classNames={{
                    months: "w-full",
                    month: "w-full space-y-4",
                    table: "w-full border-collapse",
                    head_row: "grid grid-cols-7 w-full",
                    head_cell: "text-muted-foreground font-medium text-sm text-center py-2 w-full",
                    row: "grid grid-cols-7 w-full mt-2 gap-1 md:gap-2",
                    cell: "relative w-full h-auto p-0 text-center focus-within:relative focus-within:z-20",
                    day: "h-full w-full", // Overrides the fixed size
                }}
                components={{
                    DayButton: CustomDayButton
                }}
            />
        </div>
    );
}
