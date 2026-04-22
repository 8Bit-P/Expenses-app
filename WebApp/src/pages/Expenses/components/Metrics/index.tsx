import { useRef, useState, useEffect } from "react";
import { useExpenses } from "../../../../context/ExpensesContext";
import { usePeriodMetrics } from "../../hooks/usePeriodMetrics";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { formatCompactCurrency } from "../../../../utils/currency";

import { SkeletonCard } from "./SkeletonCard";
import { SpendCard } from "./SpendCard";
import { ProjectedCard } from "./ProjectedCard";
import { TopCategoryCard } from "./CategoryCard";
import { BudgetCard } from "./BudgetCard";

export default function MetricsRow() {
  const { filters } = useExpenses();
  const m = usePeriodMetrics(filters.startDate, filters.endDate);
  const { monthlyBudget, currency } = useUserPreferences();

  const internalFmt = (n: number) => formatCompactCurrency(n, currency.code);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    if (offsetWidth === 0) return;
    const index = Math.round(scrollLeft / offsetWidth);
    setActiveIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (m.loading) {
    return (
      <div className="grid grid-cols-1 w-full min-w-0">
        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 -mx-2 md:-mx-6 px-2 md:px-6 overflow-x-auto pb-4 sm:pb-0 snap-x hide-scrollbar">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <div className="w-1 shrink-0 sm:hidden"></div>
        </div>
      </div>
    );
  }

  const pacePct = m.pacePercent;
  const actualVsProjected = m.projectedSpend > 0 ? (m.currentSpend / m.projectedSpend) * 100 : 0;
  const spendRatio = m.totalPeriodDays > 0 ? ((m.currentSpend / (m.projectedSpend || 1)) * 100).toFixed(0) : "—";

  const now = new Date();
  const thisMonthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const thisMonthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const isThisMonth =
    (filters.startDate ?? thisMonthStart) === thisMonthStart && (filters.endDate ?? thisMonthEnd) === thisMonthEnd;

  const showBudget = isThisMonth && monthlyBudget > 0;

  return (
    <div className="grid grid-cols-1 w-full min-w-0">
      <div
        ref={scrollRef}
        className={`flex sm:grid gap-4 sm:gap-6 -mx-3 md:-mx-6 px-3 md:px-6 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory hide-scrollbar ${
          showBudget ? "sm:grid-cols-4" : "sm:grid-cols-3"
        }`}
      >
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

        {isThisMonth && monthlyBudget > 0 && (
          <BudgetCard
            budget={monthlyBudget}
            currentSpend={m.currentSpend}
            formattedBudget={internalFmt(monthlyBudget)}
            formattedRemaining={internalFmt(monthlyBudget - m.currentSpend)}
            formattedCurrentSpend={internalFmt(m.currentSpend)}
          />
        )}

        <div className="w-1 shrink-0 sm:hidden"></div>
      </div>

      {/* Pagination Dots (Dynamic) */}
      <div className="flex sm:hidden justify-center gap-1.5 mt-2 mb-4">
        {Array.from({ length: showBudget ? 4 : 3 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? "bg-primary w-3" : "bg-surface-container-high"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
