import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subDays, differenceInDays, parseISO } from "date-fns";
import { useMemo } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useExpenses } from "../../../context/ExpensesContext";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatDateLabel } from "../../../utils/dateFormatters";
import { formatCurrency } from "../../../utils/currency";

import { useTranslation } from "react-i18next";

export default function SpendingTrendChart() {
  const { t } = useTranslation();
  const { filters } = useExpenses();
  const { monthlyBudget, currency } = useUserPreferences();
  const now = new Date();

  // Mobile detection
  const isMobile = useIsMobile(640);

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
    const todayFmt = format(now, "yyyy-MM-dd");

    // PREDICTION MATH: Calculate Average Daily Spend for current month
    let totalSpendToDate = 0;
    let daysPassed = 0;
    
    if (isThisMonth) {
      const currentPeriodTxs = transactions.filter(
        (t) => t.date >= format(currentStart, "yyyy-MM-dd") && t.date <= todayFmt
      );
      totalSpendToDate = currentPeriodTxs.reduce((sum, t) => sum + t.amount, 0);
      daysPassed = differenceInDays(now, currentStart) + 1;
    }
    const avgDailySpend = daysPassed > 0 ? totalSpendToDate / daysPassed : 0;

    let cumulativeCurrent = 0;
    let cumulativePrevious = 0;

    return days.map((day, idx) => {
      const fmtDay = format(day, "yyyy-MM-dd");
      const prevDay = format(subDays(currentStart, periodDays - idx), "yyyy-MM-dd");

      cumulativeCurrent += transactions.filter((t) => t.date === fmtDay).reduce((s, t) => s + t.amount, 0);

      if (new Date(prevDay) >= prevStart) {
        cumulativePrevious += transactions.filter((t) => t.date === prevDay).reduce((s, t) => s + t.amount, 0);
      }

      // PREDICTION LOGIC: Anchor on today, project to the future
      let predictionValue = null;
      if (isThisMonth) {
        if (fmtDay === todayFmt) {
          // Anchor point: Connects seamlessly to the end of the solid line
          predictionValue = cumulativeCurrent;
        } else if (day > now) {
          // Extrapolate future days based on average run rate
          const futureDays = differenceInDays(day, now);
          predictionValue = totalSpendToDate + avgDailySpend * futureDays;
        }
      }

      return {
        label: format(day, "d MMM"),
        current: day <= now ? cumulativeCurrent : null,
        previous: cumulativePrevious,
        prediction: predictionValue,
      };
    });
  }, [transactions, loading, currentStart, currentEnd, periodDays, prevStart, now]);

  const currentLabel = formatDateLabel(format(currentStart, "yyyy-MM-dd"), format(currentEnd, "yyyy-MM-dd"));
  const previousLabel = formatDateLabel(format(prevStart, "yyyy-MM-dd"), format(prevEnd, "yyyy-MM-dd"));

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-95 flex items-center justify-center animate-pulse">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/40">
          {t("expenses.charts.spendingTrend.calculating")}
        </span>
      </div>
    );
  }

  const validCurrents = chartData.map((d) => d.current).filter((v) => v !== null) as number[];
  const validPredictions = chartData.map((d) => d.prediction).filter((v) => v !== null) as number[];
  
  const maxCurrent = validCurrents.length > 0 ? Math.max(...validCurrents) : 0;
  const maxPrediction = validPredictions.length > 0 ? Math.max(...validPredictions) : 0;
  const minCurrent = validCurrents.length > 0 ? Math.min(...validCurrents) : 0;

  const maxPrevious = Math.max(0, ...chartData.map((d) => d.previous || 0));
  
  // Ensure the chart scales high enough to fit the prediction line if it exceeds current spend
  const maxAmount = Math.max(maxCurrent, maxPrevious, maxPrediction);

  // Ensure the budget line is always visible inside the chart — pad domain above it
  const chartMaxNum = showBudget
    ? Math.max(maxAmount, monthlyBudget) * 1.05
    : maxAmount > 0
      ? maxAmount * 1.05
      : 100;
  const chartMax = chartMaxNum;

  const fillThresholdPct =
    showBudget && maxCurrent > 0 ? Math.max(0, Math.min(100, ((maxCurrent - monthlyBudget) / maxCurrent) * 100)) : 0;

  const strokeThresholdPct =
    showBudget && maxCurrent > minCurrent
      ? Math.max(0, Math.min(100, ((maxCurrent - monthlyBudget) / (maxCurrent - minCurrent)) * 100))
      : 0;

  const hasOverrun = showBudget && maxCurrent > monthlyBudget;

  // Colors
  const overColor = "var(--error)";
  const safeColor = "var(--primary)";

  const LegendItems = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-4 text-xs font-bold flex-wrap ${className}`}>
      {showBudget && (
        <div className="flex items-center gap-1.5">
          <svg width="18" height="8" viewBox="0 0 18 8">
            <line
              x1="0"
              y1="4"
              x2="18"
              y2="4"
              stroke={overColor}
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-on-surface-variant">{t("expenses.charts.spendingTrend.budget")}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="text-on-surface">{currentLabel}</span>
      </div>
      {isThisMonth && (
        <div className="flex items-center gap-1.5">
          <svg width="18" height="4" viewBox="0 0 18 4">
             <line x1="0" y1="2" x2="18" y2="2" stroke={safeColor} strokeWidth="2" strokeDasharray="3 3" opacity={0.6} />
          </svg>
          <span className="text-on-surface-variant">{t("expenses.charts.spendingTrend.predicted")}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
        <span className="text-on-surface-variant">{previousLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="text-lg font-bold font-headline text-on-surface">
            {t("expenses.charts.spendingTrend.title")}
          </h4>
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">
            {t("expenses.charts.spendingTrend.subtitle")}
          </p>
        </div>

        {/* Legend - Hidden on mobile header, shown on desktop header */}
        <LegendItems className="hidden sm:flex justify-end" />
      </div>

      {/* Chart */}
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height={isMobile ? 320 : 380} minWidth={0} minHeight={0} debounce={50}>
          <AreaChart
            data={chartData}
            margin={isMobile ? { top: 10, right: 10, left: -40, bottom: 0 } : { top: 10, right: 60, left: -20, bottom: 0 }}
            style={{ outline: "none" }}
            accessibilityLayer={false}
          >
            <defs>
              {/* Fill gradient — red above budget threshold, primary below */}
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                {hasOverrun ? (
                  <>
                    <stop offset="0%" stopColor={overColor} stopOpacity={0.35} />
                    <stop offset={`${fillThresholdPct}%`} stopColor={overColor} stopOpacity={0.15} />
                    <stop offset={`${fillThresholdPct}%`} stopColor={safeColor} stopOpacity={0.35} />
                  </>
                ) : (
                  <stop offset="0%" stopColor={safeColor} stopOpacity={0.35} />
                )}
                <stop offset="95%" stopColor={safeColor} stopOpacity={0.03} />
              </linearGradient>

              {/* Stroke gradient — same logic */}
              <linearGradient id="strokeCurrent" x1="0" y1="0" x2="0" y2="1">
                {hasOverrun ? (
                  <>
                    <stop offset="0%" stopColor={overColor} stopOpacity={1} />
                    <stop offset={`${strokeThresholdPct}%`} stopColor={overColor} stopOpacity={1} />
                    <stop offset={`${strokeThresholdPct}%`} stopColor={safeColor} stopOpacity={1} />
                  </>
                ) : (
                  <stop offset="0%" stopColor={safeColor} stopOpacity={1} />
                )}
                <stop offset="100%" stopColor={safeColor} stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-outline-variant/20" />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "currentColor" }}
              className="text-on-surface-variant/60 font-semibold"
              dy={10}
              interval={
                isMobile
                  ? Math.max(0, Math.floor(chartData.length / 4) - 1)
                  : Math.max(0, Math.floor(chartData.length / 6) - 1)
              }
            />
            <YAxis
              hide={isMobile}
              domain={[0, chartMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-on-surface-variant/60 font-semibold"
              tickFormatter={(v) => formatCurrency(v, currency.code, { notation: "compact", maximumFractionDigits: 0 })}
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
              cursor={{ stroke: "var(--outline)", strokeWidth: 1.5, strokeDasharray: "4 4" }}
              itemStyle={{ color: "var(--on-surface)" }}
              formatter={(value: any, name: any) => {
                if (value == null) return ["—", name];
                const formatted = formatCurrency(value as number, currency.code);
                if (name === "current") return [formatted, currentLabel];
                if (name === "previous") return [formatted, previousLabel];
                if (name === "prediction") return [formatted, t("expenses.charts.spendingTrend.predictionTooltip")];
                return [formatted, name];
              }}
            />

            {showBudget && (
              <ReferenceLine y={monthlyBudget} stroke={overColor} strokeWidth={1.5} strokeDasharray="4 4" strokeOpacity={0.8} />
            )}

            <Area type="monotone" dataKey="previous" stroke="var(--outline-variant)" strokeWidth={2} fill="none" connectNulls />
            
            {/* The new dashed prediction line overlay */}
            <Area 
              type="monotone" 
              dataKey="prediction" 
              stroke={safeColor} 
              strokeOpacity={0.5} 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              fill="none" 
            />
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

      {/* Legend - Shown only on mobile below chart */}
      <LegendItems className="mt-4 sm:hidden justify-center border-t border-outline-variant/10 pt-4" />
    </div>
  );
}
