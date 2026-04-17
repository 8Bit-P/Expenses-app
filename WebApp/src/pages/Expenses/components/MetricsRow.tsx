export default function MetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Metric 1: Total Spend */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-error-container/50 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">payments</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Spend</span>
        </div>
        <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">$3,240.50</h2>
        <p className="text-xs font-bold text-error mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +12% vs last month
        </p>
      </div>

      {/* Metric 2: The Big Number (Savings Rate) */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden">
        {/* Subtle background glow for the most important metric */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/50 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">savings</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Savings Rate</span>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">33.3%</h2>
          <span className="text-sm font-bold text-secondary tracking-tight">($1,559.50)</span>
        </div>
        <p className="text-xs font-bold text-secondary mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">stars</span>
          On track for your goal!
        </p>
      </div>

      {/* Metric 3: Top Category */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">pie_chart</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Top Category</span>
        </div>
        <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">Housing</h2>
        <p className="text-xs font-bold text-on-surface-variant mt-2 flex items-center gap-1">
          $1,984.00 (61% of spend)
        </p>
      </div>

    </div>
  );
}