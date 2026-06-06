"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { toggleWalletStatus } from "./actions"
import { toast } from "sonner"

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
]