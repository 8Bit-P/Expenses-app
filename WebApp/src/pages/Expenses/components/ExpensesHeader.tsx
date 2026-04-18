import { useExpenses } from "../../../context/ExpensesContext";
import { formatDateLabel } from "../../../utils/dateFormatters";
import { PRESETS, buildPreset } from "../../../utils/filterPresets";

export default function ExpensesHeader() {
  const { filters, setFilters, setIsFilterOpen } = useExpenses();

  const dateLabel = formatDateLabel(filters.startDate, filters.endDate);
  const activeFilterCount = [filters.type, filters.categoryId, filters.search].filter(Boolean).length;

  const applyPreset = (key: (typeof PRESETS)[number]["key"]) => {
    setFilters({ ...filters, ...buildPreset(key) });
  };

  const isPresetActive = (key: (typeof PRESETS)[number]["key"]) => {
    const d = buildPreset(key);
    return filters.startDate === d.startDate && filters.endDate === d.endDate;
  };

  return (
    <div className="space-y-4">
      {/* Top row: page title + filter button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-1">
            Expense Narrative
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            {dateLabel}
          </h1>
          <p className="text-on-surface-variant mt-1 font-medium text-sm">
            {activeFilterCount > 0
              ? `${activeFilterCount} additional filter${activeFilterCount > 1 ? "s" : ""} applied`
              : "See where your money goes."}
          </p>
        </div>

        {/* Filters button */}
        <div className="shrink-0">
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${
              activeFilterCount > 0
                ? "bg-primary/10 border-primary/20 text-primary"
                : "bg-surface-container-lowest border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/40"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick preset pills row */}
      <div className="flex items-center flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              isPresetActive(p.key)
                ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:border-outline-variant/50 hover:text-on-surface"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
