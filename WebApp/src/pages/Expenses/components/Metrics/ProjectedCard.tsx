import { useTranslation } from "react-i18next";
import { CardWrapper } from "./CardWrapper";

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
    <CardWrapper className="relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
        </div>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          {t("expenses.metrics.projectedSpend")}
        </span>
      </div>
      <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">{formattedAmount}</h2>
      <div className="mt-2 flex items-center gap-2">
        {isRunningHot ? (
          <span className="text-xs font-black text-red-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            {t("expenses.metrics.runningHot")}
          </span>
        ) : (
          <span className="text-xs font-black text-green-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {t("expenses.metrics.onTrack")}
          </span>
        )}
      </div>
      <p className="text-xs font-bold text-on-surface-variant mt-3 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px]">speed</span>
        {t("expenses.metrics.dailyAvg", { amount: formattedDailyAverage })} ·{" "}
        {t("expenses.metrics.daysElapsed", { elapsed: daysElapsed, total: totalPeriodDays })}
      </p>
    </CardWrapper>
  );
}
