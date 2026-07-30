"use server";

import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function getDashboardKPIs(userId: string) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // 1. Total Balance
  const wallets = await prisma.walletManagements.findMany({
    where: { userId }, 
  });
  const totalBalance = wallets.reduce((acc, w) => acc + Number(w.remaining_balance), 0);

  // 2. Income this month
  const incomes = await prisma.income.aggregate({
    where: {
      userId,
      transactionDate: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const monthIncome = Number(incomes._sum.amount || 0);

  // 3. Expense this month
  const expenses = await prisma.expense.aggregate({
    where: {
      userId,
      transactionDate: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const monthExpense = Number(expenses._sum.amount || 0);

  // 4. Habit Completion Rate this month
  const activeHabits = await prisma.habit.count({
    where: { userId, status: "active" },
  });
  
  let habitCompletionRate = 0;
  if (activeHabits > 0) {
    const habitLogs = await prisma.habitLog.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });
    const completed = habitLogs.filter((log) => log.isCompleted).length;
    const total = habitLogs.length;
    if (total > 0) {
      habitCompletionRate = Math.round((completed / total) * 100);
    }
  }

  return {
    totalBalance,
    monthIncome,
    monthExpense,
    habitCompletionRate,
  };
}

export async function getMonthlyCashFlow(userId: string) {
  const now = new Date();
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  const incomes = await prisma.income.findMany({
    where: {
      userId,
      transactionDate: { gte: sixMonthsAgo },
    },
    select: { amount: true, transactionDate: true },
  });

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      transactionDate: { gte: sixMonthsAgo },
    },
    select: { amount: true, transactionDate: true },
  });

  const monthlyData: Record<string, { month: string; income: number; expense: number; _date: Date }> = {};

  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    const label = d.toLocaleString("id-ID", { month: "short", year: "numeric" });
    monthlyData[label] = { month: label, income: 0, expense: 0, _date: d };
  }

  incomes.forEach((inc) => {
    const label = inc.transactionDate.toLocaleString("id-ID", { month: "short", year: "numeric" });
    if (monthlyData[label]) {
      monthlyData[label].income += Number(inc.amount);
    }
  });

  expenses.forEach((exp) => {
    const label = exp.transactionDate.toLocaleString("id-ID", { month: "short", year: "numeric" });
    if (monthlyData[label]) {
      monthlyData[label].expense += Number(exp.amount);
    }
  });

  return Object.values(monthlyData).sort((a, b) => a._date.getTime() - b._date.getTime());
}

export async function getExpenseByCategory(userId: string) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      transactionDate: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    include: {
      expenseCategory: true,
    },
  });

  const categoryMap: Record<string, number> = {};
  let totalExpense = 0;

  expenses.forEach((exp) => {
    const name = exp.expenseCategory.name;
    const amount = Number(exp.amount);
    categoryMap[name] = (categoryMap[name] || 0) + amount;
    totalExpense += amount;
  });

  const data = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  return { data, totalExpense };
}
