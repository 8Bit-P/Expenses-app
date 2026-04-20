import { useState, useMemo } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import type { TimeRange } from "../../../types/investments";
import { format, subMonths, subYears, parseISO } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

// ==========================================
// 1. DATA MANIPULATION & AGGREGATION
// ==========================================

function usePerformanceChartData(assets: any[]) {
  // Compute aggregated, sorted snapshots and use useMemo to prevent unnecessary calculations
  const aggregatedData = useMemo(() => {
    const aggregatedSnapshotsMap = new Map<string, number>();

    // Step 1: Group and sum all snapshots from all assets by date
    assets.forEach(asset => {
      asset.asset_snapshots.forEach((snapshot: any) => {
        const dateStr = snapshot.date;
        const currentSum = aggregatedSnapshotsMap.get(dateStr) || 0;
        aggregatedSnapshotsMap.set(dateStr, currentSum + Number(snapshot.total_value));
      });
    });

    // Step 2: Convert map to sorted array
    const sortedData = Array.from(aggregatedSnapshotsMap.entries())
      .map(([date, totalValue]) => ({
        date,
        totalValue,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedData;
  }, [assets]);

  return aggregatedData;
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
    let startDate: Date;

    if (timeRange === "6M") {
      startDate = subMonths(now, 6);
    } else if (timeRange === "1Y") {
      startDate = subYears(now, 1);
    } else {
      startDate = now;
    }

    return aggregatedData.filter(snap => parseISO(snap.date) >= startDate);
  }, [aggregatedData, timeRange]);

  // X-Axis formatter: smarter labeling based on the date range
  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr);
    const now = new Date();
    const rangeInMonths = aggregatedData.length > 0 ? 
      (now.getTime() - parseISO(aggregatedData[0].date).getTime()) / (1000 * 60 * 60 * 24 * 30.44) : 0;
    
    if (timeRange === "6M" || (timeRange === "ALL" && rangeInMonths < 12)) {
      return format(date, "MMM");
    } else {
      return format(date, "MMM yyyy");
    }
  };

  // Y-Axis formatter
  const formatYAxis = (value: number) => {
    if (stealthMode) return "****";
    return `${currency.symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const date = parseISO(label);
      return (
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xl border border-outline-variant/20 font-body">
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1.5">
            {format(date, "MMMM d, yyyy")}
          </p>
          <p className="text-2xl font-black font-headline text-on-surface tracking-tight">
            {!stealthMode && <span className="text-lg text-on-surface-variant/70 mr-0.5">{currency.symbol}</span>}
            {stealthMode ? "****" : value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Define dynamic colors based on the design
  const barGradient = "url(#barGradient)";
  const lastBarFill = "#191c1e"; // on-surface

  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 h-80 flex flex-col group relative">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h3 className="text-xl font-headline font-black text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">show_chart</span>
          Investment Performance
        </h3>
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
          {(["6M", "1Y", "ALL"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${timeRange === range ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3 border-4 border-dashed border-outline-variant/10 rounded-2xl">
          <span className="material-symbols-outlined text-5xl">bar_chart_4_bars</span>
          <p className="text-sm font-bold">Log data over time to see performance trends</p>
        </div>
      ) : (
        <div className="flex-1 -ml-6 -mr-6 -mb-6 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 30, bottom: 20 }}
              barGap={0}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3525cd" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#c3c0ff" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#464555' }} // on-surface-variant
                tickLine={false}
                axisLine={false}
                interval={timeRange === "ALL" ? 2 : 0} // Standard smart labeling
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#464555' }}
                tickLine={false}
                axisLine={false}
                width={70}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(53, 37, 205, 0.03)' }} // primary/5
                wrapperStyle={{ zIndex: 100 }}
              />
              <Bar dataKey="totalValue" radius={[12, 12, 0, 0]}>
                {filteredData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === filteredData.length - 1 ? lastBarFill : barGradient}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
