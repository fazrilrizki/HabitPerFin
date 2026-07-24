import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/prisma";
import { HabitList } from "./habit-list";
import { AddHabitDialog } from "./add-habit-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function HabitsPage() {
  const session = await auth0.getSession();
  const userId = session?.user?.sub || "system";

  // Ambil 7 hari terakhir untuk limit pengambilan log (optimasi)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const habits = await prisma.habit.findMany({
    where: {
      userId,
    },
    include: {
      logs: {
        where: {
          date: {
            gte: sevenDaysAgo
          }
        },
        select: {
          id: true,
          date: true,
          isCompleted: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">App</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Habit Tracker</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Habit Tracker</h1>
            <p className="text-muted-foreground">Bangun kebiasaan finansial yang baik dengan melacak aktivitas harian Anda.</p>
          </div>
          <AddHabitDialog />
        </div>

        <HabitList habits={habits} />
      </div>
    </SidebarInset>
  );
}
