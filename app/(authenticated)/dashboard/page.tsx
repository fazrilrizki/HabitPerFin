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
import { Wallet, TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";
import { getDashboardKPIs, getMonthlyCashFlow, getExpenseByCategory } from "@/lib/actions/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";

export default async function Page() {
  const session = await auth0.getSession();
  if (!session?.user) redirect("/auth/login");
  const userId = session.user.sub;

  const [kpis, cashFlowData, expenseCategoryData] = await Promise.all([
    getDashboardKPIs(userId),
    getMonthlyCashFlow(userId),
    getExpenseByCategory(userId),
  ]);

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
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Saldo" 
              value={`Rp ${kpis.totalBalance.toLocaleString("id-ID")}`}
              icon={Wallet}
              description="Di seluruh dompet aktif"
            />
            <StatCard 
              title="Pemasukan Bulan Ini" 
              value={`Rp ${kpis.monthIncome.toLocaleString("id-ID")}`}
              icon={TrendingUp}
              description="Total pendapatan bulan ini"
            />
            <StatCard 
              title="Pengeluaran Bulan Ini" 
              value={`Rp ${kpis.monthExpense.toLocaleString("id-ID")}`}
              icon={TrendingDown}
              description="Total pengeluaran bulan ini"
            />
            <StatCard 
              title="Keberhasilan Habit" 
              value={`${kpis.habitCompletionRate}%`}
              icon={CheckCircle2}
              description="Tingkat penyelesaian bulan ini"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
            <CashFlowChart data={cashFlowData} />
            <ExpensePieChart data={expenseCategoryData.data} totalExpense={expenseCategoryData.totalExpense} />
          </div>

        </div>
    </SidebarInset>
  )
}
