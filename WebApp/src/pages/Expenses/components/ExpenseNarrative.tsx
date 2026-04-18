export default function ExpenseNarrative() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-headline font-bold text-on-surface">Expense Narrative</h2>
      <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
        <div className="min-w-[280px] bg-surface-container-lowest p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-xl text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Insight</span>
          </div>
          <h3 className="font-headline font-bold text-on-surface mb-2">Subscription Bloat</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            You've spent <span className="text-primary font-semibold">$120</span> more on streaming services this month.
          </p>
        </div>

        <div className="min-w-[280px] bg-surface-container-lowest p-6 rounded-lg shadow-sm border-l-4 border-secondary">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary/10 rounded-xl text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined">trending_down</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Saving</span>
          </div>
          <h3 className="font-headline font-bold text-on-surface mb-2">Dining Out</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Your grocery shopping reduced dining costs by <span className="text-secondary font-semibold">15%</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
