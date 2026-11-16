import { useTranslation } from "react-i18next";
import FilterPanel from "./FilterPanel";
import { useExpenses } from "../../../context/ExpensesContext";

export default function FilterDrawer() {
  const { t } = useTranslation();
  const { isFilterOpen, setIsFilterOpen, filters } = useExpenses();

  const activeCount = [filters.type, filters.categoryId].filter(Boolean).length;

  return (
    /**
     * Outer container: fixed inset-0 overflow-hidden
     * This clips the sliding panel so it NEVER causes horizontal page scroll,
     * even when partially off-screen (translate-x-full).
     * pointer-events-none when closed so the invisible area doesn't block clicks.
     */
    <div
      className={`fixed inset-0 z-40 overflow-hidden ${isFilterOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop — only rendered when open */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Slide-over panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-outline-variant shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-on-surface">{t("expenses.filter.title")}</h2>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-on-surface text-surface-container-lowest text-[11px] font-medium tabular-nums">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto">
          <FilterPanel />
        </div>

        {/* Apply footer */}
        <div className="px-5 py-4 border-t border-outline-variant shrink-0">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full h-10 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
          >
            {t("expenses.filter.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
