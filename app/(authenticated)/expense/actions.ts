"use server"

import prisma from "@/lib/prisma";
import { Expense } from "./columns";
import z from "zod";
import { parse } from "path";
import { revalidatePath } from "next/cache";

export async function getData(): Promise<Expense[]> {
    const expense = await prisma.expense.findMany({
        orderBy: { createdAt: "desc" }
    })

    return expense.map(c => ({
        id: String(c.id),
        amount: Number(c.amount),
        description: c.description,
        transactionDate: c.transactionDate,
    }))
}

const createExpenseSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    transaction_date: z.string().min(1, "Transaction date is required").transform((str) => new Date(str)),
    description: z.string()
})

export async function createExpense(formData: FormData) {
    const parsed = createExpenseSchema.safeParse({
        amount: formData.get("amount"),
        transaction_date: formData.get("transaction_date"),
        description: formData.get("description")
    })

    if (!parsed.success) {
        return
    }

    await prisma.expense.create({
        data: {
            amount: parsed.data.amount,
            transactionDate: parsed.data.transaction_date,
            description: parsed.data.description
        }
    })

    revalidatePath("/expense")
}

export async function deleteExpense(id: string) {
    await prisma.expense.delete({
        where: { id: parseInt(id) }
    })

    revalidatePath("/expense")
}