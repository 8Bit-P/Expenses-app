import { useTranslation } from "react-i18next";
import { CardWrapper } from "./CardWrapper";
import { DeltaBadge } from "./DeltaBadge";

export function SpendCard({
  deltaPct,
  pacePct,
  actualVsProjected,
  spendRatio,
  formattedAmount,
}: {
  amount: number;
  deltaPct: number | null;
  pacePct: number;
  actualVsProjected: number;
  spendRatio: string;
  formattedAmount: string;
  isRunningHot: boolean;
}) {
  const { t } = useTranslation();

  return (
    <CardWrapper>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">payments</span>
        </div>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          {t("expenses.metrics.totalSpend")}
        </span>
      </div>
      <div>
        <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">{formattedAmount}</h2>
        <div className="mt-2 flex items-center gap-2">
          <DeltaBadge pct={deltaPct} />
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
          <span>{t("expenses.metrics.periodProgress")}</span>
          <span>{pacePct.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${actualVsProjected > 100 ? "bg-red-400" : "bg-primary"}`}
            style={{ width: `${Math.min(100, actualVsProjected)}%` }}
          />
        </div>
        <p className="text-[10px] text-on-surface-variant/50 font-medium">
          {t("expenses.metrics.spentOfProjected", { ratio: spendRatio })}
        </p>
      </div>
    </CardWrapper>
  );
}
