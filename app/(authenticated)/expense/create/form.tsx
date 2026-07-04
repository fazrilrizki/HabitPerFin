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

export default function FormCreate() {
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
              <Label htmlFor="name">Amount</Label>
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
              <Label htmlFor="name">Transaction Date</Label>
              <DatePicker name="transaction_date" />
            </Field>
            <Field>
              <Label htmlFor="name">Description</Label>
              <Textarea id="description" name="description" placeholder="Tell about your expense description" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-4">
          <Field orientation="horizontal">
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
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
