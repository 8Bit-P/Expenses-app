import type { Subscription } from "../../../types/expenses";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { es, enUS } from "date-fns/locale";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

interface SubscriptionCardProps {
  subscription: Subscription;
  onManage: (s: Subscription) => void;
  variant?: "grid" | "list";
}

export default function SubscriptionCard({ subscription, onManage, variant = "list" }: SubscriptionCardProps) {
  const { t, i18n } = useTranslation();
  const { currency } = useUserPreferences();
  const nextDate = parseISO(subscription.next_billing_date);

  const dateLocale = i18n.language === "es" ? es : enUS;
  const isGrid = variant === "grid";

  const cycleSuffix =
    subscription.billing_cycle === "monthly"
      ? t("subscriptions.card.monthly")
      : subscription.billing_cycle === "yearly"
        ? t("subscriptions.card.yearly")
        : `/${subscription.billing_cycle.slice(0, 3)}`;

  const cycleLabel =
    subscription.billing_cycle === "monthly"
      ? t("subscriptions.modal.cycles.monthly")
      : subscription.billing_cycle === "yearly"
        ? t("subscriptions.modal.cycles.yearly")
        : subscription.billing_cycle.charAt(0).toUpperCase() + subscription.billing_cycle.slice(1);

  const amount = formatCurrency(Number(subscription.amount), currency.code);

  const icon = (
    <div className="w-9 h-9 rounded-lg bg-surface-container shrink-0 flex items-center justify-center text-on-surface-variant">
      {subscription.category?.emoji ? (
        <span className="text-lg leading-none select-none">{subscription.category.emoji}</span>
      ) : (
        <span className="material-symbols-outlined text-[18px]">event_repeat</span>
      )}
    </div>
  );

  if (isGrid) {
    return (
      <button
        type="button"
        onClick={() => onManage(subscription)}
        className="group w-full text-left p-4 rounded-lg border border-outline-variant bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low transition-colors flex flex-col gap-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon}
          <div className="min-w-0">
            <p className="text-sm font-medium text-on-surface truncate">{subscription.name}</p>
            {subscription.category && (
              <p className="text-xs text-on-surface-variant truncate">{subscription.category.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-end justify-between gap-3 pt-3 border-t border-outline-variant">
          <span className="text-xs text-on-surface-variant">{format(nextDate, "MMM d", { locale: dateLocale })}</span>
          <span className="text-base font-semibold tracking-tight tabular-nums text-on-surface">
            {amount}
            <span className="text-xs font-normal text-on-surface-variant ml-0.5">{cycleSuffix}</span>
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onManage(subscription)}
      className="group w-full text-left flex md:grid md:grid-cols-[36px_minmax(0,1fr)_100px_120px_120px] items-center gap-3 md:gap-x-4 px-5 h-14 hover:bg-surface-container-low transition-colors"
    >
      {icon}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface truncate">{subscription.name}</p>
        <p className="text-xs text-on-surface-variant truncate">
          {subscription.category?.name}
          <span className="md:hidden">
            {subscription.category && " · "}
            {format(nextDate, "MMM d", { locale: dateLocale })}
          </span>
        </p>
      </div>

      <span className="hidden md:block text-[13px] text-on-surface-variant">{cycleLabel}</span>

      <span className="hidden md:block text-[13px] text-on-surface-variant tabular-nums">
        {format(nextDate, "MMM d, yyyy", { locale: dateLocale })}
      </span>

      <div className="text-right shrink-0">
        <span className="text-sm font-medium tabular-nums text-on-surface">{amount}</span>
        <span className="md:hidden block text-[11px] text-on-surface-variant">{cycleSuffix}</span>
      </div>
    </button>
  );
}
