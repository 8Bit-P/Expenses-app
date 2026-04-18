import { useExpenses } from "../../../context/ExpensesContext";
import { useCategories } from "../../../hooks/useCategories";
import type { TransactionType } from "../../../types/expenses";
import { format } from "date-fns";

export default function FilterPanel() {
  const { filters, setFilters } = useExpenses();
  const { categories } = useCategories();

  const handleTypeChange = (type: TransactionType | undefined) => {
    setFilters({ ...filters, type });
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters({ ...filters, categoryId: categoryId === "all" ? undefined : categoryId });
  };

  // Quick-select date presets
  const applyPreset = (preset: "this_month" | "last_month" | "last_3m" | "ytd") => {
    const now = new Date();
    let startDate: string;
    let endDate = format(now, "yyyy-MM-dd");

    if (preset === "this_month") {
      startDate = format(new Date(now.getFullYear(), now.getMonth(), 1), "yyyy-MM-dd");
    } else if (preset === "last_month") {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      startDate = format(first, "yyyy-MM-dd");
      endDate = format(last, "yyyy-MM-dd");
    } else if (preset === "last_3m") {
      const three = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      startDate = format(three, "yyyy-MM-dd");
    } else {
      startDate = format(new Date(now.getFullYear(), 0, 1), "yyyy-MM-dd");
    }

    setFilters({ ...filters, startDate, endDate });
  };

  const hasFilters =
    filters.type || filters.categoryId || filters.search || filters.startDate || filters.endDate;

  return (
    <div className="bg-surface-container-low/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/10 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
          Filter Narrative
        </h4>
        {hasFilters && (
          <button
            onClick={() => setFilters({})}
            className="text-error text-[11px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
            Reset
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Flow Type */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
            Flow Type
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-surface-container-lowest/50 p-1 rounded-xl">
            {(["", "income", "expense"] as const).map((t) => (
              <button
                key={t || "all"}
                onClick={() => handleTypeChange(t === "" ? undefined : t)}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  (!t && !filters.type) || filters.type === t
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                {t === "" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
            Category
          </label>
          <div className="relative">
            <select
              value={filters.categoryId || "all"}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all py-3 px-4 cursor-pointer outline-none text-on-surface"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60 text-[18px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              Date Range
            </label>
            {/* Quick presets */}
            <div className="flex gap-1">
              {(["this_month", "last_month", "last_3m", "ytd"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className="text-[9px] font-bold text-on-surface-variant/50 hover:text-primary transition-colors uppercase tracking-wider px-1 py-0.5 rounded hover:bg-primary/5"
                >
                  {p === "this_month" ? "TM" : p === "last_month" ? "LM" : p === "last_3m" ? "3M" : "YTD"}
                </button>
              ))}
            </div>
          </div>

          {/* Date inputs */}
          <style>{`
            .date-input::-webkit-calendar-picker-indicator {
              opacity: 0.4;
              cursor: pointer;
              filter: invert(1);
            }
          `}</style>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
              className="date-input flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 transition-all py-2.5 px-3 outline-none text-on-surface cursor-pointer"
            />
            <div className="h-0.5 w-3 bg-outline-variant/40 rounded-full shrink-0" />
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
              className="date-input flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 transition-all py-2.5 px-3 outline-none text-on-surface cursor-pointer"
            />
          </div>

          {/* Active range display */}
          {(filters.startDate || filters.endDate) && (
            <p className="text-[10px] text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">filter_alt</span>
              {filters.startDate && filters.endDate
                ? `${filters.startDate} → ${filters.endDate}`
                : filters.startDate
                ? `From ${filters.startDate}`
                : `Until ${filters.endDate}`}
            </p>
          )}
        </div>

        {/* Keyword Search */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
            Keyword
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search description..."
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
              className="w-full bg-surface-container-lowest border border-outline-variant/5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 py-3 px-4 pr-10 outline-none placeholder:text-on-surface-variant/30 text-on-surface"
            />
            {filters.search ? (
              <button
                onClick={() => setFilters({ ...filters, search: undefined })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            ) : (
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/30 text-[18px]">
                search
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
