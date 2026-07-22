import { PieChart } from "lucide-react";
import { ExpenseCategoryOption } from "@/app/(authenticated)/expense-category/actions";

export function BudgetProgress({ category }: { category: ExpenseCategoryOption }) {
  const percentage = (category.spent / (category.budgetLimit || 1)) * 100;
  const isOverBudget = percentage >= 100;
  const isWarning = percentage >= 80 && !isOverBudget;
  
  const bgColor = isOverBudget ? 'bg-red-500/10' : isWarning ? 'bg-orange-500/10' : 'bg-green-500/10';
  const borderColor = isOverBudget ? 'border-red-500/20' : isWarning ? 'border-orange-500/20' : 'border-green-500/20';
  const textColor = isOverBudget ? 'text-red-600 dark:text-red-400' : isWarning ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400';
  const barColor = isOverBudget ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-green-500';
  const trackColor = isOverBudget ? 'bg-red-500/20' : isWarning ? 'bg-orange-500/20' : 'bg-green-500/20';

  return (
    <div className={`mt-2 flex flex-col gap-2 rounded-lg ${bgColor} px-3 py-2.5 text-sm shadow-sm border ${borderColor}`}>
      <div className={`flex items-center justify-between ${textColor}`}>
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          <span className="font-medium">Monthly Budget</span>
        </div>
        <span className="font-bold tracking-tight">
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(category.spent)} / {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(category.budgetLimit)}
        </span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${trackColor}`}>
        <div 
          className={`h-full ${barColor} transition-all duration-300`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {isWarning && (
        <span className={`text-xs font-medium ${textColor}`}>
          Warning: You have reached {Math.round(percentage)}% of your budget limit!
        </span>
      )}
      {isOverBudget && (
        <span className={`text-xs font-medium ${textColor}`}>
          Alert: You have exceeded your budget limit!
        </span>
      )}
    </div>
  );
}
