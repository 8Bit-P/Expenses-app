import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      label: t("expenses.quickInsights.spendPace"),
      value: m.isRunningHot ? t("expenses.quickInsights.runningHot") : t("expenses.quickInsights.onTrack"),
      sub: t("expenses.quickInsights.burnRate", { amount: internalFmt(m.dailyAverage) }) + ` · ${t("expenses.quickInsights.daysElapsed", { elapsed: m.daysElapsed, total: m.totalPeriodDays })}`,
      highlight: m.isRunningHot ? "negative" : "positive",
    },
    // 2. Net cash flow
    {
      icon: netFlow >= 0 ? "savings" : "account_balance_wallet",
      iconColor: netFlow >= 0 ? "text-green-500 bg-green-500/10" : "text-red-400 bg-red-400/10",
      label: t("expenses.quickInsights.netCashFlow"),
      value: `${netFlow >= 0 ? "+" : ""}${internalFmt(netFlow)}`,
      sub: netFlow >= 0 ? t("expenses.quickInsights.savedThisPeriod", { percent: m.savingsRate.toFixed(0) }) : t("expenses.quickInsights.negativeFlow"),
      highlight: netFlow >= 0 ? "positive" : "negative",
    },
    // 3. Biggest category mover
    biggestMover
      ? {
          icon: biggestMover.direction === "up" ? "trending_up" : "trending_down",
          iconColor: biggestMover.direction === "up" ? "text-red-400 bg-red-400/10" : "text-green-500 bg-green-500/10",
          label: t("expenses.quickInsights.biggestMover"),
          value: `${biggestMover.emoji ?? ""} ${biggestMover.name}`,
          sub: t("expenses.quickInsights.vsPrevious", { 
            direction: biggestMover.direction === "up" ? "↑" : "↓", 
            percent: Math.abs(biggestMover.deltaPct).toFixed(0) 
          }),
          highlight: biggestMover.direction === "up" ? "negative" : "positive",
        }
      : {
          icon: "bar_chart",
          iconColor: "text-on-surface-variant bg-surface-container",
          label: t("expenses.quickInsights.biggestMover"),
          value: t("expenses.quickInsights.noComparison"),
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
              label: t("expenses.quickInsights.budgetStatus"),
              value: over ? t("expenses.quickInsights.overBy", { amount: internalFmt(Math.abs(remaining)) }) : t("expenses.quickInsights.left", { amount: internalFmt(remaining) }),
              sub: t("expenses.quickInsights.usedOfBudget", { percent: budgetPct.toFixed(0), amount: internalFmt(monthlyBudget) }),
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
                label: t("expenses.quickInsights.incomeCovers"),
                value: t("expenses.quickInsights.days", { count: burnDays }),
                sub: t("expenses.quickInsights.burnRate", { amount: internalFmt(m.dailyAverage) }),
                highlight: "neutral" as const,
              }
            : {
                icon: "receipt_long",
                iconColor: "text-primary bg-primary/10",
                label: t("expenses.quickInsights.transactions"),
                value: t("expenses.quickInsights.categories", { count: m.categoryBreakdown.length }),
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
