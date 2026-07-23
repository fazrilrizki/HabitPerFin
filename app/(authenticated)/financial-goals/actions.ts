"use server"

import prisma from "@/lib/prisma";
import z from "zod";
import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth0";

export type FinancialGoalData = {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: Date | null;
  status: string;
  savedAmount: number;
  percentage: number;
};

export type FinancialGoalSavingData = {
  id: string;
  amount: number;
  transactionDate: Date;
  description: string | null;
  walletName: string;
};

export async function getFinancialGoals(): Promise<FinancialGoalData[]> {
    const session = await auth0.getSession();
    if (!session?.user) return [];

    const goals = await prisma.financialGoal.findMany({
        where: { userId: session.user.sub },
        orderBy: { createdAt: "desc" },
        include: {
            savings: true
        }
    });

    return goals.map(g => {
        const savedAmount = g.savings.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const targetAmount = Number(g.targetAmount);
        const percentage = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
        
        return {
            id: String(g.id),
            name: g.name,
            targetAmount: targetAmount,
            targetDate: g.targetDate,
            status: g.status,
            savedAmount: savedAmount,
            percentage: percentage
        };
    });
}

const createGoalSchema = z.object({
    name: z.string().min(1, "Name is required"),
    target_amount: z.string().min(1, "Target amount is required").transform(val => val.replace(/[^0-9-]+/g,"")),
    target_date: z.string().optional().transform(val => val ? new Date(val) : null)
});

export async function createFinancialGoal(formData: FormData) {
    const parsed = createGoalSchema.safeParse({
        name: formData.get("name"),
        target_amount: formData.get("target_amount"),
        target_date: formData.get("target_date")
    });

    if (!parsed.success) {
        return;
    }

    const session = await auth0.getSession();
    if (!session?.user) return;

    await prisma.financialGoal.create({
        data: {
            name: parsed.data.name,
            targetAmount: parsed.data.target_amount,
            targetDate: parsed.data.target_date,
            userId: session.user.sub
        }
    });

    revalidatePath("/financial-goals");
}

export async function getFinancialGoalDetails(id: string) {
    const session = await auth0.getSession();
    if (!session?.user) return null;

    const goal = await prisma.financialGoal.findUnique({
        where: { id: parseInt(id) },
        include: {
            savings: {
                orderBy: { transactionDate: "desc" },
                include: { walletManagements: true }
            }
        }
    });

    if (!goal || goal.userId !== session.user.sub) return null;

    const savedAmount = goal.savings.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const targetAmount = Number(goal.targetAmount);
    const percentage = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;

    return {
        id: String(goal.id),
        name: goal.name,
        targetAmount: targetAmount,
        targetDate: goal.targetDate,
        status: goal.status,
        savedAmount: savedAmount,
        percentage: percentage,
        savings: goal.savings.map(s => ({
            id: String(s.id),
            amount: Number(s.amount),
            transactionDate: s.transactionDate,
            description: s.description,
            walletName: s.walletManagements.name
        }))
    };
}

const addSavingSchema = z.object({
    goal_id: z.string().min(1, "Goal ID is required"),
    amount: z.string().min(1, "Amount is required").transform(val => val.replace(/[^0-9-]+/g,"")),
    wallet_id: z.string().min(1, "Wallet is required"),
    transaction_date: z.string().min(1, "Transaction date is required").transform(val => new Date(val)),
    description: z.string()
});

export async function addGoalSaving(formData: FormData) {
    const parsed = addSavingSchema.safeParse({
        goal_id: formData.get("goal_id"),
        amount: formData.get("amount"),
        wallet_id: formData.get("wallet_id"),
        transaction_date: formData.get("transaction_date"),
        description: formData.get("description")
    });

    if (!parsed.success) {
        return;
    }

    const session = await auth0.getSession();
    if (!session?.user) return;

    // Create the saving transaction
    await prisma.financialGoalSaving.create({
        data: {
            financial_goal_id: parseInt(parsed.data.goal_id),
            amount: parsed.data.amount,
            wallet_management_id: parseInt(parsed.data.wallet_id),
            transactionDate: parsed.data.transaction_date,
            description: parsed.data.description,
            userId: session.user.sub
        }
    });

    // Deduct the wallet balance
    await prisma.walletManagements.update({
        where: { id: parseInt(parsed.data.wallet_id) },
        data: {
            remaining_balance: {
                decrement: Number(parsed.data.amount)
            }
        }
    });

    revalidatePath("/financial-goals");
    revalidatePath(`/financial-goals/${parsed.data.goal_id}`);
}
