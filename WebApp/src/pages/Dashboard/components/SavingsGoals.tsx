export default function SavingsGoals() {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
          Savings Goals
        </h2>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {/* Placeholder Goal 1 */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-transparent hover:border-outline-variant/20 transition-all">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-lg">
                🎌
              </div>
              <div>
                <p className="font-bold text-xs text-on-surface">Japan Trip</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                  Target: €10,000
                </p>
              </div>
            </div>
            <span className="font-black text-primary text-sm">40%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[40%]"></div>
          </div>
          <p className="text-right text-[10px] font-bold text-on-surface mt-1.5">€4,000 Saved</p>
        </div>

        {/* Placeholder Goal 2 */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-transparent hover:border-outline-variant/20 transition-all">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-lg">
                🏠
              </div>
              <div>
                <p className="font-bold text-xs text-on-surface">House Deposit</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                  Target: €50,000
                </p>
              </div>
            </div>
            <span className="font-black text-secondary text-sm">15%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full w-[15%]"></div>
          </div>
          <p className="text-right text-[10px] font-bold text-on-surface mt-1.5">€7,500 Saved</p>
        </div>
      </div>
    </div>
  );
}
