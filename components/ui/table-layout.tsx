import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface TableLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  filters?: React.ReactNode
  children: React.ReactNode
}

export function TableLayout({
  title,
  description,
  action,
  filters,
  children,
  className,
  ...props
}: TableLayoutProps) {
  return (
    <Card className={cn("w-full shadow-sm", className)} {...props}>
      {(title || description || action) && (
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            {title && <CardTitle className="text-xl font-semibold">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && (
            <div className="flex shrink-0 items-center justify-end gap-2">
              {action}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {filters && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {filters}
          </div>
        )}
        <div className="rounded-md border border-border/60 bg-background overflow-hidden">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}