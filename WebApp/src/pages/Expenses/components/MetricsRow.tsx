export default function MetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Total Monthly Spend */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-error">
        <p className="text-sm font-semibold text-on-surface-variant mb-1">Total Monthly Spend</p>
        <h3 className="text-3xl font-black font-headline text-on-surface">$4,822.40</h3>
        <div className="mt-3 flex items-center gap-1 text-error font-bold text-xs">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>12% from last month</span>
        </div>
      </div>

      {/* Top Category */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-primary">
        <p className="text-sm font-semibold text-on-surface-variant mb-1">Top Category</p>
        <h3 className="text-3xl font-black font-headline text-on-surface">Living</h3>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[45%]"></div>
          </div>
          <span className="text-xs font-bold text-primary">45%</span>
        </div>
      </div>

      {/* Subscription Total */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-tertiary-container">
        <p className="text-sm font-semibold text-on-surface-variant mb-1">Subscription Total</p>
        <h3 className="text-3xl font-black font-headline text-on-surface">$248.00</h3>
        <div className="mt-3 text-xs font-semibold text-on-surface-variant">
          8 active services
        </div>
      </div>

    </div>
  );
}