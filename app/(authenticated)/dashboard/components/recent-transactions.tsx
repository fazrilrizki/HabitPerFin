import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface Transaction {
    id: number;
    amount: number;
    description: string;
    date: Date;
    type: "income" | "expense";
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent transactions.</p>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((tx) => (
                            <div key={`${tx.type}-${tx.id}`} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500'}`}>
                                        {tx.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{tx.description || (tx.type === 'income' ? 'Income' : 'Expense')}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {tx.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className={`font-semibold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
