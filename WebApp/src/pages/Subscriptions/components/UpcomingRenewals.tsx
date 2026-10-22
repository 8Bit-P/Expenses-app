import type { Subscription } from "../../../types/expenses";
import { format, parseISO, isSameDay, isTomorrow, isThisWeek } from "date-fns";
import { useTranslation } from "react-i18next";
import { es, enUS } from "date-fns/locale";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import Panel from "../../../components/ui/Panel";
import { cn } from "../../../utils/cn";

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
    <Panel title={t("subscriptions.upcoming.title")} flush>
      <div className="border-t border-outline-variant px-5 py-3">
        {upcoming.length > 0 ? (
          <ol className="relative before:absolute before:left-[3px] before:top-4 before:bottom-4 before:w-px before:bg-outline-variant">
            {upcoming.map((s) => {
              const isToday = isSameDay(parseISO(s.next_billing_date), new Date());
              return (
                <li key={s.id} className="relative flex items-center justify-between gap-4 pl-5 py-2.5">
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full ring-2 ring-surface-container-lowest",
                      isToday ? "bg-primary" : "bg-outline",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{s.name}</p>
                    <p className={cn("text-xs", isToday ? "text-primary font-medium" : "text-on-surface-variant")}>
                      {getDayLabel(s.next_billing_date)}
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums text-on-surface shrink-0">
                    {formatCurrency(Number(s.amount), currency.code)}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="py-6 text-center text-[13px] text-on-surface-variant">
            {t("subscriptions.upcoming.noRenewals")}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-t border-outline-variant bg-surface-container-low rounded-b-2xl">
        <span className="eyebrow">{t("subscriptions.upcoming.totalThisWeek")}</span>
        <span className="text-lg font-semibold tracking-tight tabular-nums text-on-surface">
          {formatCurrency(totalThisWeek, currency.code)}
        </span>
      </div>
    </Panel>
  );
}
