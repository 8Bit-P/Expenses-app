import { useMemo } from "react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useInvestments } from "../../../hooks/useInvestments";
import type { PresetKey } from "../../../utils/filterPresets";
import { buildPreset } from "../../../utils/filterPresets";
import type { LedgerRow, DomainKey } from "../types";
import type { Transaction, Subscription } from "../../../types/expenses";
import type { AssetWithSnapshots } from "../../../types/investments";

export interface ChartBucket {
  date: string;
  /** formatted short label e.g. "Apr 3" */
  label: string;
  income: number;
  expenses: number;
  assets: number;
  /** total absolute value for the single-bar fallback */
  total: number;
}

interface UseLedgerDataProps {
  query: string;
  timeframe: PresetKey | "all" | "custom";
  activeDomains: Set<DomainKey>;
  minAmount: string;
  maxAmount: string;
  selectedCategoryId: string;
  customStartDate?: string;
  customEndDate?: string;
}

export function useLedgerData({
  query,
  timeframe,
  activeDomains,
  minAmount,
  maxAmount,
  selectedCategoryId,
  customStartDate,
  customEndDate,
}: UseLedgerDataProps) {
  // ── Compute date range from preset ──────────────────────────────────────────
  const dateRange = useMemo(() => {
    if (timeframe === "all") return { startDate: undefined, endDate: undefined };
    if (timeframe === "custom") return { startDate: customStartDate, endDate: customEndDate };
    return buildPreset(timeframe);
  }, [timeframe, customStartDate, customEndDate]);

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const { transactions, loading: txLoading } = useTransactions(
    {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      categoryId: selectedCategoryId || undefined,
      search: query || undefined,
      pageSize: 200,
    },
    false
  );

  const { subscriptions, loading: subLoading } = useSubscriptions();
  const { assets, isLoading: invLoading } = useInvestments();

  const loading = txLoading || subLoading || invLoading;

  // ── Build unified rows ──────────────────────────────────────────────────────
  const rows: LedgerRow[] = useMemo(() => {
    const items: LedgerRow[] = [];

    // Transactions (expenses + income)
    if (activeDomains.has("Transactions")) {
      transactions.forEach((tx: Transaction) => {
        items.push({
          id: tx.id,
          date: tx.date,
          emoji: tx.category?.emoji ?? null,
          categoryName: tx.category?.name ?? "Unknown",
          description: tx.description || "—",
          amount: tx.type === "expense" ? -Math.abs(tx.amount) : Math.abs(tx.amount),
          domain: "Transactions",
          raw: tx,
        });
      });
    }

    // Subscriptions
    if (activeDomains.has("Subscriptions")) {
      subscriptions.forEach((sub: Subscription) => {
        if (query && !sub.name.toLowerCase().includes(query.toLowerCase())) return;
        if (selectedCategoryId && sub.category_id !== selectedCategoryId) return;
        if (dateRange.startDate && sub.next_billing_date < dateRange.startDate) return;
        if (dateRange.endDate && sub.next_billing_date > dateRange.endDate) return;

        items.push({
          id: sub.id,
          date: sub.next_billing_date,
          emoji: sub.category?.emoji ?? "🔄",
          categoryName: sub.category?.name ?? "Recurring",
          description: sub.name,
          amount: -Math.abs(sub.amount),
          domain: "Subscriptions",
          raw: sub,
        });
      });
    }

    // Assets (latest snapshot per asset)
    if (activeDomains.has("Assets")) {
      assets.forEach((asset: AssetWithSnapshots) => {
        if (query && !asset.name.toLowerCase().includes(query.toLowerCase())) return;

        const latest = asset.asset_snapshots[0];
        if (!latest) return;

        if (dateRange.startDate && latest.date < dateRange.startDate) return;
        if (dateRange.endDate && latest.date > dateRange.endDate) return;

        items.push({
          id: asset.id,
          date: latest.date,
          emoji: "📈",
          categoryName: asset.type.charAt(0).toUpperCase() + asset.type.slice(1),
          description: asset.name,
          amount: Number(latest.total_value),
          domain: "Assets",
          raw: asset,
        });
      });
    }

    // Amount range filter (applied globally)
    const minVal = minAmount ? parseFloat(minAmount) : null;
    const maxVal = maxAmount ? parseFloat(maxAmount) : null;

    const filtered = items.filter((row) => {
      const absAmount = Math.abs(row.amount);
      if (minVal !== null && absAmount < minVal) return false;
      if (maxVal !== null && absAmount > maxVal) return false;
      return true;
    });

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return filtered;
  }, [
    transactions,
    subscriptions,
    assets,
    activeDomains,
    query,
    selectedCategoryId,
    dateRange,
    minAmount,
    maxAmount,
  ]);

  // ── Summary stats ───────────────────────────────────────────────────────────
  const totalSpent = useMemo(
    () => rows.filter((r) => r.amount < 0 && r.domain !== "Assets").reduce((sum, r) => sum + Math.abs(r.amount), 0),
    [rows]
  );
  const totalIncome = useMemo(
    () => rows.filter((r) => r.amount > 0 && r.domain === "Transactions").reduce((sum, r) => sum + r.amount, 0),
    [rows]
  );
  const netFlow = totalIncome - totalSpent;

  // ── Multi-bar chart data ─────────────────────────────────────────────────────
  const chartData: ChartBucket[] = useMemo(() => {
    // Group by date
    const byDate: Record<string, { income: number; expenses: number; assets: number }> = {};

    rows.forEach((r) => {
      if (!byDate[r.date]) byDate[r.date] = { income: 0, expenses: 0, assets: 0 };
      if (r.domain === "Assets") {
        byDate[r.date].assets += Math.abs(r.amount);
      } else if (r.amount > 0) {
        byDate[r.date].income += r.amount;
      } else {
        byDate[r.date].expenses += Math.abs(r.amount);
      }
    });

    const sorted = Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-20); // keep last 20 date buckets

    return sorted.map(([date, vals]) => {
      // Short label e.g. "Apr 3"
      const [y, m, d] = date.split("-").map(Number);
      const label = new Date(y, m - 1, d).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return {
        date,
        label,
        ...vals,
        total: vals.income + vals.expenses + vals.assets,
      };
    });
  }, [rows]);

  return {
    rows,
    loading,
    totalSpent,
    totalIncome,
    netFlow,
    chartData,
  };
}
