import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subDays, differenceInDays, parseISO } from "date-fns";
import { useMemo } from "react";
import { useExpenses } from "../../../context/ExpensesContext";
import { useTransactions } from "../../../hooks/useTransactions";
import { formatDateLabel } from "../../../utils/dateFormatters";

export default function SpendingTrendChart() {
  const { filters } = useExpenses();
  const now = new Date();

  // Resolve the "current" period from context filters, falling back to this month
  const currentStart = filters.startDate ? parseISO(filters.startDate) : startOfMonth(now);
  const currentEnd = filters.endDate ? parseISO(filters.endDate) : endOfMonth(now);

  // Compute the "previous" period as the same duration immediately before
  const periodDays = differenceInDays(currentEnd, currentStart); // inclusive handled in range
  const prevEnd = subDays(currentStart, 1);
  const prevStart = subDays(prevEnd, periodDays);

  const { transactions, loading } = useTransactions({
    startDate: format(prevStart, "yyyy-MM-dd"),
    endDate: format(currentEnd, "yyyy-MM-dd"),
    categoryId: filters.categoryId,
    // Always show expense trend (the chart is "Spending Trend")
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

      // Same index day in the previous period
      const prevDay = format(subDays(currentStart, periodDays - idx), "yyyy-MM-dd");

      cumulativeCurrent += transactions.filter((t) => t.date === fmtDay).reduce((s, t) => s + t.amount, 0);

      // Only accumulate previous if the prevDay is within its period
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

  // Build dynamic legend labels
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
        <div className="flex items-center gap-4 text-xs font-bold">
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
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3525cd" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3525cd" stopOpacity={0} />
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
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-on-surface-variant/60 font-semibold"
              tickFormatter={(v) => `$${v}`}
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

            <Area type="monotone" dataKey="previous" stroke="#c7c4d8" strokeWidth={2} fill="none" connectNulls />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#3525cd"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCurrent)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
