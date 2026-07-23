"use server"

import prisma from "@/lib/prisma";
import { Expense } from "./columns";
import z from "zod";
import { parse } from "path";
import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth0";

export async function getData(): Promise<Expense[]> {
    const session = await auth0.getSession();
    if (!session?.user) return [];

    const expense = await prisma.expense.findMany({
        where: { userId: session.user.sub },
        orderBy: { transactionDate: "desc" },
        include: { expenseCategory: true }
    })

    return expense.map(c => ({
        id: String(c.id),
        amount: Number(c.amount),
        description: c.description,
        transactionDate: c.transactionDate,
        expenseCategory: c.expenseCategory.name,
    }))
}

const createExpenseSchema = z.object({
    amount: z.string().min(1, "Amount is required").transform(val => val.replace(/[^0-9-]+/g,"")),
    transaction_date: z.string().min(1, "Transaction date is required").transform((str) => new Date(str)),
    description: z.string(),
    category_id: z.string().min(1, "Category is required"),
    wallet_id: z.string().min(1, "Wallet is required")
})

export async function createExpense(formData: FormData) {
    const parsed = createExpenseSchema.safeParse({
        amount: formData.get("amount"),
        transaction_date: formData.get("transaction_date"),
        description: formData.get("description"),
        category_id: formData.get("category_id"),
        wallet_id: formData.get("wallet_id")
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
            wallet_management_id: parseInt(parsed.data.wallet_id),
            userId: session.user.sub
        }
    })

    await prisma.walletManagements.update({
        where: { 
            id: parseInt(parsed.data.wallet_id)
        },
        data : {
            remaining_balance: {
                decrement: Number(parsed.data.amount)
            }
        }
    })

    revalidatePath("/expense")

    const category = await prisma.expenseCategory.findUnique({
        where: { id: parseInt(parsed.data.category_id) }
    })
    
    if (category) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const expenses = await prisma.expense.aggregate({
            where: {
                userId: session.user.sub,
                expense_category_id: category.id,
                transactionDate: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                }
            },
            _sum: {
                amount: true
            }
        });

        const totalSpent = Number(expenses._sum.amount || 0);
        const budgetLimit = Number(category.budgetLimit);

        if (budgetLimit > 0 && totalSpent >= budgetLimit * 0.8) {
            const percentage = Math.round((totalSpent / budgetLimit) * 100);
            return { warning: `Expense for category ${category.name} has reached ${percentage}% of this month's budget limit!` };
        }
    }
}

export async function deleteExpense(id: string) {
    const session = await auth0.getSession();
    if (!session?.user) return;

    const expense = await prisma.expense.findFirst({
        where: { id: parseInt(id) }
    })

    await prisma.expense.deleteMany({
        where: { 
            id: parseInt(id),
            userId: session.user.sub
        }
    })
    
    if (expense?.wallet_management_id) {
        await prisma.walletManagements.update({
            where: { 
                id: expense.wallet_management_id
            },
            data : {
                remaining_balance: {
                    increment: Number(expense.amount)
                }
            }
        })
    }

    revalidatePath("/expense")
}