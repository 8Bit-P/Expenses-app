import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subDays, differenceInDays, parseISO } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useExpenses } from "../../../context/ExpensesContext";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatDateLabel } from "../../../utils/dateFormatters";
import { formatCurrency } from "../../../utils/currency";
import { CHART, AXIS_TICK } from "../../../constants/chartColors";
import Panel from "../../../components/ui/Panel";
import { cn } from "../../../utils/cn";

interface TrendTooltipProps {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number | null }[];
  label?: string;
  resolveName: (key: string) => string;
  resolveColor: (key: string) => string;
  currencyCode: string;
}

const TrendTooltip = ({ active, payload, label, resolveName, resolveColor, currencyCode }: TrendTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs min-w-[160px]">
      <p className="eyebrow mb-1">{label}</p>
      <div className="space-y-0.5">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: resolveColor(String(entry.dataKey)) }}
              />
              <span className="text-on-surface-variant truncate">{resolveName(String(entry.dataKey))}</span>
            </div>
            <span className="font-medium text-on-surface tabular-nums">
              {entry.value == null ? "—" : formatCurrency(entry.value, currencyCode)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LegendItemsProps {
  className?: string;
  currentLabel: string;
  previousLabel: string;
  isThisMonth: boolean;
  showBudget: boolean;
}

function LegendItems({ className = "", currentLabel, previousLabel, isThisMonth, showBudget }: LegendItemsProps) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex items-center gap-x-4 gap-y-1.5 text-xs text-on-surface-variant flex-wrap", className)}>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-0.5 rounded-full bg-primary" />
        <span className="text-on-surface">{currentLabel}</span>
      </div>
      {isThisMonth && (
        <div className="flex items-center gap-1.5">
          <svg width="14" height="4" viewBox="0 0 14 4" aria-hidden>
            <line
              x1="0"
              y1="2"
              x2="14"
              y2="2"
              stroke={CHART.primary}
              strokeWidth="2"
              strokeDasharray="3 2"
              opacity={0.6}
            />
          </svg>
          <span>{t("expenses.charts.spendingTrend.predicted")}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-0.5 rounded-full bg-outline" />
        <span>{previousLabel}</span>
      </div>
      {showBudget && (
        <div className="flex items-center gap-1.5">
          <svg width="14" height="4" viewBox="0 0 14 4" aria-hidden>
            <line x1="0" y1="2" x2="14" y2="2" stroke={CHART.expense} strokeWidth="1.5" strokeDasharray="3 2" />
          </svg>
          <span>{t("expenses.charts.spendingTrend.budget")}</span>
        </div>
      )}
    </div>
  );
}

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
    (filters.startDate ?? thisMonthStart) === thisMonthStart && (filters.endDate ?? thisMonthEnd) === thisMonthEnd;

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
        (t) => t.date >= format(currentStart, "yyyy-MM-dd") && t.date <= todayFmt,
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
      <Panel className="h-full min-h-95" bodyClassName="flex items-center justify-center">
        <span className="text-sm text-on-surface-variant animate-pulse">
          {t("expenses.charts.spendingTrend.calculating")}
        </span>
      </Panel>
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
  const chartMaxNum = showBudget ? Math.max(maxAmount, monthlyBudget) * 1.05 : maxAmount > 0 ? maxAmount * 1.05 : 100;
  const chartMax = chartMaxNum;

  const fillThresholdPct =
    showBudget && maxCurrent > 0 ? Math.max(0, Math.min(100, ((maxCurrent - monthlyBudget) / maxCurrent) * 100)) : 0;

  const strokeThresholdPct =
    showBudget && maxCurrent > minCurrent
      ? Math.max(0, Math.min(100, ((maxCurrent - monthlyBudget) / (maxCurrent - minCurrent)) * 100))
      : 0;

  const hasOverrun = showBudget && maxCurrent > monthlyBudget;

  // Colors (theme-aware CSS variables)
  const overColor = CHART.expense;
  const safeColor = CHART.primary;
  const previousColor = CHART.axis;

  const resolveName = (key: string) => {
    if (key === "current") return currentLabel;
    if (key === "previous") return previousLabel;
    if (key === "prediction") return t("expenses.charts.spendingTrend.predictionTooltip");
    return key;
  };

  const resolveColor = (key: string) => (key === "previous" ? previousColor : safeColor);

  return (
    <Panel
      className="h-full"
      title={t("expenses.charts.spendingTrend.title")}
      subtitle={t("expenses.charts.spendingTrend.subtitle")}
      actions={
        <LegendItems
          className="hidden sm:flex justify-end max-w-[360px]"
          currentLabel={currentLabel}
          previousLabel={previousLabel}
          isThisMonth={isThisMonth}
          showBudget={showBudget}
        />
      }
      bodyClassName="flex flex-col"
    >
      {/* Chart */}
      <div className="w-full flex-1 -ml-1">
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 340} minWidth={0} minHeight={0} debounce={50}>
          <AreaChart
            data={chartData}
            margin={isMobile ? { top: 8, right: 8, left: 8, bottom: 0 } : { top: 8, right: 12, left: 0, bottom: 0 }}
            style={{ outline: "none" }}
            accessibilityLayer={false}
          >
            <defs>
              {/* Faint fill — error tint above budget threshold, ink/accent below */}
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                {hasOverrun ? (
                  <>
                    <stop offset="0%" stopColor={overColor} stopOpacity={0.12} />
                    <stop offset={`${fillThresholdPct}%`} stopColor={overColor} stopOpacity={0.06} />
                    <stop offset={`${fillThresholdPct}%`} stopColor={safeColor} stopOpacity={0.1} />
                  </>
                ) : (
                  <stop offset="0%" stopColor={safeColor} stopOpacity={0.12} />
                )}
                <stop offset="100%" stopColor={safeColor} stopOpacity={0} />
              </linearGradient>

              {/* Stroke split — line turns red where cumulative spend exceeds the budget */}
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

            <CartesianGrid vertical={false} stroke={CHART.grid} strokeDasharray="0" />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              dy={8}
              minTickGap={12}
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
              width={56}
              tick={AXIS_TICK}
              tickFormatter={(v) => formatCurrency(v, currency.code, { notation: "compact", maximumFractionDigits: 0 })}
            />

            <Tooltip
              isAnimationActive={false}
              cursor={{ stroke: CHART.axis, strokeWidth: 1 }}
              content={
                <TrendTooltip resolveName={resolveName} resolveColor={resolveColor} currencyCode={currency.code} />
              }
            />

            {showBudget && (
              <ReferenceLine
                y={monthlyBudget}
                stroke={overColor}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                strokeOpacity={0.8}
              />
            )}

            <Area
              type="monotone"
              dataKey="previous"
              stroke={previousColor}
              strokeWidth={2}
              strokeOpacity={0.6}
              fill="none"
              connectNulls
            />

            {/* Dashed prediction line overlay */}
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
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fillCurrent)"
              connectNulls
              activeDot={{ r: 3.5, strokeWidth: 0, fill: safeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - Shown only on mobile below chart */}
      <LegendItems
        className="mt-4 sm:hidden border-t border-outline-variant pt-3"
        currentLabel={currentLabel}
        previousLabel={previousLabel}
        isThisMonth={isThisMonth}
        showBudget={showBudget}
      />
    </Panel>
  );
}
