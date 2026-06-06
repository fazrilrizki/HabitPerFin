"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { toggleWalletStatus } from "./actions"
import { toast } from "sonner"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { EditWalletDialog } from "./edit-wallet-dialog"

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
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50" aria-label="Delete">
            <Trash2 className="size-4" /> Delete
          </Button>
        </ButtonGroup>
      )
    },
  }
]