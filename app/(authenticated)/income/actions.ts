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
        orderBy: { transactionDate: "desc" },
        include: { walletManagements: true }
    })

    return income.map(c => ({
        id: String(c.id),
        amount: Number(c.amount),
        description: c.description,
        transactionDate: c.transactionDate,
        wallet: c.walletManagements.name
    }))
}

const createIncomeSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    transaction_date: z.string().min(1, "Transaction date is required").transform((str) => new Date(str)),
    description: z.string(),
    wallet_id: z.string().min(1, "Wallet is required"),
})

export async function createIncome(formData: FormData) {
    const parsed = createIncomeSchema.safeParse({
        amount: formData.get("amount"),
        transaction_date: formData.get("transaction_date"),
        description: formData.get("description"),
        wallet_id: formData.get("wallet_id")
    })

    if (!parsed.success) {
        return
    }

    const session = await auth0.getSession();
    if (!session?.user) return;

    await prisma.income.create({
        data: {
            amount: parsed.data.amount,
            transactionDate: parsed.data.transaction_date,
            description: parsed.data.description,
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
                increment: Number(parsed.data.amount)
            }
        }
    })

    revalidatePath("/income")
}

export async function deleteIncome(id: string) {
    const session = await auth0.getSession();
    if (!session?.user) return;

    await prisma.income.deleteMany({
        where: { 
            id: parseInt(id),
            userId: session.user.sub
        }
    })

    revalidatePath("/income")
}