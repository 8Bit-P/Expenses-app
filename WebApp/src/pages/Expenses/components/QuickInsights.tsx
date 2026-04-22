import { useExpenses } from "../../../context/ExpensesContext";
import { usePeriodMetrics } from "../hooks/usePeriodMetrics";
import { formatDateLabel } from "../../../utils/dateFormatters";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCompactCurrency } from "../../../utils/currency";

interface InsightItem {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  highlight?: "positive" | "negative" | "neutral";
}

export default function QuickInsights() {
  const { filters } = useExpenses();
  const m = usePeriodMetrics(filters.startDate, filters.endDate);
  const { monthlyBudget, currency } = useUserPreferences();

  if (m.loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-surface-container shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-surface-container rounded-lg w-1/3" />
              <div className="h-4 bg-surface-container rounded-lg w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const internalFmt = (n: number) => formatCompactCurrency(n, currency.code);

  // Compute biggest category mover (vs previous period)
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
      sub: netFlow >= 0 ? `${m.savingsRate.toFixed(0)}% saved this period` : "Spending exceeds income",
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
    // 4. Income runway OR transaction count
    // 4. Budget status (if set) or income runway
    ...(monthlyBudget > 0
      ? [(() => {
          const budgetPct = Math.min(100, (m.currentSpend / monthlyBudget) * 100);
          const remaining = monthlyBudget - m.currentSpend;
          const over = m.currentSpend > monthlyBudget;
          return {
            icon: over ? "warning" : "account_balance",
            iconColor: over ? "text-red-400 bg-red-400/10" : budgetPct >= 80 ? "text-amber-400 bg-amber-400/10" : "text-primary bg-primary/10",
            label: "Budget Status",
            value: over ? `Over by ${internalFmt(Math.abs(remaining))}` : `${internalFmt(remaining)} left`,
            sub: `${budgetPct.toFixed(0)}% of ${internalFmt(monthlyBudget)} budget used`,
            highlight: (over ? "negative" : budgetPct >= 80 ? "negative" : "positive") as "positive" | "negative" | "neutral",
          };
        })()
      ]
      : [burnDays !== null
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
              value: `${m.categoryBreakdown.reduce((s, _) => s, 0)} movements`,
              highlight: "neutral" as const,
            },
      ]),
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-outline-variant/10 bg-surface-container-low/40">
        <h4 className="text-sm font-black uppercase tracking-[0.15em] text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
          Quick Insights
        </h4>
        <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
          {formatDateLabel(filters.startDate, filters.endDate)}
        </p>
      </div>

      {/* Insights list */}
      <div className="flex-1 divide-y divide-outline-variant/10">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-low/30 transition-colors"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${insight.iconColor}`}>
              <span className="material-symbols-outlined text-[18px]">{insight.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                {insight.label}
              </p>
              <p
                className={`text-sm font-black truncate mt-0.5 ${
                  insight.highlight === "positive"
                    ? "text-green-500"
                    : insight.highlight === "negative"
                      ? "text-red-400"
                      : "text-on-surface"
                }`}
              >
                {insight.value}
              </p>
              {insight.sub && (
                <p className="text-[11px] text-on-surface-variant/60 font-medium mt-0.5 truncate">{insight.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
