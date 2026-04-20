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
    if (stealthMode) return "****";
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isPositiveROI = metrics.roi >= 0;

  // Calculate the absolute money made/lost
  const totalGain = metrics.totalValue - metrics.totalInvested;

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden relative group">
      {/* Subtle atmospheric inner glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        {/* Left Side: The Master Balance */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Vault Net Worth</h2>
            <button
              onClick={onToggleStealth}
              className="ml-auto md:ml-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant"
              title="Toggle Stealth Mode"
            >
              <span className="material-symbols-outlined text-[18px]">
                {stealthMode ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            {!stealthMode && <span className="text-3xl font-bold text-on-surface-variant/40">{currency.symbol}</span>}
            <h1
              className={`text-5xl md:text-6xl font-headline font-black tracking-tight ${stealthMode ? "text-on-surface-variant opacity-60" : "text-on-surface"}`}
            >
              {formatCurrency(metrics.totalValue)}
            </h1>
          </div>
        </div>

        {/* Right Side: The Supporting Metrics */}
        <div className="flex items-center gap-8 md:gap-12 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-outline-variant/10 md:pl-12">
          {/* Cost Basis */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 mb-1.5">
              Total Invested
            </p>
            <p
              className={`text-xl font-headline font-bold ${stealthMode ? "text-on-surface-variant opacity-60" : "text-on-surface"}`}
            >
              {!stealthMode && <span className="text-sm text-on-surface-variant/50 mr-0.5">{currency.symbol}</span>}
              {formatCurrency(metrics.totalInvested)}
            </p>
          </div>

          {/* ROI & Absolute Return */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 mb-1.5">
              All-Time Return
            </p>
            <div className="flex items-center gap-2.5">
              <p
                className={`text-xl font-headline font-bold ${stealthMode ? "text-on-surface-variant opacity-60" : isPositiveROI ? "text-tertiary" : "text-error"}`}
              >
                {stealthMode ? "****" : `${isPositiveROI ? "+" : ""}${metrics.roi.toFixed(1)}%`}
              </p>

              {!stealthMode && (
                <span
                  className={`flex items-center text-[11px] font-black tracking-wider px-2 py-1 rounded-md ${isPositiveROI ? "text-on-tertiary-fixed-variant bg-tertiary-fixed/60" : "text-error bg-error-container/60"}`}
                >
                  <span className="material-symbols-outlined text-[14px] mr-1">
                    {isPositiveROI ? "trending_up" : "trending_down"}
                  </span>
                  {currency.symbol}
                  {formatCurrency(Math.abs(totalGain))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
