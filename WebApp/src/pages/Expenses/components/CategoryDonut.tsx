import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useExpenses } from "../../../context/ExpensesContext";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency, formatCompactCurrency } from "../../../utils/currency";
import { CATEGORY_COLORS } from "../../../constants/chartColors";



export default function CategoryDonut() {
  const { currency } = useUserPreferences();
  const [isExpanded, setIsExpanded] = useState(false);
  // Read date + category filters from context, but fetch all (no pagination) for the chart
  const { filters } = useExpenses();
  const { transactions, loading } = useTransactions({
    startDate: filters.startDate,
    endDate: filters.endDate,
    categoryId: filters.categoryId,
    pageSize: 1000,
  });

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-105 flex items-center justify-center animate-pulse">
        <div className="w-40 h-40 rounded-full border-8 border-surface-container"></div>
      </div>
    );
  }

  // Aggregate spending by category, keeping emoji
  const categoryMap: Record<string, { name: string; emoji: string | null; value: number }> = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = t.category?.id || "uncategorized";
      const name = t.category?.name || "Uncategorized";
      const emoji = t.category?.emoji ?? null;
      if (!categoryMap[key]) {
        categoryMap[key] = { name, emoji, value: 0 };
      }
      categoryMap[key].value += t.amount;
    });

  const data = Object.values(categoryMap)
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const topPercent = data.length > 0 ? ((data[0].value / total) * 100).toFixed(0) : "0";

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-bold font-headline text-on-surface">Spending by Category</h4>
          {data.length > 0 && (
            <p className="text-xs font-medium text-on-surface-variant mt-0.5">
              {data[0].emoji} <span className="font-bold">{data[0].name}</span> leads at {topPercent}%
            </p>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3 min-h-75">
          <span className="material-symbols-outlined text-4xl">pie_chart_outline</span>
          <span className="text-xs font-bold uppercase tracking-widest">No data to display</span>
        </div>
      ) : (
        <>
          {/* Chart Area */}
          <div className="relative w-full shrink-0 min-w-0">
            <ResponsiveContainer width="100%" height={200} minWidth={1} minHeight={1} debounce={50}>
              <PieChart style={{ outline: "none" }} accessibilityLayer={false}>
                <Pie data={data} innerRadius={62} outerRadius={84} paddingAngle={2} dataKey="value" stroke="none">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 1000 }}
                  formatter={(value: any, name: any) => [formatCurrency(value as number, currency.code), name]}
                  contentStyle={{
                    backgroundColor: "var(--surface-container-lowest)",
                    borderColor: "var(--outline-variant)",
                    borderRadius: "10px",
                    color: "var(--on-surface)",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-on-surface">
                {formatCompactCurrency(total, currency.code)}
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Expenses</span>
            </div>
          </div>

          {/* Legend — custom scrollbar, emojis, percentage */}
          <style>{`
            .category-legend::-webkit-scrollbar { width: 4px; }
            .category-legend::-webkit-scrollbar-track { background: transparent; }
            .category-legend::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 9999px; }
            .category-legend::-webkit-scrollbar-thumb:hover { background: var(--on-surface-variant); }
          `}</style>

          <div className={`mt-4 category-legend overflow-y-auto pr-2 space-y-1.5 transition-all duration-300 ${isExpanded ? "max-h-80" : "max-h-45"}`}>
            {(isExpanded ? data : data.slice(0, 3)).map((item, index) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-surface-container-low/60 transition-colors group cursor-default"
                >
                  {/* Color dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: item.color }}
                  />

                  {/* Emoji + Name */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {item.emoji && <span className="text-base leading-none select-none">{item.emoji}</span>}
                    <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors truncate">
                      {item.name}
                    </span>
                  </div>

                  {/* Percentage + Amount */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-on-surface-variant/50 tabular-nums">{pct}%</span>
                    <span className="text-xs font-bold text-on-surface tabular-nums">
                      {formatCompactCurrency(item.value, currency.code)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {data.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 w-full py-2 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 hover:text-primary hover:bg-primary/5 rounded-xl transition-all group"
            >
              <span>{isExpanded ? "Show Less" : `View All (${data.length})`}</span>
              <span className={`material-symbols-outlined text-base transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
