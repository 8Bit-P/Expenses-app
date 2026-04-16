export default function ExpensesHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <span className="text-sm font-label text-on-surface-variant tracking-wider uppercase">
          Overview
        </span>
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mt-1">
          Expense Narrative
        </h1>
        <p className="text-on-surface-variant mt-2 font-medium">
          See where your money goes.
        </p>
      </div>

      {/* Global Time Filter + Calendar Badge combined */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="px-4 py-2 bg-surface-container-lowest rounded-xl shadow-sm flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-primary text-sm">
            calendar_today
          </span>
          <span className="text-sm font-semibold">Oct 2023 - Nov 2023</span>
        </div>
      </div>
    </div>
  );
}
