import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency, formatCompactCurrency } from "../../../utils/currency";
import type { TimeRange } from "../../../types/investments";
import { format, subMonths, subYears, parseISO } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useIsMobile } from "../../../hooks/useIsMobile";

// ==========================================
// 1. DATA MANIPULATION & AGGREGATION
// ==========================================

function usePerformanceChartData(assets: any[]) {
  const chartData = useMemo(() => {
    if (!assets || assets.length === 0) return [];

    // Step 1: Collect every unique date a snapshot was ever taken
    const allDates = new Set<string>();
    assets.forEach((a) => a.asset_snapshots?.forEach((s: any) => allDates.add(s.date)));
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let cumulativeInvested = 0;

    // Step 2: Build the historical timeline
    return sortedDates.map((dateStr) => {
      const currentPointDate = new Date(dateStr).getTime();
      let totalPortfolioValue = 0;

      // Add contributions that happened EXACTLY on this date to the running total
      assets.forEach((asset) => {
        const snapsOnThisDate = asset.asset_snapshots?.filter((s: any) => s.date === dateStr) || [];
        snapsOnThisDate.forEach((s: any) => {
          cumulativeInvested += Number(s.contribution || 0);
        });
      });

      // Find the LATEST value for EACH asset on or before this date
      assets.forEach((asset) => {
        // Since asset_snapshots are sorted descending (newest first),
        // we find the first one that is older or equal to our current timeline point.
        const latestValidSnap = asset.asset_snapshots?.find((s: any) => new Date(s.date).getTime() <= currentPointDate);

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
  assets: any[];
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
    let startDate = timeRange === "6M" ? subMonths(now, 6) : subYears(now, 1);
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

  // Enhanced Tooltip showing Value, Invested, and Profit
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Access the full data object for this point
      const profit = data.totalValue - data.invested;
      const profitPct = data.invested > 0 ? (profit / data.invested) * 100 : 0;

      return (
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-2xl border border-outline-variant/20 animate-in fade-in zoom-in duration-200 z-[100]">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 border-b border-outline-variant/10 pb-2">
            {format(parseISO(label), "MMMM d, yyyy", { locale: dateLocale })}
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs font-bold text-on-surface-variant">{t("investments.performance.portfolioValue")}</span>
              </div>
              <span className="text-sm font-black text-on-surface">
                {stealthMode ? "****" : formatCurrency(data.totalValue, currency.code)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                <span className="text-xs font-bold text-on-surface-variant">{t("investments.performance.netInvested")}</span>
              </div>
              <span className="text-sm font-black text-on-surface">
                {stealthMode ? "****" : formatCurrency(data.invested, currency.code)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-8 pt-2 border-t border-outline-variant/10">
              <span className="text-xs font-bold text-on-surface-variant">{t("investments.performance.totalGain")}</span>
              <span className={`text-sm font-black ${profit >= 0 ? "text-emerald-500" : "text-error"}`}>
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

  const barGradient = "url(#barGradient)";
  const latestBarGradient = "url(#latestBarGradient)";

  return (
    <div
      className={`bg-surface-container-lowest ${isMobile ? "p-5 h-[340px]" : "p-8 h-96"} rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col group relative overflow-hidden`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
        <div>
          <h3
            className={`${isMobile ? "text-lg" : "text-xl"} font-headline font-black text-on-surface flex items-center gap-2`}
          >
            <span className="material-symbols-outlined text-primary text-[22px]">insights</span>
            {t("investments.performance.title")}
          </h3>
          <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant mt-1">
            {t("investments.performance.subtitle")}
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-surface-container-low rounded-xl self-end sm:self-auto">
          {(["6M", "1Y", "ALL"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black tracking-wider transition-all duration-300 ${timeRange === range ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              {range === "ALL" ? t("common.all") : range}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3 border-2 border-dashed border-outline-variant/20 rounded-2xl bg-surface-container-low/50">
          <span className="material-symbols-outlined text-4xl">monitoring</span>
          <p className="text-sm font-bold">{t("investments.performance.noData")}</p>
        </div>
      ) : (
        <div className={`flex-1 ${isMobile ? "-ml-4 -mr-2" : "-ml-6 -mr-6"} -mb-6 relative`}>
          <ResponsiveContainer width="100%" height={isMobile ? 240 : 280} minWidth={0} minHeight={0} debounce={50}>
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: isMobile ? 10 : 30, left: 0, bottom: 20 }}
              barCategoryGap={isMobile ? "25%" : "15%"}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#c3c0ff" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="latestBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3525cd" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 9, fontWeight: 800, fill: "#777587" }}
                tickLine={false}
                axisLine={false}
                minTickGap={isMobile ? 15 : 30}
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 9, fontWeight: 800, fill: "#777587" }}
                tickLine={false}
                axisLine={false}
                width={isMobile ? 45 : 65}
                dx={isMobile ? -5 : -10}
                hide={isMobile && filteredData.length > 10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(53, 37, 205, 0.04)" }} />

              <Bar dataKey="totalValue" radius={[6, 6, 0, 0]}>
                {filteredData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === filteredData.length - 1 ? latestBarGradient : barGradient} />
                ))}
              </Bar>

              <Line
                type="monotone"
                dataKey="invested"
                stroke="#c7c4d8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: isMobile ? 2 : 3, fill: "#ffffff", stroke: "#c7c4d8", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#3525cd", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
