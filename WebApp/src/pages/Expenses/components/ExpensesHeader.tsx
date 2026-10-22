import { useTranslation } from "react-i18next";
import { useExpenses } from "../../../context/ExpensesContext";
import { formatDateLabel } from "../../../utils/dateFormatters";
import { PRESETS, buildPreset } from "../../../utils/filterPresets";
import PageHeader from "../../../components/ui/PageHeader";
import { cn } from "../../../utils/cn";

export default function ExpensesHeader() {
  const { t } = useTranslation();
  const { filters, setFilters, setIsFilterOpen } = useExpenses();

  const dateLabel = formatDateLabel(filters.startDate, filters.endDate);
  const activeCount = [filters.type, filters.categoryId].filter(Boolean).length;

  const applyPreset = (key: (typeof PRESETS)[number]["key"]) => {
    setFilters({ ...filters, ...buildPreset(key) });
  };

  const isPresetActive = (key: (typeof PRESETS)[number]["key"]) => {
    const d = buildPreset(key);
    return filters.startDate === d.startDate && filters.endDate === d.endDate;
  };

  return (
    <PageHeader
      title={t("expenses.header.title")}
      description={
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          title={t("expenses.header.filterTooltip")}
        >
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span className="tabular-nums">{dateLabel}</span>
        </button>
      }
      actions={
        <>
          {/* Date presets — segmented control */}
          <div className="max-w-full overflow-x-auto hide-scrollbar">
            <div
              role="tablist"
              className="inline-flex p-0.5 rounded-lg bg-surface-container border border-outline-variant"
            >
              {PRESETS.map((p) => {
                const active = isPresetActive(p.key);
                return (
                  <button
                    key={p.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => applyPreset(p.key)}
                    className={cn(
                      "px-3 h-8 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                      active
                        ? "bg-surface-container-lowest text-on-surface shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    {t(`expenses.presets.${p.key}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            title={t("expenses.header.filterTooltip")}
            className="h-9 px-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            {t("expenses.header.filterTooltip")}
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded bg-on-surface text-surface-container-lowest text-[11px] font-medium tabular-nums">
                {activeCount}
              </span>
            )}
          </button>
        </>
      }
    />
  );
}
