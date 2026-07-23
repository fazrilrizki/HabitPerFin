"use client"

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CurrencyInputCustom } from "@/components/ui/currency-input"
import { Label } from "@/components/ui/label"
import { updateCategory } from "./actions"
import { toast } from "sonner"
import { ExpenseCategory } from "./columns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditCategoryDialogProps {
  category: ExpenseCategory;
  children: React.ReactNode;
}

export function EditCategoryDialog({ category, children }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateCategory(formData)
      setOpen(false)
      toast.success("Category updated successfully")
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to your category here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={category.id} />
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={category.name}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="categoryType">Type</Label>
              <Select name="categoryType" defaultValue={category.categoryType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primer">Primer (Kebutuhan Pokok)</SelectItem>
                  <SelectItem value="Non-Primer">Non-Primer (Keinginan/Gaya Hidup)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="budgetLimit">Budget Limit (Rp)</Label>
              <CurrencyInputCustom
                id="budgetLimit"
                name="budgetLimit"
                defaultValue={category.budgetLimit}
                placeholder="Rp 0"
                prefix="Rp "
                decimalsLimit={0}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
