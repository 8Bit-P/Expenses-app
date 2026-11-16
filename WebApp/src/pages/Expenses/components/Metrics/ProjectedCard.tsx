import { useTranslation } from "react-i18next";
import { CardWrapper, CardLabel } from "./CardWrapper";

export function ProjectedCard({
  isRunningHot,
  daysElapsed,
  totalPeriodDays,
  formattedAmount,
  formattedDailyAverage,
}: {
  amount: number;
  isRunningHot: boolean;
  dailyAverage: number;
  daysElapsed: number;
  totalPeriodDays: number;
  formattedAmount: string;
  formattedDailyAverage: string;
}) {
  const { t } = useTranslation();

  return (
    <CardWrapper>
      <CardLabel label={t("expenses.metrics.projectedSpend")} icon="trending_up" />
      <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight tabular-nums text-on-surface truncate">
        {formattedAmount}
      </p>
      <div className="mt-1.5 min-h-5">
        {isRunningHot ? (
          <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[11px] font-medium bg-error/10 text-error">
            <span className="material-symbols-outlined text-[13px]">warning</span>
            {t("expenses.metrics.runningHot")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[11px] font-medium bg-secondary/10 text-secondary">
            <span className="material-symbols-outlined text-[13px]">check</span>
            {t("expenses.metrics.onTrack")}
          </span>
        )}
      </div>
      <div className="mt-auto pt-4 space-y-0.5 text-xs text-on-surface-variant">
        <p className="tabular-nums truncate">{t("expenses.metrics.dailyAvg", { amount: formattedDailyAverage })}</p>
        <p className="tabular-nums truncate">
          {t("expenses.metrics.daysElapsed", { elapsed: daysElapsed, total: totalPeriodDays })}
        </p>
      </div>
    </CardWrapper>
  );
}
