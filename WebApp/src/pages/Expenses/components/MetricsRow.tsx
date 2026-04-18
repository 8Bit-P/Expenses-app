import { useExpenses } from "../../../context/ExpensesContext";
import { useTransactions } from "../../../hooks/useTransactions";

export default function MetricsRow() {
  const { filters } = useExpenses();

  // Only filter by date range — type/category/search filters affect the list
  // but shouldn't skew the headline metrics.
  const { transactions, loading } = useTransactions({
    startDate: filters.startDate,
    endDate:   filters.endDate,
    pageSize:  1000,
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl h-32 border border-outline-variant/10" />
        ))}
      </div>
    );
  }

  const totalSpend = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalSpend;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  // Top category by spend
  const categorySpend: Record<string, { name: string; emoji: string | null; amount: number }> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = t.category?.id || "uncategorized";
      if (!categorySpend[key]) {
        categorySpend[key] = {
          name: t.category?.name || "Uncategorized",
          emoji: t.category?.emoji || null,
          amount: 0,
        };
      }
      categorySpend[key].amount += t.amount;
    });

  const sortedCategories = Object.values(categorySpend).sort((a, b) => b.amount - a.amount);
  const topCategory = sortedCategories[0] || { name: "None", emoji: null, amount: 0 };
  const topCategoryPercent = totalSpend > 0 ? (topCategory.amount / totalSpend) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

      {/* Metric 1: Total Spend */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">payments</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Spend</span>
        </div>
        <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">
          ${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <p className="text-xs font-bold text-on-surface-variant mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">calendar_month</span>
          Across all time
        </p>
      </div>

      {/* Metric 2: Savings Rate */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">savings</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Savings Rate</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">
            {savingsRate.toFixed(1)}%
          </h2>
          <span className={`text-sm font-bold tracking-tight ${savings >= 0 ? "text-green-500" : "text-error"}`}>
            {savings >= 0 ? "+" : ""}${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
        <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${savings >= 0 ? "text-green-500" : "text-error"}`}>
          <span className="material-symbols-outlined text-[14px]">
            {savings >= 0 ? "trending_up" : "trending_down"}
          </span>
          {savings >= 0 ? "Wealth growing" : "Spending exceeds income"}
        </p>
      </div>

      {/* Metric 3: Top Category */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">pie_chart</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Top Category</span>
        </div>
        <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight truncate flex items-center gap-2">
          {topCategory.emoji && <span>{topCategory.emoji}</span>}
          <span>{topCategory.name}</span>
        </h2>
        <p className="text-xs font-bold text-on-surface-variant mt-2 flex items-center gap-1">
          ${topCategory.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          <span className="opacity-50">·</span>
          {topCategoryPercent.toFixed(0)}% of spend
        </p>
      </div>

    </div>
  );
}
