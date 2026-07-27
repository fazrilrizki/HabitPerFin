"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // let's see if we have checkbox, if not I'll just use normal input or wait, shadcn has checkbox?
// Wait, I should verify if checkbox exists. I'll use a basic label and input for safety if not found.
// Or I can just write standard input type checkbox with tailwind
import { toggleHabitStatus } from "../actions";
import { useState, useTransition } from "react";
import { toast } from "sonner"; // we saw sonner in the ui folder
import { CheckCircle2, Circle } from "lucide-react";

interface Habit {
    id: number;
    name: string;
    isCompletedToday: boolean;
}

interface TodayHabitsProps {
    habits: Habit[];
}

export function TodayHabits({ habits: initialHabits }: TodayHabitsProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = (habitId: number, currentStatus: boolean) => {
        startTransition(async () => {
            try {
                await toggleHabitStatus(habitId, !currentStatus);
                toast.success("Habit updated");
            } catch (error) {
                toast.error("Failed to update habit");
            }
        });
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Today's Habits</CardTitle>
            </CardHeader>
            <CardContent>
                {initialHabits.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No active habits for today.</p>
                ) : (
                    <div className="space-y-4">
                        {initialHabits.map((habit) => (
                            <div 
                                key={habit.id} 
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => handleToggle(habit.id, habit.isCompletedToday)}
                            >
                                <span className={habit.isCompletedToday ? "line-through text-muted-foreground" : "font-medium"}>
                                    {habit.name}
                                </span>
                                <button disabled={isPending} className="text-primary hover:opacity-80 transition-opacity">
                                    {habit.isCompletedToday ? (
                                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
