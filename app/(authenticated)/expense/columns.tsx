"use client"

import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { ColumnDef } from "@tanstack/react-table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { deleteExpense } from "./actions"

export type Expense = {
    id: string
    amount: number
    description: string
    transactionDate: Date
    expenseCategory: string
}

export const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "expenseCategory",
        header: "Category",
    },
    {
        accessorKey: "transactionDate",
        header: "Date",
        cell: ({row}) => {
            const date = new Date(row.getValue("transactionDate"));
            return <div>{date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        }
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
        return (
            <ButtonGroup>
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
                            toast.promise(deleteExpense(row.original.id), {
                            loading: "Deleting expense...",
                            success: "Expense deleted successfully!",
                            error: "Failed to delete expense."
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