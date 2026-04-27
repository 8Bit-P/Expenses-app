import type { Subscription } from "../../../types/expenses";
import { format, parseISO, isSameDay, isTomorrow, isThisWeek } from "date-fns";
import { useTranslation } from "react-i18next";
import { es, enUS } from "date-fns/locale";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
}

export default function UpcomingRenewals({ subscriptions }: UpcomingRenewalsProps) {
  const { t, i18n } = useTranslation();
  const { currency } = useUserPreferences();

  const dateLocale = i18n.language === "es" ? es : enUS;

  // Sort and filter active renewals
  const upcoming = [...subscriptions]
    .filter((s) => s.status === "active")
    .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
    .slice(0, 5); // Just show next 5

  const getDayLabel = (dateStr: string) => {
    const d = parseISO(dateStr);
    if (isSameDay(d, new Date())) return t("subscriptions.upcoming.today");
    if (isTomorrow(d)) return t("subscriptions.upcoming.tomorrow");
    if (isThisWeek(d)) return format(d, "EEEE", { locale: dateLocale });
    return format(d, "MMM d, yyyy", { locale: dateLocale });
  };

  const totalThisWeek = upcoming
    .filter((s) => isThisWeek(parseISO(s.next_billing_date)))
    .reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <div className="bg-surface-container-lowest/50 backdrop-blur-xl p-8 rounded-xl shadow-sm border border-outline-variant/10 h-fit sticky top-24">
      <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-on-surface font-headline tracking-tight">
        <span className="material-symbols-outlined text-primary">schedule</span>
        {t("subscriptions.upcoming.title")}
      </h2>

      <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/20">
        {upcoming.length > 0 ? (
          upcoming.map((s) => {
            const isToday = isSameDay(parseISO(s.next_billing_date), new Date());
            return (
              <div key={s.id} className="relative pl-10 group cursor-pointer">
                {/* Dot */}
                <div
                  className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm ring-2 ${
                    isToday ? "bg-primary ring-primary/20" : "bg-outline-variant/30 ring-transparent"
                  } transition-all group-hover:scale-110`}
                />

                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {s.name}
                    </p>
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-0.5">
                      {getDayLabel(s.next_billing_date)}
                    </p>
                  </div>
                  <span
                    className={`font-black text-sm shrink-0 ${isToday ? "text-primary" : "text-on-surface-variant"}`}
                  >
                    {formatCurrency(Number(s.amount), currency.code)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="pl-10 text-xs font-bold text-on-surface-variant/40 italic">
            {t("subscriptions.upcoming.noRenewals")}
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-surface-container/30 rounded-2xl border border-dashed border-outline-variant/50">
        <p className="text-[10px] font-black uppercase tracking-widest text-center text-on-surface-variant/60">
          {t("subscriptions.upcoming.totalThisWeek")}
        </p>
        <p className="text-3xl font-black text-center mt-2 text-primary font-headline tracking-tighter">
          {formatCurrency(totalThisWeek, currency.code)}
        </p>
      </div>

    </div>
  );
}
