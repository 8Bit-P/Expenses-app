import { useTranslation } from "react-i18next";
import { CardWrapper, CardLabel } from "./CardWrapper";

export function TopCategoryCard({
  category,
  percent,
  formattedAmount,
}: {
  category: { name: string; emoji: string | null; amount: number } | null;
  percent: number;
  formattedAmount: string;
}) {
  const { t } = useTranslation();

  return (
    <CardWrapper>
      <CardLabel label={t("expenses.metrics.topCategory")} icon="pie_chart" />
      {category ? (
        <>
          <p className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-on-surface flex items-center gap-2 min-w-0">
            {category.emoji && <span className="shrink-0">{category.emoji}</span>}
            <span className="truncate">{category.name}</span>
          </p>
          <div className="mt-auto pt-4 space-y-1.5">
            <div className="flex justify-between gap-2 text-xs">
              <span className="font-medium text-on-surface tabular-nums">{formattedAmount}</span>
              <span className="text-on-surface-variant tabular-nums">
                {percent.toFixed(0)}% {t("expenses.metrics.ofTotal", { percent: percent.toFixed(0) })}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-tertiary" style={{ width: `${Math.min(100, percent)}%` }} />
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-on-surface-variant mt-3">{t("expenses.metrics.noExpenseData")}</p>
      )}
    </CardWrapper>
  );
}
