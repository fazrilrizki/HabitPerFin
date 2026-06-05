"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import z from "zod"
import { WalletManagement } from "./columns"

export async function getData(): Promise<WalletManagement[]> {
  const wallets = await prisma.walletManagements.findMany({
    orderBy: { createdAt: "desc" }
  })
  return wallets.map(w => ({
    id: String(w.id),
    name: w.name,
    initial_balance: Number(w.initial_balance),
    status: w.status as "Active" | "Inactive",
  }))
}

const createWalletSchema = z.object({
  name: z.string().min(1, "Name is required"),
  initial_balance: z.string().min(1, "Initial balance is required")
})

export async function createWallet(formData: FormData) {
  const parsed = createWalletSchema.safeParse({
    name: formData.get("name"),
    initial_balance: formData.get("initial_balance"),
  })

  if (!parsed.success) {
    return
  }

  await prisma.walletManagements.create({
    data: {
      name: parsed.data.name,
      initial_balance: parsed.data.initial_balance,
      status: "Active",
    }
  })

  revalidatePath("/wallet-management")
}
