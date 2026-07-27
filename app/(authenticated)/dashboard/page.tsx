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
import { getExpenseCategoryOptions } from "../expense-category/actions";
import { BudgetProgress } from "@/components/ui/budget-progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { getFinancialOverview, getTodayHabits, getExpenseByCategoryThisMonth, getRecentTransactions } from "./actions";
import { OverviewCards } from "./components/overview-cards";
import { TodayHabits } from "./components/today-habits";
import { ExpenseChart } from "./components/expense-chart";
import { RecentTransactions } from "./components/recent-transactions";

export default async function Page() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  const [
    categories,
    overview,
    habits,
    expenseData,
    recentTx
  ] = await Promise.all([
    getExpenseCategoryOptions(),
    getFinancialOverview(),
    getTodayHabits(),
    getExpenseByCategoryThisMonth(),
    getRecentTransactions()
  ]);

  const alertCategories = categories.filter(c => c.spent >= (c.budgetLimit || 1) * 0.8 && c.budgetLimit > 0);

  return (
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          
          <OverviewCards 
            totalBalance={overview.totalBalance} 
            monthlyIncome={overview.monthlyIncome} 
            monthlyExpense={overview.monthlyExpense} 
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Area: Charts & Transactions (4 columns) */}
            <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-4">
              <div className="h-[400px]">
                <ExpenseChart data={expenseData} />
              </div>
              <div>
                <RecentTransactions transactions={recentTx} />
              </div>
            </div>

            {/* Sidebar Area: Habits & Alerts (3 columns) */}
            <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-3">
              {alertCategories.length > 0 && (
                <Card className="border-orange-500/20 bg-orange-500/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-lg">
                      <AlertCircle className="h-5 w-5" />
                      Budget Alerts
                    </CardTitle>
                    <CardDescription>
                      Categories nearing their budget limit this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {alertCategories.map(cat => (
                      <div key={cat.value} className="bg-background rounded-lg p-2 shadow-sm border border-border/50">
                         <div className="px-1 pt-1 font-semibold text-sm text-foreground">{cat.label}</div>
                         <BudgetProgress category={cat} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              <div className="flex-1 min-h-[300px]">
                <TodayHabits habits={habits} />
              </div>
            </div>
          </div>

        </div>
    </SidebarInset>
  )
}
