"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getGroupedRowModel,
  getExpandedRowModel,
  GroupingState,
  ExpandedState,
} from "@tanstack/react-table"
import { ChevronRight, ChevronDown } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      grouping: ['expenseCategory']
    },
    autoResetExpanded: false,
    autoResetPageIndex: false,
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
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
                        <div className="flex items-center gap-2 font-semibold">
                          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          {flexRender(groupedCell.column.columnDef.cell, groupedCell.getContext())} ({row.subRows.length})
                        </div>
                      </TableCell>
                    );
                  })()
                ) : (
                  row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                       {/* Untuk row data biasa, kita bisa mengosongkan sel kategori agar tidak berulang, atau biarkan saja. Kita biarkan null jika itu kolom kategori agar bersih. */}
                       {cell.column.id === "expenseCategory" ? null : flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}