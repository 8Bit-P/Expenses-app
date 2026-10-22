import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import { cn } from "../../../utils/cn";

interface HeroMetricsProps {
  metrics: {
    totalValue: number;
    totalInvested: number;
    roi: number;
  };
  stealthMode: boolean;
  onToggleStealth: () => void;
}

export default function HeroMetrics({ metrics, stealthMode, onToggleStealth }: HeroMetricsProps) {
  const { t } = useTranslation();
  const { currency } = useUserPreferences();

  const internalFormatCurrency = (val: number) => {
    if (stealthMode) return "••••••";
    return formatCurrency(val, currency.code);
  };

  const isPositiveROI = metrics.roi >= 0;
  const totalGain = metrics.totalValue - metrics.totalInvested;

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl">
      <div className="px-5 sm:px-6 pt-5 pb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{t("investments.metrics.netWorth")}</p>
          <button
            onClick={onToggleStealth}
            className="h-8 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant text-xs font-medium hover:bg-surface-container-low hover:text-on-surface transition-colors inline-flex items-center gap-1.5"
            title={t("investments.metrics.stealthToggle")}
            aria-pressed={stealthMode}
          >
            <span className="material-symbols-outlined text-[16px]">
              {stealthMode ? "visibility_off" : "visibility"}
            </span>
            {stealthMode ? t("investments.metrics.stealthConcealed") : t("investments.metrics.stealthVisible")}
          </button>
        </div>

        <p
          className={cn(
            "mt-3 text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums leading-none break-all sm:break-normal",
            stealthMode ? "text-on-surface-variant select-none" : "text-on-surface",
          )}
        >
          {internalFormatCurrency(metrics.totalValue)}
        </p>
      </div>

      <dl
        className={cn(
          "grid grid-cols-1 border-t border-outline-variant divide-y divide-outline-variant sm:divide-y-0 sm:divide-x",
          stealthMode ? "sm:grid-cols-2" : "sm:grid-cols-3",
        )}
      >
        <div className="px-5 sm:px-6 py-4">
          <dt className="eyebrow">{t("investments.metrics.totalInvested")}</dt>
          <dd className="mt-1 text-lg font-semibold tracking-tight tabular-nums text-on-surface">
            {stealthMode ? "••••" : formatCurrency(metrics.totalInvested, currency.code)}
          </dd>
        </div>

        {!stealthMode && (
          <div className="px-5 sm:px-6 py-4">
            <dt className="eyebrow">
              {isPositiveROI ? t("investments.metrics.totalGain") : t("investments.metrics.totalLoss")}
            </dt>
            <dd
              className={cn(
                "mt-1 text-lg font-semibold tracking-tight tabular-nums",
                isPositiveROI ? "text-secondary" : "text-error",
              )}
            >
              {isPositiveROI ? "+" : ""}
              {formatCurrency(totalGain, currency.code)}
            </dd>
          </div>
        )}

        <div className="px-5 sm:px-6 py-4">
          <dt className="eyebrow">{t("investments.metrics.allTimeROI")}</dt>
          <dd className="mt-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 h-6 px-2 rounded text-sm font-semibold tabular-nums",
                stealthMode
                  ? "bg-surface-container text-on-surface-variant"
                  : isPositiveROI
                    ? "bg-secondary/10 text-secondary"
                    : "bg-error/10 text-error",
              )}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPositiveROI ? "arrow_upward" : "arrow_downward"}
              </span>
              {stealthMode ? "••••" : `${isPositiveROI ? "+" : ""}${metrics.roi.toFixed(1)}%`}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
