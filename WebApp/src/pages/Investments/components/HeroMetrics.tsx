import { useUserPreferences } from "../../../context/UserPreferencesContext";

interface HeroMetricsProps {
  metrics: {
    totalValue: number;
    totalInvested: number;
    roi: number;
  };
  stealthMode: boolean;
  onToggleStealth: () => void;
}

export default function HeroMetrics({ metrics, stealthMode, onToggleStealth }: HeroMetricsProps) {
  const { currency } = useUserPreferences();

  const formatCurrency = (val: number) => {
    if (stealthMode) return "••••••";
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isPositiveROI = metrics.roi >= 0;
  const totalGain = metrics.totalValue - metrics.totalInvested;

  return (
    <div className="relative rounded-3xl overflow-hidden">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0c1d] via-[#111827] to-[#0d1117]" />
      {/* Glowing orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-tertiary/15 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 p-8 md:p-10">
        {/* Top Row: Label + Stealth Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <span className="material-symbols-outlined text-[18px] text-white/90" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
              Vault Net Worth
            </span>
          </div>
          <button
            onClick={onToggleStealth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/50 hover:text-white/80 text-xs font-bold"
            title="Toggle Stealth Mode"
          >
            <span className="material-symbols-outlined text-[15px]">
              {stealthMode ? "visibility_off" : "visibility"}
            </span>
            {stealthMode ? "Concealed" : "Visible"}
          </button>
        </div>

        {/* Main Balance */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2.5">
            {!stealthMode && (
              <span className="text-3xl md:text-4xl font-black text-white/30 font-headline">
                {currency.symbol}
              </span>
            )}
            <h1
              className={`font-headline font-black tracking-tighter leading-none transition-all duration-500 ${
                stealthMode
                  ? "text-5xl md:text-7xl text-white/20 blur-sm select-none"
                  : "text-5xl md:text-7xl bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent"
              }`}
            >
              {formatCurrency(metrics.totalValue)}
            </h1>
          </div>
        </div>

        {/* Supporting Metrics Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Total Invested Pill */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px] text-white/40">savings</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 leading-none mb-0.5">
                Total Invested
              </p>
              <p className="text-sm font-black text-white/80 font-headline">
                {stealthMode ? "••••" : `${currency.symbol}${formatCurrency(metrics.totalInvested)}`}
              </p>
            </div>
          </div>

          {/* ROI Pill */}
          <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-sm ${
            isPositiveROI
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}>
            <span className={`material-symbols-outlined text-[16px] ${isPositiveROI ? "text-emerald-400" : "text-red-400"}`}>
              {isPositiveROI ? "trending_up" : "trending_down"}
            </span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 leading-none mb-0.5">
                All-Time ROI
              </p>
              <p className={`text-sm font-black font-headline ${isPositiveROI ? "text-emerald-400" : "text-red-400"}`}>
                {stealthMode ? "••••" : `${isPositiveROI ? "+" : ""}${metrics.roi.toFixed(1)}%`}
              </p>
            </div>
          </div>

          {/* Absolute Gain Pill */}
          {!stealthMode && (
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-sm ${
              isPositiveROI ? "bg-white/5 border-white/10" : "bg-red-500/10 border-red-500/20"
            }`}>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 leading-none mb-0.5">
                  {isPositiveROI ? "Total Gain" : "Total Loss"}
                </p>
                <p className={`text-sm font-black font-headline ${isPositiveROI ? "text-white/70" : "text-red-400"}`}>
                  {isPositiveROI ? "+" : "-"}{currency.symbol}{Math.abs(totalGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
