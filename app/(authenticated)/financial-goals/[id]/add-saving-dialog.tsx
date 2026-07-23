"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CurrencyInputCustom } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import { Plus } from "lucide-react";
import React, { useRef, useState, useTransition } from "react";
import { addGoalSaving } from "../actions";
import { toast } from "sonner";
import SelectCustom from "@/components/ui/select-custom";
import { WalletOption } from "../../wallet-management/actions";

export default function AddSavingDialog({ goalId, wallets }: { goalId: string, wallets: WalletOption[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("goal_id", goalId);
    
    startTransition(async () => {
      await addGoalSaving(formData);
      setOpen(false);
      toast.success("Saving recorded successfully!");
      formRef.current?.reset();
      setResetKey(prev => prev + 1);
      setSelectedWalletId(undefined);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Savings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Savings</DialogTitle>
          <DialogDescription>
            Record new savings for this goal. The amount will be deducted from your selected wallet.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="wallet_id">Source Wallet</Label>
              <SelectCustom key={resetKey} name="wallet_id" options={wallets} placeholder="Select a Wallet" onValueChange={setSelectedWalletId}/>
            </Field>
            <Field>
              <Label htmlFor="amount">Amount</Label>
              <CurrencyInputCustom
                id="amount"
                name="amount"
                placeholder="Rp. 0"
                prefix="Rp "
                decimalsLimit={0}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="transaction_date">Date</Label>
              <DatePicker key={resetKey} name="transaction_date" />
            </Field>
            <Field>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" name="description" placeholder="e.g., December Bonus" />
            </Field>
            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !selectedWalletId}>
                {isPending ? "Saving..." : "Record Savings"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
