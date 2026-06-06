"use client"

import { ColumnDef } from "@tanstack/react-table"

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
  },
]