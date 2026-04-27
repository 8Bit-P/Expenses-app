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
    <div className={`fixed inset-0 z-40 overflow-hidden ${isFilterOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop — only rendered when open */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Slide-over panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-surface-container-low shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <h2 className="text-base font-black text-on-surface uppercase tracking-widest">
              {t("expenses.filter.title")}
            </h2>
            {activeCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto p-5">
          <FilterPanel />
        </div>

        {/* Apply footer */}
        <div className="px-5 py-4 border-t border-outline-variant/10 shrink-0">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full py-3 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 active:scale-98 transition-all"
          >
            {t("expenses.filter.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
