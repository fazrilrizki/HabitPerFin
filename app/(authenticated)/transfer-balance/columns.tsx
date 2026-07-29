"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteTransfer } from "./actions"

export type TransferType = {
  id: string
  amount: number
  description: string
  transactionDate: Date
  fromWallet: string
  toWallet: string
}

export const columns: ColumnDef<TransferType>[] = [
  {
    accessorKey: "transactionDate",
    header: "Date",
    cell: ({ row }) => {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium"
      }).format(row.getValue("transactionDate"))
    },
    filterFn: (row, id, value) => {
        if (!value?.from) return true;
        const rowDate = row.getValue(id) as Date;
        if (value.to) {
            return rowDate >= value.from && rowDate <= value.to;
        }
        return rowDate >= value.from;
    }
  },
  {
    accessorKey: "fromWallet",
    header: "From Wallet",
  },
  {
    accessorKey: "toWallet",
    header: "To Wallet",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(amount)
      return <div className="font-medium text-blue-600">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transfer = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={async () => {
                if(confirm("Are you sure you want to delete this transfer? This will revert the balances.")) {
                  await deleteTransfer(transfer.id)
                }
              }}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <Trash className="w-4 h-4 mr-2"/> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
