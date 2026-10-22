import { useTranslation } from "react-i18next";
import { CardWrapper, CardLabel } from "./CardWrapper";
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
      <CardLabel label={t("expenses.metrics.totalSpend")} icon="payments" />
      <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight tabular-nums text-on-surface truncate">
        {formattedAmount}
      </p>
      <div className="mt-1.5 min-h-5">
        <DeltaBadge pct={deltaPct} />
      </div>
      <div className="mt-auto pt-4 space-y-1.5">
        <div className="flex justify-between gap-2 text-xs text-on-surface-variant">
          <span className="truncate">{t("expenses.metrics.periodProgress")}</span>
          <span className="tabular-nums">{pacePct.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${actualVsProjected > 100 ? "bg-error" : "bg-primary"}`}
            style={{ width: `${Math.min(100, actualVsProjected)}%` }}
          />
        </div>
        <p className="text-xs text-on-surface-variant truncate">
          {t("expenses.metrics.spentOfProjected", { ratio: spendRatio })}
        </p>
      </div>
    </CardWrapper>
  );
}
