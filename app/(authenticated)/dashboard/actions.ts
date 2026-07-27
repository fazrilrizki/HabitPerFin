"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFinancialOverview() {
    const wallets = await prisma.walletManagements.findMany();
    const totalBalance = wallets.reduce((acc, wallet) => acc + Number(wallet.remaining_balance), 0);
    
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const incomes = await prisma.income.aggregate({
        _sum: { amount: true },
        where: { transactionDate: { gte: firstDay, lte: lastDay } }
    });

    const expenses = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: { transactionDate: { gte: firstDay, lte: lastDay } }
    });

    return {
        totalBalance,
        monthlyIncome: Number(incomes._sum.amount || 0),
        monthlyExpense: Number(expenses._sum.amount || 0)
    };
}

export async function getTodayHabits() {
    const today = new Date();
    // we use UTC dates to prevent timezone issues since the db uses db.Date
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    const habits = await prisma.habit.findMany({
        where: { status: 'active' },
        include: {
            logs: {
                where: { date: startOfDay }
            }
        }
    });

    return habits.map(habit => ({
        ...habit,
        isCompletedToday: habit.logs.length > 0 ? habit.logs[0].isCompleted : false,
        logId: habit.logs.length > 0 ? habit.logs[0].id : null
    }));
}

export async function toggleHabitStatus(habitId: number, isCompleted: boolean) {
    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    
    const existingLog = await prisma.habitLog.findUnique({
        where: {
            habit_id_date: { habit_id: habitId, date: startOfDay }
        }
    });

    if (existingLog) {
        await prisma.habitLog.update({
            where: { id: existingLog.id },
            data: { isCompleted }
        });
    } else {
        await prisma.habitLog.create({
            data: {
                habit_id: habitId,
                date: startOfDay,
                isCompleted
            }
        });
    }
    
    revalidatePath("/dashboard");
}

export async function getExpenseByCategoryThisMonth() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const expenses = await prisma.expense.findMany({
        where: { transactionDate: { gte: firstDay, lte: lastDay } },
        include: { expenseCategory: true }
    });

    const categoryTotals: Record<string, number> = {};
    expenses.forEach(exp => {
        const catName = exp.expenseCategory?.name || 'Uncategorized';
        categoryTotals[catName] = (categoryTotals[catName] || 0) + Number(exp.amount);
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
}

export async function getRecentTransactions() {
    const incomes = await prisma.income.findMany({
        orderBy: { transactionDate: 'desc' },
        take: 5
    });

    const expenses = await prisma.expense.findMany({
        orderBy: { transactionDate: 'desc' },
        take: 5
    });

    const merged = [
        ...incomes.map(i => ({ ...i, type: 'income' as const })),
        ...expenses.map(e => ({ ...e, type: 'expense' as const }))
    ];

    merged.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
    return merged.slice(0, 5).map(t => ({
        id: t.id,
        amount: Number(t.amount),
        description: t.description,
        date: t.transactionDate,
        type: t.type
    }));
}

export async function getFinancialGoalsProgress() {
    const goals = await prisma.financialGoal.findMany({
        where: { status: 'active' },
        include: { savings: true }
    });

    return goals.map(goal => {
        const totalSaved = goal.savings.reduce((acc, s) => acc + Number(s.amount), 0);
        return {
            id: goal.id,
            name: goal.name,
            targetAmount: Number(goal.targetAmount),
            totalSaved,
            progress: (totalSaved / Number(goal.targetAmount)) * 100
        };
    });
}
