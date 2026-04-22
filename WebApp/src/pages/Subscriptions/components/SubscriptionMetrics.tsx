import { useRef, useState, useEffect } from "react";
import type { Subscription } from "../../../types/expenses";
import { isSameDay, parseISO, formatDistanceToNowStrict } from "date-fns";
import { useUserPreferences } from "../../../context/UserPreferencesContext";

interface SubscriptionMetricsProps {
  subscriptions: Subscription[];
  loading: boolean;
}

export default function SubscriptionMetrics({ subscriptions, loading }: SubscriptionMetricsProps) {
  const { currency } = useUserPreferences();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-45 bg-surface-container-lowest/50 rounded-2xl animate-pulse border border-outline-variant/10"
          />
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

  const fmt = (n: number) =>
    `${currency.symbol}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, offsetWidth } = scrollRef.current;
    if (offsetWidth === 0) return;
    const index = Math.round(scrollLeft / offsetWidth);
    setActiveIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="grid grid-cols-1 w-full min-w-0">
      <div 
        ref={scrollRef}
        className="flex md:grid md:grid-cols-3 gap-6 mb-12 -mx-2 md:-mx-0 px-2 md:px-0 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar"
      >
        {/* 1. Monthly Spend */}
        <div className="flex-none w-[82vw] md:w-auto group relative p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col justify-between h-45 snap-start">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>

          <div className="flex items-center justify-between relative z-10">
            <span className="text-on-surface-variant font-black text-[12px] uppercase tracking-[0.2em]">
              Monthly Burn Rate
            </span>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
            </div>
          </div>

          <div className="flex flex-col relative z-10">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-on-surface to-on-surface-variant/70 font-headline tracking-tighter">
              {fmt(totalMonthlySpend)}
            </span>
            <span className="text-on-surface-variant/60 font-bold text-xs mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calculate</span>
              Normalized across all cycles
            </span>
          </div>
        </div>

        {/* 2. Active Count */}
        <div className="flex-none w-[82vw] md:w-auto group relative p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 hover:border-secondary/30 transition-all duration-500 overflow-hidden flex flex-col justify-between h-45 snap-start">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-500"></div>

          <div className="flex items-center justify-between relative z-10">
            <span className="text-on-surface-variant font-black text-[12px] uppercase tracking-[0.2em]">
              Active Services
            </span>
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-[18px]">layers</span>
            </div>
          </div>

          <div className="flex items-end justify-between relative z-10">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-on-surface to-on-surface-variant/70 font-headline tracking-tighter">
              {activeSubs.length}
            </span>

            <div className="flex flex-col items-end mb-1">
              <span className="text-on-surface-variant font-bold text-xs">{subscriptions.length} Total</span>
              <span className="text-error/80 font-bold text-[10px] uppercase tracking-wider mt-0.5">
                {subscriptions.length - activeSubs.length} Inactive
              </span>
            </div>
          </div>
        </div>

        {/* 3. Next Up (Sleek urgency instead of bright block) */}
        <div className="flex-none w-[82vw] md:w-auto relative p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 hover:border-outline-variant/30 transition-all duration-500 overflow-hidden flex flex-col justify-between h-45 snap-start">
          {/* Accent Top Border to denote time/urgency */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-error to-primary opacity-70"></div>

          <div className="flex items-center justify-between relative z-10">
            <span className="text-on-surface-variant font-black text-[12px] uppercase tracking-[0.2em]">
              Next Upcoming Charge
            </span>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/20">
              <span className="material-symbols-outlined text-on-surface text-[18px]">event</span>
            </div>
          </div>

          <div className="flex flex-col relative z-10">
            {nextRenewal ? (
              <>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-on-surface font-headline truncate">{nextRenewal.name}</span>
                  <span className="text-lg font-bold text-on-surface-variant">{fmt(Number(nextRenewal.amount))}</span>
                </div>
                <span className="text-primary font-bold text-sm flex items-center gap-1.5 bg-primary/10 w-fit px-2.5 py-1 rounded-md mt-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {isSameDay(parseISO(nextRenewal.next_billing_date), new Date())
                    ? "Due Today"
                    : `Due in ${formatDistanceToNowStrict(parseISO(nextRenewal.next_billing_date))}`}
                </span>
              </>
            ) : (
              <div className="flex flex-col mt-2">
                <span className="text-xl font-black text-on-surface-variant/40">No upcoming</span>
                <span className="text-sm font-bold text-on-surface-variant/40">Your vault is clear.</span>
              </div>
            )}
          </div>
        </div>

        {/* Spacer for horizontal scroll */}
        <div className="w-4 shrink-0 md:hidden"></div>
      </div>

      {/* Pagination Dots (Dynamic) */}
      <div className="flex md:hidden justify-center gap-1.5 -mt-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? "bg-primary w-3" : "bg-surface-container-high"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
