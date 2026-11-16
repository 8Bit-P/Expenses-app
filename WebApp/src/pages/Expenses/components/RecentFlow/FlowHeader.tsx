import { useTranslation } from "react-i18next";

interface FlowHeaderProps {
  totalCount: number;
  loading: boolean;
  onAddNew: () => void;
}

export default function FlowHeader({ totalCount, loading, onAddNew }: FlowHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-outline-variant">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-on-surface leading-6">{t("expenses.recentFlow.title")}</h2>
        {!loading && totalCount > 0 && (
          <p className="text-xs text-on-surface-variant mt-0.5 tabular-nums">
            {t("expenses.recentFlow.movements", { count: totalCount })}
          </p>
        )}
      </div>

      <button
        onClick={onAddNew}
        className="h-9 pl-2.5 pr-3.5 rounded-lg bg-accent text-on-accent text-sm font-medium inline-flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        {t("expenses.recentFlow.entry")}
      </button>
    </header>
  );
}
