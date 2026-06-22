"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCategory } from "./actions"
import { toast } from "sonner"
import { ExpenseCategory } from "./columns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EditCategoryDialog({ category, children }: { category: ExpenseCategory, children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsPending(true)
    try {
      await updateCategory(formData)
      toast.success("Category updated successfully")
      setOpen(false)
    } catch (error) {
      toast.error("Failed to update category")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to your category here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit}>
          <input type="hidden" name="id" value={category.id} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={category.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryType" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select name="categoryType" defaultValue={category.categoryType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primer">Primer (Kebutuhan Pokok)</SelectItem>
                    <SelectItem value="Non-Primer">Non-Primer (Keinginan/Gaya Hidup)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budgetLimit" className="text-right">
                Budget Limit (Rp)
              </Label>
              <Input
                id="budgetLimit"
                name="budgetLimit"
                type="number"
                defaultValue={category.budgetLimit}
                className="col-span-3"
                required
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
