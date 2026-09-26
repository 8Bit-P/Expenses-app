import { useMemo } from "react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useInvestments } from "../../../hooks/useInvestments";
import type { PresetKey } from "../../../utils/filterPresets";
import { buildPreset } from "../../../utils/filterPresets";
import type { LedgerRow, DomainKey } from "../types";
import type { Transaction, Subscription, TransactionType } from "../../../types/expenses";
import type { AssetWithSnapshots } from "../../../types/investments";

export interface CategorySlice {
  name: string;
  emoji: string | null;
  value: number;
  percentage: number;
}

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
  selectedCategoryIds: string[];
  selectedTypes: TransactionType[];
  selectedAccountIds: string[];
  sortColumn: "date" | "amount";
  sortDirection: "asc" | "desc";
  customStartDate?: string;
  customEndDate?: string;
}

export function useLedgerData({
  query,
  timeframe,
  activeDomains,
  minAmount,
  maxAmount,
  selectedCategoryIds,
  selectedTypes,
  selectedAccountIds,
  sortColumn,
  sortDirection,
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
      categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      accountIds: selectedAccountIds.length > 0 ? selectedAccountIds : undefined,
      search: query || undefined,
      pageSize: 1000,
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
        if (selectedCategoryIds.length > 0 && !selectedCategoryIds.includes(sub.category_id)) return;
        // Subscriptions are generally expenses
        if (selectedTypes.length > 0 && !selectedTypes.includes("expense")) return;
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
        
        // Assets are effectively "income"/wealth growth conceptually, but standard filter might ignore them.
        // If types are filtered and "income" isn't selected, skip them
        if (selectedTypes.length > 0 && !selectedTypes.includes("income")) return;
        
        // Category filtering: Assets don't have categories in the same way, 
        // but if the user explicitly selects categories, they probably want ONLY those transactions.
        if (selectedCategoryIds.length > 0) return;


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

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortColumn === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = Math.abs(a.amount) - Math.abs(b.amount);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  }, [
    transactions,
    subscriptions,
    assets,
    activeDomains,
    query,
    selectedCategoryIds,
    selectedTypes,
    sortColumn,
    sortDirection,
    dateRange,
    minAmount,
    maxAmount,
  ]);

  // ── Summary stats ───────────────────────────────────────────────────────────
  const totalSpent = useMemo(
    () => rows.filter((r) => r.amount < 0 && r.domain === "Transactions").reduce((sum, r) => sum + Math.abs(r.amount), 0),
    [rows]
  );
  const totalIncome = useMemo(
    () => rows.filter((r) => r.amount > 0 && r.domain === "Transactions").reduce((sum, r) => sum + r.amount, 0),
    [rows]
  );
  const netFlow = totalIncome - totalSpent;

  // ── Multi-bar chart data ─────────────────────────────────────────────────────
  const chartData: ChartBucket[] = useMemo(() => {
    if (rows.length === 0) return [];

    // Determine the span of the data to pick a bucket granularity
    const dates = rows.map((r) => r.date).sort();
    const earliest = new Date(dates[0]);
    const latest = new Date(dates[dates.length - 1]);
    const spanDays = Math.max(1, Math.round((latest.getTime() - earliest.getTime()) / 86_400_000) + 1);

    // Choose bucket key function & label formatter based on span
    let bucketKey: (dateStr: string) => string;
    let bucketLabel: (key: string) => string;

    if (spanDays <= 31) {
      // Daily buckets
      bucketKey = (d) => d; // "2026-09-15"
      bucketLabel = (key) => {
        const [y, m, d] = key.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      };
    } else if (spanDays <= 90) {
      // Weekly buckets (ISO week start = Monday)
      bucketKey = (d) => {
        const dt = new Date(d);
        const day = dt.getDay();
        const monday = new Date(dt);
        monday.setDate(dt.getDate() - ((day + 6) % 7));
        return monday.toISOString().slice(0, 10);
      };
      bucketLabel = (key) => {
        const [y, m, d] = key.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      };
    } else {
      // Monthly buckets
      bucketKey = (d) => d.slice(0, 7); // "2026-09"
      bucketLabel = (key) => {
        const [y, m] = key.split("-").map(Number);
        return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: "short", year: "2-digit" });
      };
    }

    // Aggregate into buckets
    const byBucket: Record<string, { income: number; expenses: number; assets: number }> = {};

    rows.forEach((r) => {
      const key = bucketKey(r.date);
      if (!byBucket[key]) byBucket[key] = { income: 0, expenses: 0, assets: 0 };
      if (r.domain === "Assets") {
        byBucket[key].assets += Math.abs(r.amount);
      } else if (r.amount > 0) {
        byBucket[key].income += r.amount;
      } else {
        byBucket[key].expenses += Math.abs(r.amount);
      }
    });

    return Object.entries(byBucket)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, vals]) => ({
        date: key,
        label: bucketLabel(key),
        ...vals,
        total: vals.income + vals.expenses + vals.assets,
      }));
  }, [rows]);

  // ── Category breakdown (expenses only) ──────────────────────────────────────
  const categoryBreakdown: CategorySlice[] = useMemo(() => {
    const byCategory: Record<string, { name: string; emoji: string | null; value: number }> = {};

    rows.forEach((r) => {
      if (r.amount >= 0 || r.domain !== "Transactions") return; // transaction expenses only
      const key = r.categoryName;
      if (!byCategory[key]) {
        byCategory[key] = { name: r.categoryName, emoji: r.emoji, value: 0 };
      }
      byCategory[key].value += Math.abs(r.amount);
    });

    const total = Object.values(byCategory).reduce((sum, c) => sum + c.value, 0);

    return Object.values(byCategory)
      .sort((a, b) => b.value - a.value)
      .map((c) => ({
        ...c,
        percentage: total > 0 ? Math.round((c.value / total) * 100) : 0,
      }));
  }, [rows]);

  return {
    rows,
    loading,
    totalSpent,
    totalIncome,
    netFlow,
    chartData,
    categoryBreakdown,
  };
}
