import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useInvestments } from "../../../hooks/useInvestments";
import { useTransactions } from "../../../hooks/useTransactions";
import { useMemo } from "react";
import { subMonths, endOfMonth, format, parseISO, isBefore, isAfter, startOfMonth } from "date-fns";
import { formatCurrency } from "../../../utils/currency";

const CustomTooltip = ({ active, payload, label, currencyCode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-outline-variant/20 font-body min-w-[180px] animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3 border-b border-outline-variant/10 pb-2">
          {label} Snapshot
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-4 mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill.includes("url") ? (entry.dataKey === 'investments' ? "#3525cd" : "#10b981") : entry.fill }}></div>
              <span className="text-[11px] font-bold text-on-surface-variant capitalize">{entry.name}</span>
            </div>
            <span className="text-xs font-black text-on-surface">{formatCurrency(entry.value, currencyCode)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function WealthEvolution() {
  const { resolvedTheme, currency } = useUserPreferences();
  const { assets, isLoading: invLoading } = useInvestments();
  const { transactions, loading: txLoading } = useTransactions({ pageSize: 1000 });

  const chartData = useMemo(() => {
    if (invLoading || txLoading) return [];

    // 1. Generate last 6 months
    const months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));

    return months.map((m) => {
      const monthEnd = endOfMonth(m);
      const label = format(m, "MMM");

      // Investments: Sum latest snapshot for each asset on or before month end
      let investments = 0;
      assets.forEach((asset) => {
        const snap = asset.asset_snapshots.find((s: any) => !isAfter(parseISO(s.date), monthEnd));
        if (snap) investments += Number(snap.total_value);
      });

      // Liquidity: Cumulative flow (all time up to month end)
      // Since our transactions are order desc, we filter for everything before monthEnd
      const liquidity = transactions
        .filter((tx) => !isAfter(parseISO(tx.date), monthEnd))
        .reduce((sum, tx) => sum + (tx.type === "income" ? Number(tx.amount) : -Number(tx.amount)), 0);

      return {
        name: label,
        investments,
        liquidity: Math.max(0, liquidity), // Protect against negative chart bars
      };
    });
  }, [assets, transactions, invLoading, txLoading]);

  const gapColor = resolvedTheme === "dark" ? "#0d0e11" : "#ffffff";
  const axisColor = resolvedTheme === "dark" ? "rgba(119, 117, 135, 0.4)" : "rgba(100, 116, 139, 0.5)";

  if (invLoading || txLoading) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center bg-surface-container-lowest rounded-2xl animate-pulse border border-outline-variant/10">
        <div className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">Synchronizing Vault...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-lg font-black font-headline text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">bar_chart</span>
            Wealth Evolution
          </h2>
          <p className="text-[10px] font-bold text-on-surface-variant mt-1">Portfolio growth segmented by asset class</p>
        </div>
        <div className="flex gap-4 p-1.5 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Investments</span>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant">Liquidity</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0} debounce={50}>
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={0}>
            <defs>
              <linearGradient id="barInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                <stop offset="100%" stopColor="#3525cd" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="barLiq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              stroke={resolvedTheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
              strokeDasharray="4 4" 
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={{ fill: axisColor, fontWeight: 800, fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: axisColor, fontWeight: 800, fontSize: 10 }}
              tickFormatter={(val) => `€${val / 1000}k`}
            />
            <Tooltip
              content={<CustomTooltip currencyCode={currency.code} />}
              cursor={{ fill: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)" }}
            />
            <Bar
              dataKey="investments"
              stackId="wealth"
              fill="url(#barInv)"
              radius={[0, 0, 6, 6]}
              stroke={gapColor}
              strokeWidth={2}
              barSize={48}
            />
            <Bar
              dataKey="liquidity"
              stackId="wealth"
              fill="url(#barLiq)"
              radius={[6, 6, 0, 0]}
              stroke={gapColor}
              strokeWidth={2}
              barSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
