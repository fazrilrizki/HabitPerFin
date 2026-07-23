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
import { getFinancialGoalDetails } from "../actions";
import { getWalletManagementOptions } from "../../wallet-management/actions";
import AddSavingDialog from "./add-saving-dialog";
import { Target, Calendar, ListPlus, Banknote } from "lucide-react";

export default async function FinancialGoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  const resolvedParams = await params;
  const goal = await getFinancialGoalDetails(resolvedParams.id);

  if (!goal) {
    redirect("/financial-goals");
  }

  const wallets = await getWalletManagementOptions();

  return (
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/financial-goals">Financial Goals</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{goal.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{goal.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Target Date: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No Target Date'}
              </p>
            </div>
            <AddSavingDialog goalId={goal.id} wallets={wallets} />
          </div>

          <Card className="w-full border-border/60 shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-border/50">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Saved</p>
                      <h2 className="text-3xl font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(goal.savedAmount)}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Target Amount</p>
                      <h3 className="text-xl font-semibold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(goal.targetAmount)}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span>{goal.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-secondary shadow-inner">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Savings History
            </h3>
            
            {goal.savings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-muted/20 border-dashed">
                <ListPlus className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No savings recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goal.savings.map((saving) => (
                  <div key={saving.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Banknote className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-base">{saving.description || 'Savings Deposit'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-0.5 rounded-md">
                            {saving.walletName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(saving.transactionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 text-right">
                      <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                        +{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(saving.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
    </SidebarInset>
  )
}
