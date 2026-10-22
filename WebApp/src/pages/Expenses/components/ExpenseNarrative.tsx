export default function ExpenseNarrative() {
  return (
    <section className="space-y-3">
      <h2 className="text-[15px] font-semibold text-on-surface">Expense Narrative</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            </div>
            <span className="eyebrow">Insight</span>
          </div>
          <h3 className="text-sm font-semibold text-on-surface mb-1">Subscription Bloat</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            You've spent <span className="text-on-surface font-medium tabular-nums">$120</span> more on streaming
            services this month.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">trending_down</span>
            </div>
            <span className="eyebrow">Saving</span>
          </div>
          <h3 className="text-sm font-semibold text-on-surface mb-1">Dining Out</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Your grocery shopping reduced dining costs by{" "}
            <span className="text-secondary font-medium tabular-nums">15%</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
