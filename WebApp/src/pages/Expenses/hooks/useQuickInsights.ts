import { useExpenses } from "../../../context/ExpensesContext";
import { usePeriodMetrics } from "./usePeriodMetrics";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCompactCurrency } from "../../../utils/currency";

export interface InsightItem {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  highlight?: "positive" | "negative" | "neutral";
}

export function useQuickInsights() {
  const { filters } = useExpenses();
  const m = usePeriodMetrics(filters.startDate, filters.endDate);
  const { monthlyBudget, currency } = useUserPreferences();

  const internalFmt = (n: number) => formatCompactCurrency(n, currency.code);

  const biggestMover = (() => {
    if (m.categoryBreakdown.length === 0) return null;
    const prevMap: Record<string, number> = {};
    m.prevCategoryBreakdown.forEach((c) => {
      prevMap[c.name] = c.amount;
    });

    let best: { name: string; emoji: string | null; deltaPct: number; direction: "up" | "down" } | null = null;
    for (const cat of m.categoryBreakdown) {
      const prev = prevMap[cat.name];
      if (!prev || prev === 0) continue;
      const delta = ((cat.amount - prev) / prev) * 100;
      if (!best || Math.abs(delta) > Math.abs(best.deltaPct)) {
        best = { name: cat.name, emoji: cat.emoji, deltaPct: delta, direction: delta > 0 ? "up" : "down" };
      }
    }
    return best;
  })();

  const netFlow = m.currentIncome - m.currentSpend;
  const burnDays = m.dailyAverage > 0 && m.currentIncome > 0 ? Math.floor(m.currentIncome / m.dailyAverage) : null;

  const insights: InsightItem[] = [
    // 1. Burn rate
    {
      icon: "local_fire_department",
      iconColor: m.isRunningHot ? "text-red-400 bg-red-400/10" : "text-green-500 bg-green-500/10",
      label: "Spend Pace",
      value: m.isRunningHot ? "Running Hot" : "On Track",
      sub: `${internalFmt(m.dailyAverage)}/day · ${m.daysElapsed} of ${m.totalPeriodDays} days elapsed`,
      highlight: m.isRunningHot ? "negative" : "positive",
    },
    // 2. Net cash flow
    {
      icon: netFlow >= 0 ? "savings" : "account_balance_wallet",
      iconColor: netFlow >= 0 ? "text-green-500 bg-green-500/10" : "text-red-400 bg-red-400/10",
      label: "Net Cash Flow",
      value: `${netFlow >= 0 ? "+" : ""}${internalFmt(netFlow)}`,
      sub: netFlow >= 0 ? `${m.savingsRate.toFixed(0)}% saved this period` : "Negative period flow",
      highlight: netFlow >= 0 ? "positive" : "negative",
    },
    // 3. Biggest category mover
    biggestMover
      ? {
          icon: biggestMover.direction === "up" ? "trending_up" : "trending_down",
          iconColor: biggestMover.direction === "up" ? "text-red-400 bg-red-400/10" : "text-green-500 bg-green-500/10",
          label: "Biggest Mover",
          value: `${biggestMover.emoji ?? ""} ${biggestMover.name}`,
          sub: `${biggestMover.direction === "up" ? "↑" : "↓"} ${Math.abs(biggestMover.deltaPct).toFixed(0)}% vs previous period`,
          highlight: biggestMover.direction === "up" ? "negative" : "positive",
        }
      : {
          icon: "bar_chart",
          iconColor: "text-on-surface-variant bg-surface-container",
          label: "Biggest Mover",
          value: "No comparison data",
          highlight: "neutral" as const,
        },
    // 4. Budget status or runway
    ...(monthlyBudget > 0
      ? [
          (() => {
            const budgetPct = Math.min(100, (m.currentSpend / monthlyBudget) * 100);
            const remaining = monthlyBudget - m.currentSpend;
            const over = m.currentSpend > monthlyBudget;
            return {
              icon: over ? "warning" : "account_balance",
              iconColor: over
                ? "text-red-400 bg-red-400/10"
                : budgetPct >= 80
                  ? "text-amber-400 bg-amber-400/10"
                  : "text-primary bg-primary/10",
              label: "Budget Status",
              value: over ? `Over by ${internalFmt(Math.abs(remaining))}` : `${internalFmt(remaining)} left`,
              sub: `${budgetPct.toFixed(0)}% of ${internalFmt(monthlyBudget)} budget used`,
              highlight: (over ? "negative" : budgetPct >= 80 ? "negative" : "positive") as
                | "positive"
                | "negative"
                | "neutral",
            };
          })(),
        ]
      : [
          burnDays !== null
            ? {
                icon: "calendar_month",
                iconColor: "text-primary bg-primary/10",
                label: "Income Covers",
                value: `${burnDays} days`,
                sub: `at current ${internalFmt(m.dailyAverage)}/day burn rate`,
                highlight: "neutral" as const,
              }
            : {
                icon: "receipt_long",
                iconColor: "text-primary bg-primary/10",
                label: "Transactions",
                value: `${m.categoryBreakdown.length} categories`,
                highlight: "neutral" as const,
              },
        ]),
  ];

  return {
    insights,
    loading: m.loading,
    filters,
  };
}
