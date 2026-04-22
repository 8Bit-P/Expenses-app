import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

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

  const internalFormatCurrency = (val: number) => {
    if (stealthMode) return "••••••";
    return formatCurrency(val, currency.code);
  };

  const isPositiveROI = metrics.roi >= 0;
  const totalGain = metrics.totalValue - metrics.totalInvested;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm border border-outline-variant/10 transition-colors duration-300">
      {/* Deep gradient background specific to dark mode, clean solid for light mode */}
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-[#0d0c1d] via-[#111827] to-[#0d1117] transition-all" />
      
      {/* Glowing orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-colors" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-tertiary/15 dark:bg-tertiary/15 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none transition-colors" />
      
      {/* Grid texture overlay (subtle in light mode, more visible in dark) */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none transition-opacity"
        style={{
          backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          color: "var(--on-surface)"
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        {/* Top Row: Label + Stealth Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm border border-primary/10 dark:border-white/10 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-primary dark:text-white/90" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-white/50 transition-colors">
              Vault Net Worth
            </span>
          </div>
          <button
            onClick={onToggleStealth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high dark:bg-white/5 hover:bg-surface-container-highest dark:hover:bg-white/10 border border-outline-variant/10 dark:border-white/10 transition-all text-on-surface-variant dark:text-white/50 hover:text-on-surface dark:hover:text-white/80 text-xs font-bold"
            title="Toggle Stealth Mode"
          >
            <span className="material-symbols-outlined text-[15px]">
              {stealthMode ? "visibility_off" : "visibility"}
            </span>
            {stealthMode ? "Concealed" : "Visible"}
          </button>
        </div>

        {/* Main Balance */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-baseline gap-2.5">
            <h1
              className={`font-headline font-black tracking-tighter leading-[1.1] transition-all duration-500 break-all sm:break-normal ${
                stealthMode
                  ? "text-4xl sm:text-5xl md:text-7xl text-on-surface-variant/30 dark:text-white/20 blur-sm select-none"
                  : "text-4xl sm:text-5xl md:text-7xl text-on-surface dark:bg-gradient-to-br dark:from-white dark:via-white/90 dark:to-white/50 dark:bg-clip-text dark:text-transparent"
              }`}
            >
              {internalFormatCurrency(metrics.totalValue)}
            </h1>
          </div>
        </div>

        {/* Supporting Metrics Row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          {/* Total Invested Pill */}
          <div className="flex items-center gap-2.5 px-4 py-3 sm:py-2.5 rounded-2xl bg-surface-container-low dark:bg-white/5 border border-outline-variant/10 dark:border-white/10 backdrop-blur-sm transition-colors">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant dark:text-white/40">savings</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 dark:text-white/30 leading-none mb-0.5">
                Total Invested
              </p>
              <p className="text-sm font-black text-on-surface dark:text-white/80 font-headline transition-colors">
                {stealthMode ? "••••" : formatCurrency(metrics.totalInvested, currency.code)}
              </p>
            </div>
          </div>

          {/* ROI Pill */}
          <div className={`flex items-center gap-2.5 px-4 py-3 sm:py-2.5 rounded-2xl border backdrop-blur-sm transition-colors ${
            isPositiveROI
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}>
            <span className={`material-symbols-outlined text-[16px] ${isPositiveROI ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
              {isPositiveROI ? "trending_up" : "trending_down"}
            </span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 dark:text-white/30 leading-none mb-0.5 transition-colors">
                All-Time ROI
              </p>
              <p className={`text-sm font-black font-headline ${isPositiveROI ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {stealthMode ? "••••" : `${isPositiveROI ? "+" : ""}${metrics.roi.toFixed(1)}%`}
              </p>
            </div>
          </div>

          {/* Absolute Gain Pill */}
          {!stealthMode && (
            <div className={`flex items-center gap-2.5 px-4 py-3 sm:py-2.5 rounded-2xl border backdrop-blur-sm transition-colors ${
              isPositiveROI ? "bg-surface-container-low dark:bg-white/5 border-outline-variant/10 dark:border-white/10" : "bg-red-500/10 border-red-500/20"
            }`}>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 dark:text-white/30 leading-none mb-0.5 transition-colors">
                  {isPositiveROI ? "Total Gain" : "Total Loss"}
                </p>
                <p className={`text-sm font-black font-headline transition-colors ${isPositiveROI ? "text-on-surface-variant dark:text-white/70" : "text-red-600 dark:text-red-400"}`}>
                  {isPositiveROI ? "+" : ""}
                  {formatCurrency(totalGain, currency.code)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
