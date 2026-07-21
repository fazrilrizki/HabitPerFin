"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getGroupedRowModel,
  getExpandedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ChevronRight, ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DatePickerWithRange } from "@/components/ui/daterangepicker"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  actionButton?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  actionButton,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping: ['wallet'],
      columnFilters,
      globalFilter
    },
    autoResetExpanded: false,
    autoResetPageIndex: false,
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/50 bg-background/50">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="relative w-64 md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9 bg-muted/50 border-border/50"
            />
          </div>
          <DatePickerWithRange 
            date={table.getColumn("transactionDate")?.getFilterValue() as any}
            setDate={(date) => table.getColumn("transactionDate")?.setFilterValue(date)}
          />
          <Button variant="outline" onClick={() => table.getColumn("transactionDate")?.setFilterValue(null)}>
            Reset
          </Button>
        </div>
        {actionButton}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().some(c => c.getIsGrouped()) ? (
                    (() => {
                      const groupedCell = row.getVisibleCells().find(c => c.getIsGrouped())!;
                      return (
                        <TableCell colSpan={row.getVisibleCells().length} className="bg-muted/50 hover:bg-muted/80 cursor-pointer" onClick={row.getToggleExpandedHandler()}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 font-semibold">
                              {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              {flexRender(groupedCell.column.columnDef.cell, groupedCell.getContext())} ({row.subRows.length})
                            </div>
                            <div className="font-semibold pr-4">
                              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
                                  row.subRows.reduce((acc, subRow) => acc + parseFloat(subRow.getValue("amount") || "0"), 0)
                              )}
                            </div>
                          </div>
                        </TableCell>
                      );
                    })()
                  ) : (
                    row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.column.id === "wallet" ? null : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}