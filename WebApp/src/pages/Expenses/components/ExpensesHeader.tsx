import { useExpenses } from "../../../context/ExpensesContext";
import { formatDateLabel } from "../utils/dateFormatters";

export default function ExpensesHeader() {
  const { filters } = useExpenses();

  const dateLabel = formatDateLabel(filters.startDate, filters.endDate);

  const hasTypeFilter     = !!filters.type;
  const hasCategoryFilter = !!filters.categoryId;
  const hasSearchFilter   = !!filters.search;
  const activeFilterCount = [hasTypeFilter, hasCategoryFilter, hasSearchFilter].filter(Boolean).length;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-1">
          Expense Narrative
        </p>
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
          {dateLabel}
        </h1>
        <p className="text-on-surface-variant mt-1.5 font-medium text-sm">
          {activeFilterCount > 0
            ? `${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''} applied`
            : 'See where your money goes.'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="px-4 py-2.5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
          <span className="text-sm font-bold text-on-surface">{dateLabel}</span>
        </div>
        {activeFilterCount > 0 && (
          <div className="px-3 py-2.5 bg-primary/10 rounded-xl flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px]">filter_alt</span>
            <span className="text-xs font-black text-primary">{activeFilterCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
