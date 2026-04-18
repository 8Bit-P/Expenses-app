import { useExpenses } from "../../../context/ExpensesContext";
import { useCategories } from "../../../hooks/useCategories";
import type { TransactionType } from "../../../types/expenses";
import { format, startOfMonth, endOfMonth } from "date-fns";

const now = new Date();
const DEFAULT_FILTERS = {
  startDate: format(startOfMonth(now), "yyyy-MM-dd"),
  endDate: format(endOfMonth(now), "yyyy-MM-dd"),
};

const PRESETS = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3m",    label: "3 Months" },
  { key: "ytd",        label: "Year to Date" },
] as const;

type Preset = typeof PRESETS[number]["key"];

function buildPreset(preset: Preset): { startDate: string; endDate: string } {
  const n = new Date();
  if (preset === "this_month") {
    return {
      startDate: format(startOfMonth(n), "yyyy-MM-dd"),
      endDate: format(endOfMonth(n), "yyyy-MM-dd"),
    };
  }
  if (preset === "last_month") {
    const firstLast = new Date(n.getFullYear(), n.getMonth() - 1, 1);
    return {
      startDate: format(firstLast, "yyyy-MM-dd"),
      endDate: format(endOfMonth(firstLast), "yyyy-MM-dd"),
    };
  }
  if (preset === "last_3m") {
    const firstOf3 = new Date(n.getFullYear(), n.getMonth() - 2, 1);
    return {
      startDate: format(firstOf3, "yyyy-MM-dd"),
      endDate: format(endOfMonth(n), "yyyy-MM-dd"),
    };
  }
  // ytd
  return {
    startDate: format(new Date(n.getFullYear(), 0, 1), "yyyy-MM-dd"),
    endDate: format(endOfMonth(n), "yyyy-MM-dd"),
  };
}

export default function FilterPanel() {
  const { filters, setFilters } = useExpenses();
  const { categories } = useCategories();

  const handleTypeChange = (type: TransactionType | undefined) =>
    setFilters({ ...filters, type });

  const handleCategoryChange = (categoryId: string) =>
    setFilters({ ...filters, categoryId: categoryId === "all" ? undefined : categoryId });

  const applyPreset = (preset: Preset) =>
    setFilters({ ...filters, ...buildPreset(preset) });

  // "dirty" = something differs from pure default-month state
  const isDirty =
    filters.type ||
    filters.categoryId ||
    filters.search ||
    filters.startDate !== DEFAULT_FILTERS.startDate ||
    filters.endDate !== DEFAULT_FILTERS.endDate;

  const inputCls =
    "w-full bg-surface-container border border-outline-variant/30 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/40 text-on-surface";

  return (
    <>
      {/* Custom calendar icon tint */}
      <style>{`
        .filter-date::-webkit-calendar-picker-indicator {
          opacity: 0.5; cursor: pointer; filter: invert(0.6);
        }
      `}</style>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10 bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
            <h4 className="text-sm font-black uppercase tracking-[0.15em] text-on-surface">
              Filter Narrative
            </h4>
          </div>
          {isDirty && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">refresh</span>
              Reset
            </button>
          )}
        </div>

        <div className="p-5 space-y-6">

          {/* ── Flow Type ── */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant block">
              Flow Type
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-container rounded-xl">
              {(["all", "income", "expense"] as const).map((t) => {
                const active = t === "all" ? !filters.type : filters.type === t;
                return (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t === "all" ? undefined : t)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface hover:bg-surface-container-lowest"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Category ── */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant block">
              Category
            </label>
            <div className="relative">
              <select
                value={filters.categoryId || "all"}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`${inputCls} appearance-none py-3 pl-4 pr-10 cursor-pointer`}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* ── Date Range ── */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant block">
              Date Range
            </label>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => {
                const dates = buildPreset(p.key);
                const isActive =
                  filters.startDate === dates.startDate && filters.endDate === dates.endDate;
                return (
                  <button
                    key={p.key}
                    onClick={() => applyPreset(p.key)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-low border border-outline-variant/20"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Manual date inputs */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value || undefined })
                }
                className={`filter-date ${inputCls} flex-1 min-w-0 py-2.5 px-3 text-xs cursor-pointer`}
              />
              <span className="text-on-surface-variant/40 font-bold text-sm shrink-0">→</span>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value || undefined })
                }
                className={`filter-date ${inputCls} flex-1 min-w-0 py-2.5 px-3 text-xs cursor-pointer`}
              />
            </div>
          </div>

          {/* ── Keyword ── */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant block">
              Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search description…"
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value || undefined })
                }
                className={`${inputCls} py-3 pl-4 pr-10`}
              />
              {filters.search ? (
                <button
                  onClick={() => setFilters({ ...filters, search: undefined })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : (
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/50 text-[18px]">
                  search
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
