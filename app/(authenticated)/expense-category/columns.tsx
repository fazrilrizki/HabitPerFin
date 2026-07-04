"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { deleteCategory, toggleCategoryStatus } from "./actions"
import { toast } from "sonner"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Trash2Icon } from "lucide-react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export type ExpenseCategory = {
  id: string
  name: string
  categoryType: "Primer" | "Non-Primer"
  budgetLimit: number
  status: "Active" | "Inactive"
}

export const columns: ColumnDef<ExpenseCategory>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "categoryType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("categoryType") as string
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${type === "Primer" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {type}
        </span>
      )
    }
  },
  {
    accessorKey: "budgetLimit",
    header: "Budget Limit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budgetLimit"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={`status-${row.original.id}`}
            checked={status === "Active"}
            onCheckedChange={(checked) => {
              toast.promise(
                toggleCategoryStatus(row.original.id, checked ? "Active" : "Inactive"),
                {
                  loading: "Updating status...",
                  success: "Status updated successfully!",
                  error: "Failed to update status."
                }
              )
            }}
            aria-label="Toggle status"
          />
          <Label htmlFor={`status-${row.original.id}`}>{status}</Label>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <ButtonGroup>
          <EditCategoryDialog category={row.original}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50" aria-label="Edit">
              <Edit className="size-4" /> Edit
            </Button>
          </EditCategoryDialog>
          <ButtonGroupSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50" aria-label="Delete">
                <Trash2 className="size-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete category?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this category. This action cannot be undone.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => {
                    toast.promise(deleteCategory(row.original.id), {
                      loading: "Deleting category...",
                      success: "Category deleted successfully!",
                      error: "Failed to delete category."
                    })
                  }}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ButtonGroup>
      )
    },
  }
]
