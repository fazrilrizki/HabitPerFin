"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { deleteWallet, toggleWalletStatus } from "./actions"
import { toast } from "sonner"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Trash2Icon } from "lucide-react"
import { EditWalletDialog } from "./edit-wallet-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type WalletManagement = {
  id: string
  name: string
  initial_balance: number
  status: "Active" | "Inactive"
}

export const columns: ColumnDef<WalletManagement>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "initial_balance",
    header: "Initial Balance",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Switch
          checked={status === "Active"}
          onCheckedChange={(checked) => {
            toast.promise(
              toggleWalletStatus(row.original.id, checked ? "Active" : "Inactive"),
              {
                loading: "Updating wallet status...",
                success: "Status updated successfully!",
                error: "Failed to update status,."
              }
            )
          }}
          aria-label="Toggle status"
        />
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <ButtonGroup>
          <EditWalletDialog wallet={row.original}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50" aria-label="Edit">
              <Edit className="size-4" /> Edit
            </Button>
          </EditWalletDialog>
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
              <AlertDialogTitle>Delete wallet?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this wallet and all of its data. This action cannot be undone.``
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => {
                    toast.promise(deleteWallet(row.original.id), {
                      loading: "Deleting wallet...",
                      success: "Wallet deleted successfully!",
                      error: "Failed to delete wallet."
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