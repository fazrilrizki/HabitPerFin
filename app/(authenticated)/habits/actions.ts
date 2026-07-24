"use server";

import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createHabit(formData: FormData) {
  const session = await auth0.getSession();
  const userId = session?.user?.sub || "system";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const frequency = formData.get("frequency") as string || "daily";

  if (!name) {
    throw new Error("Habit name is required");
  }

  await prisma.habit.create({
    data: {
      name,
      description,
      frequency,
      userId,
    },
  });

  revalidatePath("/habits");
}

export async function deleteHabit(id: number) {
  const session = await auth0.getSession();
  const userId = session?.user?.sub || "system";

  await prisma.habit.delete({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/habits");
}

export async function toggleHabitLog(habitId: number, dateStr: string, isCompleted: boolean) {
  const session = await auth0.getSession();
  const userId = session?.user?.sub || "system";
  
  const date = new Date(dateStr);
  
  if (isCompleted) {
    // Add log
    await prisma.habitLog.upsert({
      where: {
        habit_id_date: {
          habit_id: habitId,
          date: date
        }
      },
      update: {
        isCompleted: true,
      },
      create: {
        habit_id: habitId,
        date: date,
        isCompleted: true,
        userId,
      }
    });
  } else {
    // Delete log
    await prisma.habitLog.deleteMany({
      where: {
        habit_id: habitId,
        date: date,
        userId,
      }
    });
  }

  revalidatePath("/habits");
}
