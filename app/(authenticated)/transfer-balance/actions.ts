"use server"

import prisma from "@/lib/prisma";
import { TransferType } from "./columns";
import z from "zod";
import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth0";

export async function getData(): Promise<TransferType[]> {
    const session = await auth0.getSession();
    if (!session?.user) return [];

    const transfers = await prisma.transfer.findMany({
        where: { userId: session.user.sub },
        orderBy: { transactionDate: "desc" },
        include: { fromWallet: true, toWallet: true }
    })

    return transfers.map(t => ({
        id: String(t.id),
        amount: Number(t.amount),
        description: t.description,
        transactionDate: t.transactionDate,
        fromWallet: t.fromWallet.name,
        toWallet: t.toWallet.name,
    }))
}

const createTransferSchema = z.object({
    amount: z.string().min(1, "Amount is required").transform(val => val.replace(/[^0-9-]+/g,"")),
    transaction_date: z.string().min(1, "Transaction date is required").transform((str) => new Date(str)),
    description: z.string(),
    from_wallet_id: z.string().min(1, "Source Wallet is required"),
    to_wallet_id: z.string().min(1, "Destination Wallet is required")
})

export async function createTransfer(formData: FormData) {
    const parsed = createTransferSchema.safeParse({
        amount: formData.get("amount"),
        transaction_date: formData.get("transaction_date"),
        description: formData.get("description"),
        from_wallet_id: formData.get("from_wallet_id"),
        to_wallet_id: formData.get("to_wallet_id")
    })

    if (!parsed.success) {
        return { error: "Invalid form data" }
    }

    if (parsed.data.from_wallet_id === parsed.data.to_wallet_id) {
        return { error: "Source and Destination wallet cannot be the same" }
    }

    const session = await auth0.getSession();
    if (!session?.user) return;

    await prisma.$transaction(async (tx) => {
        // Create the transfer record
        await tx.transfer.create({
            data: {
                amount: parsed.data.amount,
                transactionDate: parsed.data.transaction_date,
                description: parsed.data.description,
                from_wallet_id: parseInt(parsed.data.from_wallet_id),
                to_wallet_id: parseInt(parsed.data.to_wallet_id),
                userId: session.user.sub
            }
        })

        // Deduct from source wallet
        await tx.walletManagements.update({
            where: { id: parseInt(parsed.data.from_wallet_id) },
            data: {
                remaining_balance: {
                    decrement: Number(parsed.data.amount)
                }
            }
        })

        // Add to destination wallet
        await tx.walletManagements.update({
            where: { id: parseInt(parsed.data.to_wallet_id) },
            data: {
                remaining_balance: {
                    increment: Number(parsed.data.amount)
                }
            }
        })
    })

    revalidatePath("/transfer-balance")
    revalidatePath("/wallet-management")
}

export async function deleteTransfer(id: string) {
    const session = await auth0.getSession();
    if (!session?.user) return;

    const transfer = await prisma.transfer.findFirst({
        where: { id: parseInt(id), userId: session.user.sub }
    })

    if (!transfer) return;

    await prisma.$transaction(async (tx) => {
        // Delete the transfer record
        await tx.transfer.delete({
            where: { id: parseInt(id) }
        })

        // Revert deduction from source wallet
        await tx.walletManagements.update({
            where: { id: transfer.from_wallet_id },
            data: {
                remaining_balance: {
                    increment: Number(transfer.amount)
                }
            }
        })

        // Revert addition to destination wallet
        await tx.walletManagements.update({
            where: { id: transfer.to_wallet_id },
            data: {
                remaining_balance: {
                    decrement: Number(transfer.amount)
                }
            }
        })
    })

    revalidatePath("/transfer-balance")
    revalidatePath("/wallet-management")
}
