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
import React, { useRef, useTransition } from "react";
import { createExpense } from "../actions";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/datepicker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectCustom, { SelectOption } from "@/components/ui/select-custom";
import Link from "next/link";

export default function FormCreate({ categoryOptions }: {
  categoryOptions: SelectOption[]
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createExpense(formData);
      formRef.current?.reset();
      toast.success("Expense created succcessfully");
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
            <Field>
              <Label htmlFor="category">Expense Category</Label>
              <SelectCustom name="category_id" options={categoryOptions} placeholder="Select a Expense Category"/>
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
                <DatePicker name="transaction_date" />
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
