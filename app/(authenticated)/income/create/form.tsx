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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useRef, useState, useTransition } from "react";
import { createIncome } from "../actions";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/datepicker";
import SelectCustom from "@/components/ui/select-custom";
import Link from "next/link";
import { WalletOption } from "../../wallet-management/actions";
import { Wallet } from "lucide-react";

export default function FormCreate({ walletManagementOptions }: {
    walletManagementOptions: WalletOption[]
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>();

  const selectedWallet = walletManagementOptions.find(w => w.value === selectedWalletId);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createIncome(formData);
      formRef.current?.reset();
      setResetKey(prev => prev + 1)
      setSelectedWalletId(undefined)
      toast.success("Income created succcessfully");
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Income</CardTitle>
        <CardDescription>Create and record your income.</CardDescription>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
                <Label htmlFor="wallet">Wallet</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Rp. 0"
                  required
                  min="0"
                />
              </Field>
              <Field>
                <Label htmlFor="transaction_date">Transaction Date</Label>
                <DatePicker key={resetKey} name="transaction_date" />
              </Field>
            </div>
            <Field>
              <Label htmlFor="name">Description</Label>
              <Textarea id="description" name="description" placeholder="Tell about your income description" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-4">
          <Field orientation="horizontal">
            <Button type="button" variant="outline" disabled={isPending}>
              <Link href="/income">
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
