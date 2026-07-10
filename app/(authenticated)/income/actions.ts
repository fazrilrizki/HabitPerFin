"use server"

import prisma from "@/lib/prisma";
import { Income } from "./columns";
import z from "zod";
import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth0";

export async function getData(): Promise<Income[]> {
    const session = await auth0.getSession();
    if (!session?.user) return [];

    const income = await prisma.income.findMany({
        where: { userId: session.user.sub },
        orderBy: { transactionDate: "desc" }
    })

    return income.map(c => ({
        id: String(c.id),
        amount: Number(c.amount),
        description: c.description,
        transactionDate: c.transactionDate
    }))
}

const createExpenseSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    transaction_date: z.string().min(1, "Transaction date is required").transform((str) => new Date(str)),
    description: z.string(),
    category_id: z.string().min(1, "Category is required"),
})

export async function createExpense(formData: FormData) {
    const parsed = createExpenseSchema.safeParse({
        amount: formData.get("amount"),
        transaction_date: formData.get("transaction_date"),
        description: formData.get("description"),
        category_id: formData.get("category_id")
    })

    if (!parsed.success) {
        return
    }

    const session = await auth0.getSession();
    if (!session?.user) return;

    await prisma.expense.create({
        data: {
            amount: parsed.data.amount,
            transactionDate: parsed.data.transaction_date,
            description: parsed.data.description,
            expense_category_id: parseInt(parsed.data.category_id),
            userId: session.user.sub
        }
    })

    revalidatePath("/expense")
}

export async function deleteExpense(id: string) {
    const session = await auth0.getSession();
    if (!session?.user) return;

    await prisma.expense.deleteMany({
        where: { 
            id: parseInt(id),
            userId: session.user.sub
        }
    })

    revalidatePath("/expense")
}