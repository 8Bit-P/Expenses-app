import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency, formatCompactCurrency } from "../../../utils/currency";
import type { TimeRange, AssetWithSnapshots } from "../../../types/investments";
import { format, subMonths, subYears, parseISO } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { TooltipContentProps } from "recharts";
import { useIsMobile } from "../../../hooks/useIsMobile";
import Panel from "../../../components/ui/Panel";
import { CHART, AXIS_TICK } from "../../../constants/chartColors";
import { cn } from "../../../utils/cn";

// ==========================================
// 1. DATA MANIPULATION & AGGREGATION
// ==========================================

function usePerformanceChartData(assets: AssetWithSnapshots[]) {
  const chartData = useMemo(() => {
    if (!assets || assets.length === 0) return [];

    // Step 1: Collect every unique date a snapshot was ever taken
    const allDates = new Set<string>();
    assets.forEach((a) => a.asset_snapshots?.forEach((s) => allDates.add(s.date)));
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let cumulativeInvested = 0;

    // Step 2: Build the historical timeline
    return sortedDates.map((dateStr) => {
      const currentPointDate = new Date(dateStr).getTime();
      let totalPortfolioValue = 0;

      // Add contributions that happened EXACTLY on this date to the running total
      assets.forEach((asset) => {
        const snapsOnThisDate = asset.asset_snapshots?.filter((s) => s.date === dateStr) || [];
        snapsOnThisDate.forEach((s) => {
          cumulativeInvested += Number(s.contribution || 0);
        });
      });

      // Find the LATEST value for EACH asset on or before this date
      assets.forEach((asset) => {
        // Since asset_snapshots are sorted descending (newest first),
        // we find the first one that is older or equal to our current timeline point.
        const latestValidSnap = asset.asset_snapshots?.find((s) => new Date(s.date).getTime() <= currentPointDate);

        if (latestValidSnap) {
          totalPortfolioValue += Number(latestValidSnap.total_value || 0);
        }
      });

      const absoluteGain = totalPortfolioValue - cumulativeInvested;
      const roi = cumulativeInvested > 0 ? (absoluteGain / cumulativeInvested) * 100 : 0;

      return {
        date: dateStr,
        totalValue: totalPortfolioValue,
        invested: cumulativeInvested,
        gain: absoluteGain,
        roi: roi,
      };
    });
  }, [assets]);

  return chartData;
}

// ==========================================
// 2. THE UI COMPONENT
// ==========================================
interface PerformanceChartProps {
  assets: AssetWithSnapshots[];
  stealthMode: boolean;
}

export default function PerformanceChart({ assets, stealthMode }: PerformanceChartProps) {
  const { t, i18n } = useTranslation();
  const aggregatedData = usePerformanceChartData(assets);
  const { currency } = useUserPreferences();
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y");
  const isMobile = useIsMobile(1024);

  const dateLocale = i18n.language === "es" ? es : enUS;

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (timeRange === "ALL") return aggregatedData;
    const now = new Date();
    const startDate = timeRange === "6M" ? subMonths(now, 6) : subYears(now, 1);
    return aggregatedData.filter((snap) => parseISO(snap.date) >= startDate);
  }, [aggregatedData, timeRange]);

  // X-Axis formatter
  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isMobile) {
      return format(date, "MMM", { locale: dateLocale });
    }
    return timeRange === "6M" ? format(date, "MMM d", { locale: dateLocale }) : format(date, "MMM yyyy", { locale: dateLocale });
  };

  // Y-Axis formatter
  const formatYAxis = (value: number) => {
    if (stealthMode) return "****";
    return formatCompactCurrency(value, currency.code);
  };

  // Tooltip showing Value, Invested, and Profit
  const renderTooltip = ({ active, payload, label }: TooltipContentProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Access the full data object for this point
      const profit = data.totalValue - data.invested;
      const profitPct = data.invested > 0 ? (profit / data.invested) * 100 : 0;

      return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs min-w-[220px]">
          <p className="font-medium text-on-surface pb-1.5 mb-1.5 border-b border-outline-variant">
            {format(parseISO(String(label)), "MMMM d, yyyy", { locale: dateLocale })}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-2 h-0.5 rounded-full" style={{ backgroundColor: CHART.primary }} />
                {t("investments.performance.portfolioValue")}
              </span>
              <span className="font-medium tabular-nums text-on-surface">
                {stealthMode ? "****" : formatCurrency(data.totalValue, currency.code)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="w-2 h-0.5 rounded-full" style={{ backgroundColor: CHART.secondary }} />
                {t("investments.performance.netInvested")}
              </span>
              <span className="font-medium tabular-nums text-on-surface">
                {stealthMode ? "****" : formatCurrency(data.invested, currency.code)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6 pt-1.5 mt-1 border-t border-outline-variant">
              <span className="text-on-surface-variant">{t("investments.performance.totalGain")}</span>
              <span className={cn("font-medium tabular-nums", profit >= 0 ? "text-secondary" : "text-error")}>
                {stealthMode
                  ? "****"
                  : `${profit >= 0 ? "+" : ""}${formatCurrency(profit, currency.code)} (${profitPct.toFixed(1)}%)`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const rangeControl = (
    <div className="inline-flex p-0.5 rounded-lg bg-surface-container border border-outline-variant">
      {(["6M", "1Y", "ALL"] as TimeRange[]).map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={cn(
            "px-3 h-8 rounded-md text-xs font-medium transition-colors",
            timeRange === range
              ? "bg-surface-container-lowest text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          {range === "ALL" ? t("common.all") : range}
        </button>
      ))}
    </div>
  );

  return (
    <Panel
      title={t("investments.performance.title")}
      subtitle={t("investments.performance.subtitle")}
      actions={rangeControl}
    >
      {filteredData.length === 0 ? (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 text-center",
            isMobile ? "h-[240px]" : "h-[280px]",
          )}
        >
          <span className="material-symbols-outlined text-[24px] text-outline">monitoring</span>
          <p className="text-sm text-on-surface-variant">{t("investments.performance.noData")}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: CHART.primary }} />
              {t("investments.performance.portfolioValue")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-t-2 border-dashed" style={{ borderColor: CHART.secondary }} />
              {t("investments.performance.netInvested")}
            </span>
          </div>
          <div className="-ml-2">
            <ResponsiveContainer width="100%" height={isMobile ? 240 : 280} minWidth={0} minHeight={0} debounce={50}>
              <ComposedChart data={filteredData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="investmentsValueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={CHART.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={isMobile ? 15 : 30}
                  dy={8}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 48 : 64}
                  hide={isMobile && filteredData.length > 10}
                />
                <Tooltip content={renderTooltip} cursor={{ stroke: CHART.grid, strokeWidth: 1 }} />

                <Area
                  type="monotone"
                  dataKey="totalValue"
                  stroke={CHART.primary}
                  strokeWidth={2}
                  fill="url(#investmentsValueFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: CHART.primary, stroke: CHART.surface, strokeWidth: 2 }}
                />

                <Line
                  type="monotone"
                  dataKey="invested"
                  stroke={CHART.secondary}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 4, fill: CHART.secondary, stroke: CHART.surface, strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Panel>
  );
}
