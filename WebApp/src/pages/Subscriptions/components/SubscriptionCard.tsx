import type { Subscription } from "../../../types/expenses";
import { format, parseISO } from "date-fns";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

interface SubscriptionCardProps {
  subscription: Subscription;
  onManage: (s: Subscription) => void;
  variant?: "grid" | "list";
}

export default function SubscriptionCard({ subscription, onManage, variant = "list" }: SubscriptionCardProps) {
  const { currency } = useUserPreferences();
  const nextDate = parseISO(subscription.next_billing_date);

  const isGrid = variant === "grid";

  return (
    <div
      onClick={() => onManage(subscription)}
      className={`group bg-surface-container-lowest transition-all duration-300 border border-outline-variant/5 cursor-pointer active:scale-[0.99] shadow-sm hover:shadow-md ${
        isGrid
          ? "p-8 rounded-3xl flex flex-col gap-6 h-full text-center items-center"
          : "p-4 rounded-2xl flex flex-row items-center gap-4"
      }`}
    >
      {/* 1. Icon Container */}
      <div
        className={`shrink-0 flex items-center justify-center overflow-hidden bg-primary/10 text-primary ${
          isGrid ? "w-16 h-16 rounded-2xl" : "w-12 h-12 rounded-xl"
        }`}
      >
        {subscription.category?.emoji ? (
          <span className={`${isGrid ? "text-3xl" : "text-xl"} select-none`}>{subscription.category.emoji}</span>
        ) : (
          <span className="material-symbols-outlined" style={{ fontSize: isGrid ? "32px" : "20px" }}>
            event_repeat
          </span>
        )}
      </div>

      {/* 2. Content */}
      <div className={`flex-1 min-w-0 ${isGrid ? "w-full" : ""}`}>
        <h3
          className={`font-black text-on-surface truncate group-hover:text-primary transition-colors ${
            isGrid ? "text-xl mb-1" : "text-sm"
          }`}
        >
          {subscription.name}
        </h3>
        <div className={`flex items-center gap-1.5 mt-0.5 ${isGrid ? "justify-center" : ""}`}>
          {subscription.category && (
            <span className={`${isGrid ? "text-sm" : "text-[11px]"} font-bold text-on-surface-variant/70 truncate`}>
              {subscription.category.emoji} {subscription.category.name}
            </span>
          )}
          <span className="text-on-surface-variant/30 text-[10px]">•</span>
          <span className={`${isGrid ? "text-sm" : "text-[11px]"} font-bold text-on-surface-variant/50`}>
            {format(nextDate, "MMM d")}
          </span>
        </div>
      </div>

      {/* 3. Price & Cycle */}
      <div className={`${isGrid ? "w-full pt-4 border-t border-outline-variant/5" : "text-right shrink-0"}`}>
        <div className={`font-black text-on-surface font-headline tracking-tight ${isGrid ? "text-2xl" : "text-sm"}`}>
          {formatCurrency(Number(subscription.amount), currency.code)}
        </div>
        <div
          className={`font-black text-on-surface-variant/40 uppercase tracking-widest mt-0.5 ${
            isGrid ? "text-xs" : "text-[10px]"
          }`}
        >
          {subscription.billing_cycle === "monthly"
            ? "/mo"
            : subscription.billing_cycle === "yearly"
              ? "/yr"
              : `/${subscription.billing_cycle.slice(0, 3)}`}
        </div>
      </div>
    </div>
  );
}
