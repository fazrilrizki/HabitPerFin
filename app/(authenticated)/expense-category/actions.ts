"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import z from "zod"
import { ExpenseCategory } from "./columns"
import { SelectOption } from "@/components/ui/select-custom"
import { auth0 } from "@/lib/auth0"

export async function getData(): Promise<ExpenseCategory[]> {
  const session = await auth0.getSession();
  if (!session?.user) return [];

  const categories = await prisma.expenseCategory.findMany({
    where: { userId: session.user.sub },
    orderBy: { createdAt: "desc" }
  })
  return categories.map(c => ({
    id: String(c.id),
    name: c.name,
    categoryType: c.categoryType as "Primer" | "Non-Primer",
    budgetLimit: Number(c.budgetLimit),
    status: c.status as "Active" | "Inactive",
  }))
}

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryType: z.enum(["Primer", "Non-Primer"]),
  budgetLimit: z.string().min(1, "Budget limit is required"),
})

export async function createCategory(formData: FormData) {
  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    categoryType: formData.get("categoryType"),
    budgetLimit: formData.get("budgetLimit"),
  })

  if (!parsed.success) {
    return
  }

  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.expenseCategory.create({
    data: {
      name: parsed.data.name,
      categoryType: parsed.data.categoryType,
      budgetLimit: parsed.data.budgetLimit,
      status: "Active",
      userId: session.user.sub,
    }
  })

  revalidatePath("/expense-category")
}

export async function toggleCategoryStatus(id: string, status: "Active" | "Inactive") {
  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.expenseCategory.updateMany({
    where: { id: parseInt(id), userId: session.user.sub },
    data: { status }
  })
  revalidatePath("/expense-category")
}

const updateCategorySchema = z.object({
  id: z.string().min(1, "Invalid category ID"),
  name: z.string().min(1, "Name is required"),
  categoryType: z.enum(["Primer", "Non-Primer"]),
  budgetLimit: z.string().min(1, "Budget limit is required")
})

export async function updateCategory(formData: FormData) {
  const parsed = updateCategorySchema.safeParse({
    id: formData.get("id") as string,
    name: formData.get("name"),
    categoryType: formData.get("categoryType"),
    budgetLimit: formData.get("budgetLimit"),
  });

  if (!parsed.success) {
    return
  }

  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.expenseCategory.updateMany({
    where: { id: parseInt(parsed.data.id), userId: session.user.sub },
    data: {
      name: parsed.data.name,
      categoryType: parsed.data.categoryType,
      budgetLimit: parsed.data.budgetLimit,
    }
  })

  revalidatePath("/expense-category")
}

export async function deleteCategory(id: string) {
  const session = await auth0.getSession();
  if (!session?.user) return;

  await prisma.expenseCategory.deleteMany({
    where: { id: parseInt(id), userId: session.user.sub }
  })

  revalidatePath("/expense-category")
}

export type ExpenseCategoryOption = SelectOption & {
  budgetLimit: number;
  spent: number;
};

export async function getExpenseCategoryOptions(): Promise<ExpenseCategoryOption[]> {
  const session = await auth0.getSession();
  if (!session?.user) return [];

  const categories = await prisma.expenseCategory.findMany({
    where: {
      status: "Active",
      userId: session.user.sub
    },
    orderBy: { name: "asc" }
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const expenses = await prisma.expense.groupBy({
    by: ['expense_category_id'],
    where: {
      userId: session.user.sub,
      transactionDate: {
        gte: startOfMonth,
        lt: endOfMonth,
      }
    },
    _sum: {
      amount: true
    }
  });

  const spentMap = new Map();
  expenses.forEach(e => {
    spentMap.set(e.expense_category_id, Number(e._sum.amount || 0));
  });

  return categories.map(c => ({
    value: String(c.id),
    label: c.name,
    budgetLimit: Number(c.budgetLimit),
    spent: spentMap.get(c.id) || 0
  }));
}
