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
    <div className="mb-6">
      {/* 1. Title & Current Date Context (Functional Button) */}
      <div 
        className="flex flex-col gap-0.5 mb-6 cursor-pointer group w-fit"
        onClick={() => setIsFilterOpen(true)}
      >
        <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight group-hover:text-primary transition-colors">
          Overview
        </h1>
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-on-surface-variant/60 group-hover:text-on-surface-variant transition-colors">
            {dateLabel}
          </p>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 group-hover:text-primary transition-colors">
            tune
          </span>
        </div>
      </div>

      {/* 2. Full-Bleed Scrolling Pills */}
      <div className="grid grid-cols-1 w-full min-w-0">
        <div className="flex gap-2 -mx-4 md:-mx-6 px-4 md:px-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
          {PRESETS.map((p) => {
            const active = isPresetActive(p.key);
            return (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className={`flex-none px-4 py-1.5 rounded-full text-xs font-bold snap-start transition-all duration-200 border ${
                  active
                    ? "bg-primary text-on-primary border-primary shadow-sm shadow-primary/20"
                    : "bg-surface-container border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-high hover:border-outline-variant/30"
                }`}
              >
                {p.label}
              </button>
            );
          })}
          {/* Spacer to let the last pill clear the right edge */}
          <div className="w-1 shrink-0 sm:hidden"></div>
        </div>
      </div>
    </div>
  );
}
