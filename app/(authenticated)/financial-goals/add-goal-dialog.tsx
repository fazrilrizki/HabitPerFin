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
import { createFinancialGoal } from "./actions";
import { toast } from "sonner";

export default function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createFinancialGoal(formData);
      setOpen(false);
      toast.success("Goal created successfully");
      formRef.current?.reset();
      setResetKey(prev => prev + 1);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Financial Goal</DialogTitle>
          <DialogDescription>
            Set a new financial goal to track your savings.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Goal Name</Label>
              <Input id="name" name="name" placeholder="e.g., Vacation to Bali" required />
            </Field>
            <Field>
              <Label htmlFor="target_amount">Target Amount</Label>
              <CurrencyInputCustom
                id="target_amount"
                name="target_amount"
                placeholder="Rp. 0"
                prefix="Rp "
                decimalsLimit={0}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="target_date">Target Date (Optional)</Label>
              <DatePicker key={resetKey} name="target_date" />
            </Field>
            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Goal"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
