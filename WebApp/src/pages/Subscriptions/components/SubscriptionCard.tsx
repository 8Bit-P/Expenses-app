import type { Subscription } from "../../../types/expenses";
import { format, parseISO } from "date-fns";
import { useUserPreferences } from "../../../context/UserPreferencesContext";

interface SubscriptionCardProps {
  subscription: Subscription;
  onManage: (s: Subscription) => void;
}

export default function SubscriptionCard({ subscription, onManage }: SubscriptionCardProps) {
  const { currency } = useUserPreferences();

  const fmt = (n: number) =>
    `${currency.symbol}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const nextDate = parseISO(subscription.next_billing_date);

  return (
    <div className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10 flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        {/* Logo/Icon Wrapper */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden bg-primary/10 text-primary"
          style={subscription.color ? { backgroundColor: `${subscription.color}20`, color: subscription.color } : {}}
        >
          {subscription.icon ? (
            <span className="text-2xl select-none">{subscription.icon}</span>
          ) : (
            <span className="material-symbols-outlined text-[24px]">event_repeat</span>
          )}
        </div>

        <div className="text-right">
          <span className="block text-2xl font-black text-on-surface font-headline tracking-tight">
            {fmt(Number(subscription.amount))}
          </span>
          <span className="text-[10px] uppercase font-black text-on-surface-variant/60 tracking-widest whitespace-nowrap">
            / {subscription.billing_cycle}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-extrabold text-on-surface mb-1 group-hover:text-primary transition-colors">
        {subscription.name}
      </h3>

      <p className="text-xs font-bold text-on-surface-variant/60 mb-2 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px]">event</span>
        Renewal: {format(nextDate, "MMM d, yyyy")}
      </p>

      {subscription.category && (
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 flex items-center gap-1.5 mb-6">
          <span className="text-[12px]">{subscription.category.emoji}</span>
          {subscription.category.name}
        </p>
      )}

      <div className="mt-auto pt-2">
        <button
          onClick={() => onManage(subscription)}
          className="w-full bg-surface-container hover:bg-primary hover:text-white text-on-surface font-black py-3 rounded-xl transition-all duration-300 active:scale-95 text-xs uppercase tracking-widest"
        >
          Manage
        </button>
      </div>
    </div>
  );
}
