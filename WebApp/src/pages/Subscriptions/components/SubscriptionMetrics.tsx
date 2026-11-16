import { useTranslation } from "react-i18next";
import { es, enUS } from "date-fns/locale";
import type { Subscription } from "../../../types/expenses";
import { isSameDay, parseISO, formatDistanceToNowStrict } from "date-fns";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

interface SubscriptionMetricsProps {
  subscriptions: Subscription[];
  loading: boolean;
}

const stripClass =
  "grid grid-cols-1 sm:grid-cols-3 bg-surface-container-lowest border border-outline-variant rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-outline-variant";

export default function SubscriptionMetrics({ subscriptions, loading }: SubscriptionMetricsProps) {
  const { t, i18n } = useTranslation();
  const { currency } = useUserPreferences();

  const dateLocale = i18n.language === "es" ? es : enUS;

  if (loading) {
    return (
      <div className={stripClass}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-5 py-4 space-y-3">
            <div className="h-3 w-28 animate-pulse bg-surface-container rounded-lg" />
            <div className="h-7 w-36 animate-pulse bg-surface-container rounded-lg" />
            <div className="h-3 w-24 animate-pulse bg-surface-container rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate metrics
  const activeSubs = subscriptions.filter((s) => s.status === "active");

  const totalMonthlySpend = activeSubs.reduce((sum, s) => {
    let amount = Number(s.amount);
    if (s.billing_cycle === "yearly") amount /= 12;
    if (s.billing_cycle === "quarterly") amount /= 3;
    if (s.billing_cycle === "weekly") amount *= 4.33;
    return sum + amount;
  }, 0);

  // Find next renewal
  const sortedByDate = [...activeSubs].sort(
    (a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime(),
  );
  const nextRenewal = sortedByDate[0];
  const inactiveCount = subscriptions.length - activeSubs.length;

  return (
    <div className={stripClass}>
      {/* 1. Monthly Spend */}
      <div className="px-5 py-4 min-w-0">
        <p className="eyebrow">{t("subscriptions.metrics.burnRate")}</p>
        <p className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums text-on-surface mt-1.5">
          {formatCurrency(totalMonthlySpend, currency.code)}
        </p>
        <p className="text-xs text-on-surface-variant mt-1">{t("subscriptions.metrics.normalized")}</p>
      </div>

      {/* 2. Active Count */}
      <div className="px-5 py-4 min-w-0">
        <p className="eyebrow">{t("subscriptions.metrics.active")}</p>
        <p className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums text-on-surface mt-1.5">
          {activeSubs.length}
        </p>
        <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
          <span>{t("subscriptions.metrics.total", { count: subscriptions.length })}</span>
          <span className="text-outline">·</span>
          <span className={inactiveCount > 0 ? "text-error" : undefined}>
            {t("subscriptions.metrics.inactive", { count: inactiveCount })}
          </span>
        </p>
      </div>

      {/* 3. Next Up */}
      <div className="px-5 py-4 min-w-0">
        <p className="eyebrow">{t("subscriptions.metrics.nextCharge")}</p>
        {nextRenewal ? (
          <>
            <div className="flex items-baseline gap-2 mt-1.5 min-w-0">
              <span className="text-2xl md:text-3xl font-semibold tracking-tight text-on-surface truncate">
                {nextRenewal.name}
              </span>
              <span className="text-sm font-medium tabular-nums text-on-surface-variant shrink-0">
                {formatCurrency(Number(nextRenewal.amount), currency.code)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[11px] font-medium bg-tertiary/10 text-tertiary mt-1">
              {isSameDay(parseISO(nextRenewal.next_billing_date), new Date())
                ? t("subscriptions.metrics.dueToday")
                : t("subscriptions.metrics.dueIn", {
                    time: formatDistanceToNowStrict(parseISO(nextRenewal.next_billing_date), { locale: dateLocale }),
                  })}
            </span>
          </>
        ) : (
          <>
            <p className="text-2xl md:text-3xl font-semibold tracking-tight text-on-surface-variant mt-1.5">
              {t("subscriptions.metrics.noUpcoming")}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">{t("subscriptions.metrics.vaultClear")}</p>
          </>
        )}
      </div>
    </div>
  );
}
