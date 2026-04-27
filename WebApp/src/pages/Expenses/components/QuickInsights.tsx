import { useQuickInsights } from "../hooks/useQuickInsights";
import { formatDateLabel } from "../../../utils/dateFormatters";
import { useTranslation } from "react-i18next";

export default function QuickInsights() {
  const { t } = useTranslation();
  const { insights, loading, filters } = useQuickInsights();

  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-surface-container rounded-lg w-1/3" />
              <div className="h-4 bg-surface-container rounded-lg w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-outline-variant/10 bg-surface-container-low/40">
        <h4 className="text-sm font-black uppercase tracking-[0.15em] text-on-surface flex items-center gap-2 font-headline">
          <span className="material-symbols-outlined text-primary text-[18px] font-headline">bolt</span>
          {t("expenses.quickInsights.title")}
        </h4>
        <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
          {formatDateLabel(filters.startDate, filters.endDate)}
        </p>
      </div>

      {/* Insights list */}
      <div className="flex-1 divide-y divide-outline-variant/10">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-low/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${insight.iconColor}`}>
              <span className="material-symbols-outlined text-[18px]">{insight.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                {insight.label}
              </p>
              <p
                className={`text-sm font-black truncate mt-0.5 font-headline ${
                  insight.highlight === "positive"
                    ? "text-green-500"
                    : insight.highlight === "negative"
                      ? "text-red-400"
                      : "text-on-surface"
                }`}
              >
                {insight.value}
              </p>
              {insight.sub && (
                <p className="text-[11px] text-on-surface-variant/60 font-medium mt-0.5 truncate">{insight.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
