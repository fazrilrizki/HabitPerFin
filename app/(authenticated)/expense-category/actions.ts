"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import z from "zod"
import { ExpenseCategory } from "./columns"
import { SelectOption } from "@/components/ui/select-custom"

export async function getData(): Promise<ExpenseCategory[]> {
  const categories = await prisma.expenseCategory.findMany({
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

  await prisma.expenseCategory.create({
    data: {
      name: parsed.data.name,
      categoryType: parsed.data.categoryType,
      budgetLimit: parsed.data.budgetLimit,
      status: "Active",
    }
  })

  revalidatePath("/expense-category")
}

export async function toggleCategoryStatus(id: string, status: "Active" | "Inactive") {
  await prisma.expenseCategory.update({
    where: { id: parseInt(id) },
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

  await prisma.expenseCategory.update({
    where: { id: parseInt(parsed.data.id) },
    data: {
      name: parsed.data.name,
      categoryType: parsed.data.categoryType,
      budgetLimit: parsed.data.budgetLimit,
    }
  })

  revalidatePath("/expense-category")
}

export async function deleteCategory(id: string) {
  await prisma.expenseCategory.delete({
    where: { id: parseInt(id) }
  })

  revalidatePath("/expense-category")
}

export async function getExpenseCategoryOptions(): Promise<SelectOption[]> {
  const categories = await prisma.expenseCategory.findMany({
    where: {
      status: "Active"
    },
    orderBy: { name: "asc" }
  });
  return categories.map(c => ({
    value: String(c.id),
    label: c.name
  }));
}
