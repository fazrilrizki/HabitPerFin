"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CurrencyInputCustom } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useRef, useState, useTransition } from "react";
import { createExpense } from "../actions";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/datepicker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectCustom, { SelectOption } from "@/components/ui/select-custom";
import Link from "next/link";
import { WalletOption } from "../../wallet-management/actions";
import { ExpenseCategoryOption } from "../../expense-category/actions";
import { Wallet } from "lucide-react";
import { BudgetProgress } from "@/components/ui/budget-progress";


export default function FormCreate({ walletManagementOptions, categoryOptions }: {
  walletManagementOptions: WalletOption[],
  categoryOptions: ExpenseCategoryOption[]
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const selectedWallet = walletManagementOptions.find(w => w.value === selectedWalletId);
  const selectedCategory = categoryOptions.find(c => c.value === selectedCategoryId);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createExpense(formData);
      formRef.current?.reset();
      setResetKey(prev => prev + 1)
      setSelectedWalletId(undefined)
      setSelectedCategoryId(undefined)
      toast.success("Expense created succcessfully");
      if (res?.warning) {
        toast.warning(res.warning);
      }
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Expense</CardTitle>
        <CardDescription>Create and record your expense.</CardDescription>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="category">Wallet</Label>
                <SelectCustom key={resetKey} name="wallet_id" options={walletManagementOptions} placeholder="Select a Wallet" onValueChange={setSelectedWalletId}/>
                {selectedWallet && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2.5 text-sm text-primary shadow-sm border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span className="font-medium">Balance</span>
                    </div>
                    <span className="font-bold tracking-tight">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selectedWallet.remaining_balance)}
                    </span>
                  </div>
                )}
              </Field>
              <Field>
                <Label htmlFor="category">Expense Category</Label>
                <SelectCustom key={resetKey} name="category_id" options={categoryOptions} placeholder="Select a Expense Category" onValueChange={setSelectedCategoryId}/>
                {selectedCategory && (
                  <BudgetProgress category={selectedCategory} />
                )}
              </Field>

            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="transaction_date">Transaction Date</Label>
                <DatePicker key={resetKey} name="transaction_date" />
              </Field>
            </div>
            <Field>
              <Label htmlFor="name">Description</Label>
              <Textarea id="description" name="description" placeholder="Tell about your expense description" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-4">
          <Field orientation="horizontal">
            <Button type="button" variant="outline" disabled={isPending}>
              <Link href="/expense">
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </Field>
        </CardFooter>
      </form>
    </Card>
  );
}
