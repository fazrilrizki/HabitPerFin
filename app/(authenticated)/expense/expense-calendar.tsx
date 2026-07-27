import { getCalendarData } from "./actions";
import { ExpenseCalendarClient } from "./expense-calendar-client";

export async function ExpenseCalendar({ month, year }: { month: number, year: number }) {
    const data = await getCalendarData(month, year);
    
    return <ExpenseCalendarClient data={data} />;
}
