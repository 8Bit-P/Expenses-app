import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { formatCurrency } from "../../../utils/currency";
import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { useMemo } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { Link } from "react-router-dom";
import Panel from "../../../components/ui/Panel";

import { useTranslation } from "react-i18next";

export default function UpcomingRenewals() {
  const { t, i18n } = useTranslation();
  const { subscriptions, loading } = useSubscriptions();
  const { currency } = useUserPreferences();

  // Get next 3 renewals
  const upcoming = useMemo(() => {
    return [...subscriptions]
      .filter((s) => s.next_billing_date)
      .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
      .slice(0, 3);
  }, [subscriptions]);

  const monthFmt = new Intl.DateTimeFormat(i18n.language, { month: "short" });

  return (
    <Panel
      flush
      title={t("dashboard.upcomingRenewals.title")}
      actions={
        <Link
          to="/recurring"
          className="text-xs font-medium text-on-surface-variant hover:text-on-surface inline-flex items-center gap-0.5"
        >
          {t("dashboard.upcomingRenewals.viewAll")}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      }
    >
      {loading ? (
        <div className="px-5 pb-5 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-surface-container rounded-lg animate-pulse" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <p className="px-5 pb-8 pt-4 text-center text-sm text-on-surface-variant">
          {t("dashboard.upcomingRenewals.noRenewals")}
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant border-t border-outline-variant">
          {upcoming.map((s) => {
            const billingDate = parseISO(s.next_billing_date);
            const daysLeft = differenceInDays(startOfDay(billingDate), startOfDay(new Date()));
            const isCritical = daysLeft <= 3;

            return (
              <li key={s.id} className="flex items-center gap-3 px-5 h-16 hover:bg-surface-container-low transition-colors">
                {/* Calendar tile */}
                <span
                  className={`w-10 h-11 rounded-lg border flex flex-col items-center justify-center shrink-0 leading-none ${
                    isCritical ? "border-error/40 bg-error/5" : "border-outline-variant bg-surface-container-low"
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase font-medium ${isCritical ? "text-error" : "text-on-surface-variant"}`}
                  >
                    {monthFmt.format(billingDate).replace(".", "")}
                  </span>
                  <span className="text-[15px] font-semibold text-on-surface tabular-nums mt-0.5">
                    {billingDate.getDate()}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-on-surface truncate">
                    <span className="mr-1.5">{s.category?.emoji || ""}</span>
                    {s.name}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${isCritical ? "text-error font-medium" : "text-on-surface-variant"}`}>
                    {daysLeft === 0
                      ? t("dashboard.upcomingRenewals.dueToday")
                      : daysLeft === 1
                        ? t("dashboard.upcomingRenewals.dueTomorrow")
                        : t("dashboard.upcomingRenewals.dueInDays", { days: daysLeft })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-medium text-on-surface tabular-nums">
                    {formatCurrency(s.amount, currency.code)}
                  </p>
                  <p className="text-[11px] text-on-surface-variant capitalize">{s.billing_cycle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
