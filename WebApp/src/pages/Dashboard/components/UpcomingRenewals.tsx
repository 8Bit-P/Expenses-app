import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { formatCurrency } from "../../../utils/currency";
import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { useMemo } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function UpcomingRenewals() {
  const { t } = useTranslation();
  const { subscriptions, loading } = useSubscriptions();
  const { currency } = useUserPreferences();

  // Get next 3 renewals
  const upcoming = useMemo(() => {
    return [...subscriptions]
      .filter((s) => s.next_billing_date)
      .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
      .slice(0, 3);
  }, [subscriptions]);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[20px]">event_repeat</span>
          {t("dashboard.upcomingRenewals.title")}
        </h2>
        <Link 
          to="/recurring" 
          className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline transition-all"
        >
          {t("dashboard.upcomingRenewals.viewAll")}
        </Link>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-surface-container-low rounded-xl"></div>
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-center py-8 text-xs font-medium text-on-surface-variant italic">
            {t("dashboard.upcomingRenewals.noRenewals")}
          </p>
        ) : (
          upcoming.map((s) => {
            const daysLeft = differenceInDays(startOfDay(parseISO(s.next_billing_date)), startOfDay(new Date()));
            const isCritical = daysLeft <= 3;

            return (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface font-black text-sm shadow-sm overflow-hidden border border-outline-variant/10">
                    <span className="text-lg">{s.category?.emoji || s.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{s.name}</h4>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1 ${
                        isCritical ? "text-error" : "text-on-surface-variant"
                      }`}
                    >
                      {isCritical && <span className="w-1 h-1 bg-error rounded-full animate-pulse"></span>}
                      {daysLeft === 0 
                        ? t("dashboard.upcomingRenewals.dueToday") 
                        : daysLeft === 1 
                          ? t("dashboard.upcomingRenewals.dueTomorrow") 
                          : t("dashboard.upcomingRenewals.dueInDays", { days: daysLeft })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-on-surface">{formatCurrency(s.amount, currency.code)}</p>
                  <p className="text-[9px] uppercase font-black text-on-surface-variant/60 tracking-widest">
                    {s.billing_cycle}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
