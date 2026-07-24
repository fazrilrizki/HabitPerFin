"use client"

import { useState } from "react"
import { Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteHabit, toggleHabitLog } from "./actions"

type Habit = {
  id: number
  name: string
  description: string | null
  frequency: string
  logs: {
    id: number
    date: Date
    isCompleted: boolean
  }[]
}

export function HabitList({ habits }: { habits: Habit[] }) {
  // Generate last 7 days
  const today = new Date()
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  async function handleToggle(habitId: number, date: Date, isCurrentlyCompleted: boolean) {
    // We send YYYY-MM-DD string to avoid timezone issues when parsing back
    const dateStr = date.toISOString().split('T')[0];
    await toggleHabitLog(habitId, dateStr, !isCurrentlyCompleted)
  }

  async function handleDelete(id: number) {
    await deleteHabit(id)
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b bg-muted/50 p-4 sm:grid-cols-[1fr_repeat(7,minmax(3rem,1fr))_auto]">
        <div className="font-medium">Habit</div>
        <div className="hidden sm:contents">
          {last7Days.map((date, i) => (
            <div key={i} className="text-center text-sm font-medium text-muted-foreground">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
              <div className="text-xs">{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="w-8"></div>
      </div>

      <div className="divide-y">
        {habits.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No habits found. Create one to get started!
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 sm:grid-cols-[1fr_repeat(7,minmax(3rem,1fr))_auto]">
              <div>
                <div className="font-medium">{habit.name}</div>
                {habit.description && (
                  <div className="text-sm text-muted-foreground">{habit.description}</div>
                )}
              </div>
              
              <div className="hidden sm:contents">
                {last7Days.map((date, i) => {
                  const dateStr = date.toISOString().split('T')[0]
                  const log = habit.logs.find(l => {
                    const lDateStr = new Date(l.date).toISOString().split('T')[0]
                    return lDateStr === dateStr
                  })
                  
                  const isCompleted = log?.isCompleted ?? false

                  return (
                    <div key={i} className="flex justify-center">
                      <button
                        onClick={() => handleToggle(habit.id, date, isCompleted)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                          isCompleted 
                            ? "border-primary bg-primary text-primary-foreground" 
                            : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {isCompleted && <Check className="h-4 w-4" />}
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="w-8">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your habit
                        and remove all of its logged history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(habit.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
