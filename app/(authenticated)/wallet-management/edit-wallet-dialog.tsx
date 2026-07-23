"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CurrencyInputCustom } from "@/components/ui/currency-input"
import { updateWallet } from "./actions"
import { WalletManagement } from "./columns"

interface EditWalletDialogProps {
  wallet: WalletManagement;
  children: React.ReactNode;
}

export function EditWalletDialog({ wallet, children }: EditWalletDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateWallet(formData)
      setOpen(false)
      toast.success("Wallet updated successfully")
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit wallet</DialogTitle>
          <DialogDescription>
            Update your wallet details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={wallet.id} />
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={wallet.name} placeholder="Mandiri" required />
            </Field>
            <Field>
              <Label htmlFor="initial_balance">Initial Balance</Label>
              <CurrencyInputCustom
                id="initial_balance"
                name="initial_balance"
                defaultValue={wallet.initial_balance}
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
