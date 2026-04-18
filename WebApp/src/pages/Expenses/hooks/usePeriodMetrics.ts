import { useMemo } from "react";
import { parseISO, startOfMonth, endOfMonth, subDays, differenceInDays, format } from "date-fns";
import { useTransactions } from "../../../hooks/useTransactions";

export interface CategoryStat {
  name: string;
  emoji: string | null;
  amount: number;
}

export interface PeriodMetrics {
  // Totals
  currentSpend: number;
  currentIncome: number;
  savings: number;
  savingsRate: number;

  // Previous period comparison
  prevSpend: number;
  prevIncome: number;
  spendDeltaPct: number | null; // null when previous period has no data

  // Pacing / forecasting
  daysElapsed: number;
  totalPeriodDays: number;
  pacePercent: number; // % of the period that has elapsed
  dailyAverage: number;
  projectedSpend: number;
  isRunningHot: boolean; // projected exceeds previous period spend by >10%

  // Categories
  topCategory: CategoryStat | null;
  topCategoryPercent: number;
  categoryBreakdown: CategoryStat[];
  prevCategoryBreakdown: CategoryStat[];

  loading: boolean;
}

function buildCategoryBreakdown(transactions: any[]): CategoryStat[] {
  const map: Record<string, CategoryStat> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = t.category?.id ?? "uncategorized";
      if (!map[key]) {
        map[key] = { name: t.category?.name ?? "Uncategorized", emoji: t.category?.emoji ?? null, amount: 0 };
      }
      map[key].amount += t.amount;
    });
  return Object.values(map).sort((a, b) => b.amount - a.amount);
}

export function usePeriodMetrics(startDate?: string, endDate?: string): PeriodMetrics {
  const now = new Date();
  const currentStart = startDate ? parseISO(startDate) : startOfMonth(now);
  const currentEnd = endDate ? parseISO(endDate) : endOfMonth(now);

  const periodDays = differenceInDays(currentEnd, currentStart); // e.g. 29 for April
  const prevEnd = subDays(currentStart, 1);
  const prevStart = subDays(prevEnd, periodDays);

  const { transactions: currentTx, loading: l1 } = useTransactions({
    startDate: format(currentStart, "yyyy-MM-dd"),
    endDate: format(currentEnd, "yyyy-MM-dd"),
    pageSize: 1000,
  });

  const { transactions: prevTx, loading: l2 } = useTransactions({
    startDate: format(prevStart, "yyyy-MM-dd"),
    endDate: format(prevEnd, "yyyy-MM-dd"),
    pageSize: 1000,
  });

  const metrics = useMemo<Omit<PeriodMetrics, "loading">>(() => {
    // ── Current period ──
    const currentExpenses = currentTx.filter((t) => t.type === "expense");
    const currentSpend = currentExpenses.reduce((s, t) => s + t.amount, 0);
    const currentIncome = currentTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const savings = currentIncome - currentSpend;
    const savingsRate = currentIncome > 0 ? (savings / currentIncome) * 100 : 0;

    // ── Previous period ──
    const prevExpenses = prevTx.filter((t) => t.type === "expense");
    const prevSpend = prevExpenses.reduce((s, t) => s + t.amount, 0);
    const prevIncome = prevTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const spendDeltaPct = prevSpend > 0 ? ((currentSpend - prevSpend) / prevSpend) * 100 : null;

    // ── Pacing ──
    const clampedToday = now > currentEnd ? currentEnd : now < currentStart ? currentStart : now;
    const daysElapsed = Math.max(1, differenceInDays(clampedToday, currentStart) + 1);
    const totalPeriodDays = periodDays + 1;
    const pacePercent = (daysElapsed / totalPeriodDays) * 100;
    const dailyAverage = currentSpend / daysElapsed;
    const projectedSpend = dailyAverage * totalPeriodDays;
    const isRunningHot = prevSpend > 0 && projectedSpend > prevSpend * 1.1;

    // ── Categories ──
    const categoryBreakdown = buildCategoryBreakdown(currentTx);
    const prevCategoryBreakdown = buildCategoryBreakdown(prevTx);
    const topCategory = categoryBreakdown[0] ?? null;
    const topCategoryPercent = currentSpend > 0 && topCategory ? (topCategory.amount / currentSpend) * 100 : 0;

    return {
      currentSpend,
      currentIncome,
      savings,
      savingsRate,
      prevSpend,
      prevIncome,
      spendDeltaPct,
      daysElapsed,
      totalPeriodDays,
      pacePercent,
      dailyAverage,
      projectedSpend,
      isRunningHot,
      topCategory,
      topCategoryPercent,
      categoryBreakdown,
      prevCategoryBreakdown,
    };
  }, [currentTx, prevTx, periodDays, currentStart, currentEnd]);

  return { ...metrics, loading: l1 || l2 };
}
