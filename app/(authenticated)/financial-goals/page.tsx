import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getFinancialGoals } from "./actions";
import AddGoalDialog from "./add-goal-dialog";
import Link from "next/link";
import { Target } from "lucide-react";

export default async function FinancialGoalsPage() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  const goals = await getFinancialGoals();

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
                  <BreadcrumbPage>Financial Goals</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Financial Goals</h1>
              <p className="text-muted-foreground">Track and achieve your savings targets.</p>
            </div>
            <AddGoalDialog />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {goals.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-12 border rounded-xl bg-muted/20 border-dashed">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No goals found</h3>
                <p className="text-sm text-muted-foreground mb-4">You haven't set any financial goals yet.</p>
                <AddGoalDialog />
              </div>
            ) : (
              goals.map(goal => (
                <Link href={`/financial-goals/${goal.id}`} key={goal.id}>
                  <Card className="hover:shadow-md transition-all cursor-pointer h-full border-border/60 hover:border-primary/50 group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{goal.name}</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
                          <Target className="h-4 w-4" />
                        </div>
                      </div>
                      <CardDescription>
                        {goal.targetDate ? `Target: ${new Date(goal.targetDate).toLocaleDateString()}` : 'No target date'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-primary">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(goal.savedAmount)}</span>
                          <span className="text-muted-foreground">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(goal.targetAmount)}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div 
                            className="h-full bg-primary transition-all duration-500 ease-in-out" 
                            style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-right text-muted-foreground mt-1 font-medium">
                          {goal.percentage.toFixed(1)}% achieved
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
    </SidebarInset>
  )
}
