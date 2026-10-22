import { useTranslation } from "react-i18next";
import { CardWrapper, CardLabel } from "./CardWrapper";

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
  const { t } = useTranslation();
  const budgetPct = Math.min(100, (currentSpend / budget) * 100);
  const over = currentSpend > budget;

  return (
    <CardWrapper>
      <CardLabel label={t("expenses.metrics.monthlyBudget")} icon="account_balance" />
      <p
        className={`mt-2 text-2xl md:text-3xl font-semibold tracking-tight tabular-nums truncate ${over ? "text-error" : "text-on-surface"}`}
      >
        {formattedBudget}
      </p>
      <div className="mt-1.5 min-h-5">
        <span
          className={`inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium tabular-nums ${
            over ? "bg-error/10 text-error" : "bg-surface-container text-on-surface-variant"
          }`}
        >
          {over ? t("expenses.metrics.overBudget") : t("expenses.metrics.left", { amount: formattedRemaining })}
        </span>
      </div>
      <div className="mt-auto pt-4 space-y-1.5">
        <div className="flex justify-between gap-2 text-xs text-on-surface-variant">
          <span className="truncate tabular-nums">
            {t("expenses.metrics.spentOfBudget", { current: formattedCurrentSpend, budget: formattedBudget })}
          </span>
          <span className="tabular-nums">{budgetPct.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${budgetPct >= 100 ? "bg-error" : budgetPct >= 80 ? "bg-amber-500" : "bg-primary"}`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
      </div>
    </CardWrapper>
  );
}
