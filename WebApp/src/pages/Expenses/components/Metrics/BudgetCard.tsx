import { CardWrapper } from "./CardWrapper";

export function BudgetCard({
  budget,
  currentSpend,
  formattedBudget,
  formattedRemaining,
  formattedCurrentSpend,
}: {
  budget: number;
  currentSpend: number;
  formattedBudget: string;
  formattedRemaining: string;
  formattedCurrentSpend: string;
}) {
  const budgetPct = Math.min(100, (currentSpend / budget) * 100);
  const over = currentSpend > budget;

  return (
    <CardWrapper>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${over ? "bg-error/10 text-error" : "text-primary bg-primary/10"}`}
        >
          <span className="material-symbols-outlined text-[18px]">account_balance</span>
        </div>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Monthly Budget</span>
      </div>
      <h2 className={`text-3xl font-black font-headline tracking-tight ${over ? "text-error" : "text-on-surface"}`}>
        {formattedBudget}
      </h2>
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
          <span>{over ? "Over budget" : `${formattedRemaining} left`}</span>
          <span>{budgetPct.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${budgetPct >= 100 ? "bg-error" : budgetPct >= 80 ? "bg-amber-400" : "bg-primary"}`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <p className="text-[10px] text-on-surface-variant/50 font-medium">
          Spent {formattedCurrentSpend} of {formattedBudget}
        </p>
      </div>
    </CardWrapper>
  );
}
