import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subDays, differenceInDays, parseISO } from "date-fns";
import { useMemo } from "react";
import { useExpenses } from "../../../context/ExpensesContext";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatDateLabel } from "../../../utils/dateFormatters";

export default function SpendingTrendChart() {
  const { filters } = useExpenses();
  const { monthlyBudget } = useUserPreferences();
  const now = new Date();

  // Resolve the "current" period from context filters, falling back to this month
  const currentStart = filters.startDate ? parseISO(filters.startDate) : startOfMonth(now);
  const currentEnd = filters.endDate ? parseISO(filters.endDate) : endOfMonth(now);

  // Check if the selected period is exactly "this month" — compare date strings
  const thisMonthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const thisMonthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const isThisMonth =
    (filters.startDate ?? thisMonthStart) === thisMonthStart &&
    (filters.endDate ?? thisMonthEnd) === thisMonthEnd;

  const showBudget = isThisMonth && monthlyBudget > 0;

  const periodDays = differenceInDays(currentEnd, currentStart);
  const prevEnd = subDays(currentStart, 1);
  const prevStart = subDays(prevEnd, periodDays);

  const { transactions, loading } = useTransactions({
    startDate: format(prevStart, "yyyy-MM-dd"),
    endDate: format(currentEnd, "yyyy-MM-dd"),
    categoryId: filters.categoryId,
    type: "expense",
    pageSize: 1000,
  });

  const chartData = useMemo(() => {
    if (loading) return [];

    const days = eachDayOfInterval({ start: currentStart, end: currentEnd });
    let cumulativeCurrent = 0;
    let cumulativePrevious = 0;

    return days.map((day, idx) => {
      const fmtDay = format(day, "yyyy-MM-dd");
      const prevDay = format(subDays(currentStart, periodDays - idx), "yyyy-MM-dd");

      cumulativeCurrent += transactions.filter((t) => t.date === fmtDay).reduce((s, t) => s + t.amount, 0);

      if (new Date(prevDay) >= prevStart) {
        cumulativePrevious += transactions.filter((t) => t.date === prevDay).reduce((s, t) => s + t.amount, 0);
      }

      return {
        label: format(day, "d MMM"),
        current: day <= now ? cumulativeCurrent : null,
        previous: cumulativePrevious,
      };
    });
  }, [transactions, loading, currentStart, currentEnd, periodDays, prevStart, now]);

  const currentLabel = formatDateLabel(format(currentStart, "yyyy-MM-dd"), format(currentEnd, "yyyy-MM-dd"));
  const previousLabel = formatDateLabel(format(prevStart, "yyyy-MM-dd"), format(prevEnd, "yyyy-MM-dd"));

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-95 flex items-center justify-center animate-pulse">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/40">
          Calculating Trends…
        </span>
      </div>
    );
  }

  const maxCurrent = Math.max(0, ...chartData.map((d) => d.current || 0));
  const maxPrevious = Math.max(0, ...chartData.map((d) => d.previous || 0));
  const maxAmount = Math.max(maxCurrent, maxPrevious);

  // Ensure the budget line is always visible inside the chart — pad domain above it
  const chartMaxNum = showBudget
    ? Math.max(maxAmount, monthlyBudget) * 1.12
    : maxAmount > 0 ? maxAmount * 1.08 : 100;
  const chartMax = chartMaxNum;

  /**
   * Y-axis gradient math:
   * SVG y=0 is the TOP, y=1 is the BOTTOM of the linearGradient.
   * A data value V sits at vertical offset: (1 - V / chartMax) from the top.
   * So the budget threshold lives at offset = (1 - budget / chartMax) * 100 %.
   * Above that offset (smaller %) → over budget → red.
   * Below that offset (larger %) → under budget → primary.
   */
  const budgetThresholdPct = showBudget
    ? Math.max(0, Math.min(99, (1 - monthlyBudget / chartMax) * 100))
    : 0;
  const hasOverrun = showBudget && maxCurrent > monthlyBudget;

  // Colors
  const overColor = "#f87171";   // red-400 — visible on both light/dark
  const safeColor = "var(--primary)";

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-bold font-headline text-on-surface">Spending Trend</h4>
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">
            Cumulative spend — current vs previous period
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold flex-wrap justify-end">
          {showBudget && (
            <div className="flex items-center gap-1.5">
              <svg width="18" height="8" viewBox="0 0 18 8">
                <line
                  x1="0" y1="4" x2="18" y2="4"
                  stroke={overColor} strokeWidth="2"
                  strokeDasharray="4 3" strokeLinecap="round"
                />
              </svg>
              <span className="text-on-surface-variant">Budget</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-on-surface">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="text-on-surface-variant">{previousLabel}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
          <AreaChart data={chartData} margin={{ top: 10, right: 60, left: -20, bottom: 0 }}>
            <defs>
              {/* Fill gradient — red above budget threshold, primary below */}
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                {hasOverrun ? (
                  <>
                    <stop offset={`${budgetThresholdPct}%`} stopColor={overColor} stopOpacity={0.25} />
                    <stop offset={`${budgetThresholdPct}%`} stopColor={safeColor} stopOpacity={0.28} />
                  </>
                ) : (
                  <stop offset="0%" stopColor={safeColor} stopOpacity={0.28} />
                )}
                <stop offset="95%" stopColor={safeColor} stopOpacity={0.03} />
              </linearGradient>

              {/* Stroke gradient — same logic */}
              <linearGradient id="strokeCurrent" x1="0" y1="0" x2="0" y2="1">
                {hasOverrun ? (
                  <>
                    <stop offset={`${budgetThresholdPct}%`} stopColor={overColor} stopOpacity={1} />
                    <stop offset={`${budgetThresholdPct}%`} stopColor={safeColor} stopOpacity={1} />
                  </>
                ) : (
                  <stop offset="0%" stopColor={safeColor} stopOpacity={1} />
                )}
                <stop offset="100%" stopColor={safeColor} stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-outline-variant/20"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "currentColor" }}
              className="text-on-surface-variant/60 font-semibold"
              dy={10}
              interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
            />
            <YAxis
              domain={[0, chartMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-on-surface-variant/60 font-semibold"
              tickFormatter={(v) => `$${typeof v === "number" ? v.toFixed(0) : v}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-container-lowest)",
                borderColor: "var(--outline-variant)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: "var(--on-surface)",
                fontWeight: "bold",
                fontSize: "12px",
              }}
              itemStyle={{ color: "var(--on-surface)" }}
              formatter={(value: any, name: string) => [
                value != null ? `$${(value as number).toFixed(2)}` : "—",
                name === "current" ? currentLabel : previousLabel,
              ]}
            />

            {showBudget && (
              <ReferenceLine
                y={monthlyBudget}
                stroke={overColor}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                strokeOpacity={0.8}
                label={{
                  value: `$${monthlyBudget.toLocaleString()}`,
                  position: "right",
                  fontSize: 10,
                  fontWeight: 700,
                  fill: overColor,
                  opacity: 0.9,
                }}
              />
            )}

            <Area type="monotone" dataKey="previous" stroke="var(--outline-variant)" strokeWidth={2} fill="none" connectNulls />
            <Area
              type="monotone"
              dataKey="current"
              stroke="url(#strokeCurrent)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#fillCurrent)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
