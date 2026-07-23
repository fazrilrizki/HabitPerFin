"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import z from "zod"
import { WalletManagement } from "./columns"
import { auth0 } from "@/lib/auth0"
import { SelectOption } from "@/components/ui/select-custom"

export async function getData(): Promise<WalletManagement[]> {
  const session = await auth0.getSession();
  if (!session?.user) return [];

  const wallets = await prisma.walletManagements.findMany({
    where: { userId: session.user.sub },
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
  initial_balance: z.string().min(1, "Initial balance is required").transform(val => val.replace(/[^0-9-]+/g,""))
})

export async function createWallet(formData: FormData) {
  const parsed = createWalletSchema.safeParse({
    name: formData.get("name"),
    initial_balance: formData.get("initial_balance"),
  })

  if (!parsed.success) {
    return
  }

  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.walletManagements.create({
    data: {
      name: parsed.data.name,
      initial_balance: parsed.data.initial_balance,
      remaining_balance: parsed.data.initial_balance,
      status: "Active",
      userId: session.user.sub,
    }
  })

  revalidatePath("/wallet-management")
}

export async function toggleWalletStatus(id: string, status: "Active" | "Inactive") {
  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.walletManagements.updateMany({
    where: { id: parseInt(id), userId: session.user.sub },
    data: { status }
  })
  revalidatePath("/wallet-management")
}

const updateWalletSchema = z.object({
  id: z.string().min(1, "Invalid wallet ID"),
  name: z.string().min(1, "Name is required"),
  initial_balance: z.string().min(1, "Initial balance is required").transform(val => val.replace(/[^0-9-]+/g,""))
})

export async function updateWallet(formData: FormData) {
  const parsed = updateWalletSchema.safeParse({
    id: formData.get("id") as string,
    name: formData.get("name"),
    initial_balance: formData.get("initial_balance"),
  });

  if (!parsed.success) {
    return
  }

  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.walletManagements.updateMany({
    where: { id: parseInt(parsed.data.id), userId: session.user.sub },
    data: {
      name: parsed.data.name,
      initial_balance: parsed.data.initial_balance,
    }
  })

  revalidatePath("/wallet-management")
}

export async function deleteWallet(id: string) {
  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.walletManagements.deleteMany({
    where: { id: parseInt(id), userId: session.user.sub }
  })

  revalidatePath("/wallet-management")
}

export type WalletOption = SelectOption & { remaining_balance: number };

export async function getWalletManagementOptions(): Promise<WalletOption[]> {
  const session = await auth0.getSession();
  if (!session?.user) return [];

  const walletManagements = await prisma.walletManagements.findMany({
    where: {
      status: "Active",
      userId: session.user.sub
    },
    orderBy: { name: "asc" }
  });
  return walletManagements.map(c => ({
    value: String(c.id),
    label: c.name,
    remaining_balance: Number(c.remaining_balance)
  }));
}
