import { useExpenses } from "../../../../context/ExpensesContext";
import { usePeriodMetrics } from "../../hooks/usePeriodMetrics";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { formatCompactCurrency } from "../../../../utils/currency";
import { cn } from "../../../../utils/cn";

import { SkeletonCard } from "./SkeletonCard";
import { SpendCard } from "./SpendCard";
import { ProjectedCard } from "./ProjectedCard";
import { TopCategoryCard } from "./CategoryCard";
import { BudgetCard } from "./BudgetCard";

// One bordered strip; `gap-px` over the outline colour draws the hairline separators.
// An odd last cell on the 2-col mobile grid spans the full row so no empty slot shows.
const STRIP =
  "grid gap-px bg-outline-variant border border-outline-variant rounded-2xl overflow-hidden [&>*:last-child:nth-child(odd)]:col-span-2";

export default function MetricsRow() {
  const { filters } = useExpenses();
  const m = usePeriodMetrics(filters.startDate, filters.endDate);
  const { monthlyBudget, currency } = useUserPreferences();

  const internalFmt = (n: number) => formatCompactCurrency(n, currency.code);

  const pacePct = m.pacePercent;
  const actualVsProjected = m.projectedSpend > 0 ? (m.currentSpend / m.projectedSpend) * 100 : 0;
  const spendRatio = m.totalPeriodDays > 0 ? ((m.currentSpend / (m.projectedSpend || 1)) * 100).toFixed(0) : "—";

  const now = new Date();
  const thisMonthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const thisMonthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const isThisMonth =
    (filters.startDate ?? thisMonthStart) === thisMonthStart && (filters.endDate ?? thisMonthEnd) === thisMonthEnd;

  const showBudget = isThisMonth && monthlyBudget > 0;

  const cols = showBudget
    ? "grid-cols-2 lg:grid-cols-4"
    : "grid-cols-2 md:grid-cols-3 md:[&>*:last-child:nth-child(odd)]:col-span-1";

  if (m.loading) {
    return (
      <div className={cn(STRIP, "grid-cols-2 md:grid-cols-3 md:[&>*:last-child:nth-child(odd)]:col-span-1")}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className={cn(STRIP, cols)}>
      <SpendCard
        amount={m.currentSpend}
        deltaPct={m.spendDeltaPct}
        pacePct={pacePct}
        actualVsProjected={actualVsProjected}
        spendRatio={spendRatio}
        formattedAmount={internalFmt(m.currentSpend)}
        isRunningHot={m.isRunningHot}
      />

      <ProjectedCard
        amount={m.projectedSpend}
        isRunningHot={m.isRunningHot}
        dailyAverage={m.dailyAverage}
        daysElapsed={m.daysElapsed}
        totalPeriodDays={m.totalPeriodDays}
        formattedAmount={internalFmt(m.projectedSpend)}
        formattedDailyAverage={internalFmt(m.dailyAverage)}
      />

      <TopCategoryCard
        category={m.topCategory}
        percent={m.topCategoryPercent}
        formattedAmount={m.topCategory ? internalFmt(m.topCategory.amount) : ""}
      />

      {showBudget && (
        <BudgetCard
          budget={monthlyBudget}
          currentSpend={m.currentSpend}
          formattedBudget={internalFmt(monthlyBudget)}
          formattedRemaining={internalFmt(monthlyBudget - m.currentSpend)}
          formattedCurrentSpend={internalFmt(m.currentSpend)}
        />
      )}
    </div>
  );
}
