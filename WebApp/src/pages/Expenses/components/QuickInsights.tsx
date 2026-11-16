import { useQuickInsights } from "../hooks/useQuickInsights";
import { formatDateLabel } from "../../../utils/dateFormatters";
import { useTranslation } from "react-i18next";
import Panel from "../../../components/ui/Panel";
import { cn } from "../../../utils/cn";

export default function QuickInsights() {
  const { t } = useTranslation();
  const { insights, loading, filters } = useQuickInsights();

  if (loading) {
    return (
      <Panel className="h-full" flush>
        <div className="divide-y divide-outline-variant">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-surface-container shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface-container rounded-lg w-1/3" />
                <div className="h-4 bg-surface-container rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      className="h-full"
      title={t("expenses.quickInsights.title")}
      subtitle={formatDateLabel(filters.startDate, filters.endDate)}
      flush
    >
      <div className="divide-y divide-outline-variant border-t border-outline-variant">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3.5">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", insight.iconColor)}>
              <span className="material-symbols-outlined text-[18px]">{insight.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow">{insight.label}</p>
              <p
                className={cn(
                  "text-sm font-semibold truncate mt-0.5 tabular-nums",
                  insight.highlight === "positive"
                    ? "text-secondary"
                    : insight.highlight === "negative"
                      ? "text-error"
                      : "text-on-surface",
                )}
              >
                {insight.value}
              </p>
              {insight.sub && <p className="text-xs text-on-surface-variant mt-0.5 truncate">{insight.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
