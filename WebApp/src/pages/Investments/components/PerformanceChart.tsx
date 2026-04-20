import { useState, useMemo } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency, formatCompactCurrency } from "../../../utils/currency";
import type { TimeRange } from "../../../types/investments";
import { format, subMonths, subYears, parseISO } from "date-fns";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Cell } from "recharts";

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
  const aggregatedData = usePerformanceChartData(assets);
  const { currency } = useUserPreferences();
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y");

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
    return timeRange === "6M" ? format(date, "MMM d") : format(date, "MMM yyyy");
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
      const isPositive = data.gain >= 0;

      return (
        <div className="bg-surface-container-lowest/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-outline-variant/20 font-body min-w-[220px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3 border-b border-outline-variant/10 pb-2">
            {format(parseISO(label), "MMMM d, yyyy")}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div> Total Value
              </span>
              <span className="text-sm font-black text-on-surface">
                {stealthMode
                  ? "****"
                  : formatCurrency(data.totalValue, currency.code)}
              </span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-outline-variant"></div> Net Invested
              </span>
              <span className="text-sm font-bold text-on-surface-variant">
                {stealthMode
                  ? "****"
                  : formatCurrency(data.invested, currency.code)}
              </span>
            </div>

            <div
              className={`mt-3 pt-2 border-t border-outline-variant/10 flex justify-between items-center gap-4 ${stealthMode ? "text-on-surface-variant" : isPositive ? "text-emerald-500" : "text-error"}`}
            >
              <span className="text-xs font-black uppercase tracking-wider">Unrealized P/L</span>
              <span className="text-sm font-black flex items-center gap-1">
                {stealthMode ? (
                  "****"
                ) : (
                  <>
                    {isPositive ? "+" : ""}
                    {formatCurrency(data.gain, currency.code)}
                    <span className="text-[10px] bg-current/10 px-1.5 py-0.5 rounded-md ml-1">
                      {isPositive ? "+" : ""}
                      {data.roi.toFixed(1)}%
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const barGradient = "url(#barGradient)";
  const lastBarFill = "#191c1e"; // on-surface

  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 h-96 flex flex-col group relative">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h3 className="text-xl font-headline font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">insights</span>
            Performance History
          </h3>
          <p className="text-xs font-bold text-on-surface-variant mt-1">Value vs. Cost Basis over time</p>
        </div>
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
          {(["6M", "1Y", "ALL"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all duration-300 ${timeRange === range ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3 border-2 border-dashed border-outline-variant/20 rounded-2xl bg-surface-container-low/50">
          <span className="material-symbols-outlined text-4xl">monitoring</span>
          <p className="text-sm font-bold">Log snapshots to visualize your timeline.</p>
        </div>
      ) : (
        <div className="flex-1 -ml-6 -mr-6 -mb-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            {/* Switched from BarChart to ComposedChart to support multiple chart types overlaid */}
            <ComposedChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              barCategoryGap="15%" // Makes bars look sleeker
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#c3c0ff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fontWeight: 800, fill: "#777587" }}
                tickLine={false}
                axisLine={false}
                minTickGap={30} // Prevents label overlapping when there are many data points
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fontWeight: 800, fill: "#777587" }}
                tickLine={false}
                axisLine={false}
                width={65}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(53, 37, 205, 0.04)" }} />

              {/* Layer 1: The Total Value Bars */}
              <Bar dataKey="totalValue" radius={[6, 6, 0, 0]}>
                {filteredData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === filteredData.length - 1 ? lastBarFill : barGradient} />
                ))}
              </Bar>

              {/* Layer 2: The Net Invested Trendline */}
              <Line
                type="monotone"
                dataKey="invested"
                stroke="#c7c4d8" // outline-variant
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "#ffffff", stroke: "#c7c4d8", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#3525cd", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
