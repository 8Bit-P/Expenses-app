import type { AssetWithSnapshots, AssetType } from "../../../types/investments";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AllocationDonutProps {
  assets: AssetWithSnapshots[];
  stealthMode: boolean;
}

const TYPE_CONFIG: Record<AssetType, { label: string; hex: string; bg: string; text: string; icon: string }> = {
  fund:         { label: "Index Funds",  hex: "#818cf8", bg: "bg-indigo-500/15",   text: "text-indigo-400",  icon: "pie_chart" },
  crypto:       { label: "Crypto",       hex: "#a78bfa", bg: "bg-violet-500/15",   text: "text-violet-400",  icon: "currency_bitcoin" },
  stock:        { label: "Stocks",       hex: "#34d399", bg: "bg-emerald-500/15",  text: "text-emerald-400", icon: "trending_up" },
  real_estate:  { label: "Real Estate",  hex: "#f59e0b", bg: "bg-amber-500/15",    text: "text-amber-400",   icon: "real_estate_agent" },
  cash:         { label: "Cash",         hex: "#94a3b8", bg: "bg-slate-500/15",    text: "text-slate-400",   icon: "payments" },
  other:        { label: "Other",        hex: "#6b7280", bg: "bg-zinc-500/15",     text: "text-zinc-400",    icon: "category" },
};

export default function AllocationDonut({ assets, stealthMode }: AllocationDonutProps) {
  const typeValues: Record<string, number> = {};
  let overallTotal = 0;

  assets.forEach((asset) => {
    const latest = asset.asset_snapshots[0];
    if (latest) {
      const val = Number(latest.total_value);
      typeValues[asset.type] = (typeValues[asset.type] || 0) + val;
      overallTotal += val;
    }
  });

  const allocations = Object.entries(typeValues)
    .filter(([_, val]) => val > 0)
    .map(([type, val]) => {
      const percentage = overallTotal > 0 ? (val / overallTotal) * 100 : 0;
      return {
        type: type as AssetType,
        value: val,
        percentage,
        config: TYPE_CONFIG[type as AssetType] || TYPE_CONFIG.other,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Custom tooltips to match the aesthetic (even though there's a legend, tooltips are nice on hover)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; 
      if (!data || !data.config) return null;

      return (
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xl border border-outline-variant/20 font-body flex items-center gap-2 z-[100]">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.config.hex }} />
          <div>
            <p className="text-xs font-bold text-on-surface">{data.config.label}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
               {stealthMode ? "**%" : `${data.percentage.toFixed(1)}%`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-7 pt-7 pb-5 border-b border-outline-variant/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-primary">donut_large</span>
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant">
            Portfolio Allocation
          </h3>
        </div>
      </div>

      {allocations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-on-surface-variant/30">
          <span className="material-symbols-outlined text-5xl">donut_large</span>
          <p className="text-sm font-bold">No allocation data yet</p>
        </div>
      ) : (
        <div className="flex flex-col items-center p-7 gap-8 flex-1">
          {/* Donut Graphic using Recharts */}
          <div className="relative flex items-center justify-center w-full h-[220px]">
             <ResponsiveContainer width="100%" height={220} minWidth={1} minHeight={1} debounce={50}>
              <PieChart>
                <Pie
                  data={allocations}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="95%"
                  paddingAngle={3} // Native spacing between slices!
                  stroke="none" // Removes border
                  cornerRadius={6} // Slightly rounded slice edges look super premium
                  startAngle={90} // Rotate to start from top
                  endAngle={-270}
                >
                  {allocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.config.hex} style={{ transition: 'all 0.3s ease' }} className="hover:opacity-80 hover:cursor-pointer hover:drop-shadow-lg outline-none" />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 1000 }}
                  content={<CustomTooltip />}
                  cursor={false}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Inner Content overlay perfectly centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-black tracking-widest text-on-surface-variant/50 uppercase mb-1 drop-shadow-sm">
                Diversified
              </span>
              <span className="text-3xl font-black font-headline text-on-surface leading-none drop-shadow-sm">
                {stealthMode ? "?" : allocations.length}
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant/60 mt-0.5">
                Asset {allocations.length === 1 ? "Class" : "Classes"}
              </span>
            </div>
          </div>

          {/* Legend list */}
          <div className="w-full space-y-2 mt-2">
            {allocations.map((alloc) => (
              <div
                key={alloc.type}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-low/60 hover:bg-surface-container transition-colors group"
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg ${alloc.config.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <span className={`material-symbols-outlined text-[16px] ${alloc.config.text}`}>
                    {alloc.config.icon}
                  </span>
                </div>

                {/* Label */}
                <span className="flex-1 text-sm font-bold text-on-surface">{alloc.config.label}</span>

                {/* Bar */}
                <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${alloc.percentage}%`, backgroundColor: alloc.config.hex }}
                  />
                </div>

                {/* Percentage */}
                <span className="text-sm font-black text-on-surface tabular-nums w-12 text-right">
                  {stealthMode ? "**%" : `${alloc.percentage.toFixed(1)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
