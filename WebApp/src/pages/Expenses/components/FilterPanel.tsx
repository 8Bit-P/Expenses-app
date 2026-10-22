import { useTranslation } from "react-i18next";
import { useExpenses } from "../../../context/ExpensesContext";
import { useCategories } from "../../../hooks/useCategories";
import type { TransactionType } from "../../../types/expenses";
import { DEFAULT_FILTERS } from "../constants";
import { PRESETS, buildPreset, type PresetKey } from "../../../utils/filterPresets";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import { cn } from "../../../utils/cn";

export default function FilterPanel() {
  const { t } = useTranslation();
  const { filters, setFilters } = useExpenses();
  const { categories } = useCategories();

  const handleTypeChange = (type: TransactionType | undefined) => setFilters({ ...filters, type });

  const handleCategoryChange = (categoryId: string) =>
    setFilters({ ...filters, categoryId: categoryId === "all" ? undefined : categoryId });

  const applyPreset = (preset: PresetKey) => setFilters({ ...filters, ...buildPreset(preset) });

  const isDirty =
    filters.type ||
    filters.categoryId ||
    filters.startDate !== DEFAULT_FILTERS.startDate ||
    filters.endDate !== DEFAULT_FILTERS.endDate;

  const inputCls =
    "h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface focus:border-on-surface focus:ring-0 focus:outline-none transition-colors";

  return (
    <>
      <style>{`
        .filter-date::-webkit-calendar-picker-indicator { opacity: 0.6; cursor: pointer; }
      `}</style>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container-low">
          <h4 className="eyebrow">{t("expenses.filter.narrative")}</h4>
          {isDirty && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              {t("expenses.filter.reset")}
            </button>
          )}
        </div>

        <div className="divide-y divide-outline-variant">
          {/* Flow Type */}
          <div className="px-5 py-5 space-y-2.5">
            <label className="eyebrow block">{t("expenses.filter.type")}</label>
            <div className="grid grid-cols-3 p-0.5 rounded-lg bg-surface-container border border-outline-variant">
              {(["all", "income", "expense"] as const).map((tKey) => {
                const active = tKey === "all" ? !filters.type : filters.type === tKey;
                return (
                  <button
                    key={tKey}
                    onClick={() => handleTypeChange(tKey === "all" ? undefined : tKey)}
                    className={cn(
                      "h-8 rounded-md text-xs font-medium transition-colors",
                      active
                        ? "bg-surface-container-lowest text-on-surface shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    {t(`expenses.filter.types.${tKey}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="px-5 py-5 space-y-2.5">
            <label className="eyebrow block">{t("expenses.filter.category")}</label>
            <CustomSelect
              value={filters.categoryId || "all"}
              options={[
                { value: "all", label: t("expenses.filter.allCategories") },
                ...categories.map((cat) => ({ value: cat.id, label: `${cat.emoji ?? ""} ${cat.name}` })),
              ]}
              onChange={(v) => handleCategoryChange(v)}
              className="w-full"
            />
          </div>

          {/* Date Range */}
          <div className="px-5 py-5 space-y-3">
            <label className="eyebrow block">{t("expenses.filter.dateRange")}</label>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => {
                const dates = buildPreset(p.key);
                const isActive = filters.startDate === dates.startDate && filters.endDate === dates.endDate;
                return (
                  <button
                    key={p.key}
                    onClick={() => applyPreset(p.key)}
                    className={cn(
                      "h-8 px-2.5 rounded-md text-xs font-medium border transition-colors",
                      isActive
                        ? "bg-on-surface text-surface-container-lowest border-on-surface"
                        : "bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container-low",
                    )}
                  >
                    {t(`expenses.presets.${p.key}`)}
                  </button>
                );
              })}
            </div>

            {/* Manual date inputs */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                className={`filter-date ${inputCls} flex-1 min-w-0 cursor-pointer tabular-nums`}
              />
              <span className="text-outline text-sm shrink-0">→</span>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                className={`filter-date ${inputCls} flex-1 min-w-0 cursor-pointer tabular-nums`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
