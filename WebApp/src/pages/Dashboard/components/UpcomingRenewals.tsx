import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { formatCurrency } from "../../../utils/currency";
import { differenceInDays, parseISO } from "date-fns";

export default function UpcomingRenewals() {
  const { subscriptions, loading } = useSubscriptions();

  // Get next 3 renewals
  const upcoming = [...subscriptions]
    .filter(s => s.next_billing_date)
    .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[20px]">event_repeat</span>
          Upcoming Renewals
        </h2>
        <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline transition-all">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-surface-container-low rounded-xl"></div>
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-center py-8 text-xs font-medium text-on-surface-variant italic">No renewals found.</p>
        ) : (
          upcoming.map((s) => {
            const daysLeft = differenceInDays(parseISO(s.next_billing_date), new Date());
            const isCritical = daysLeft <= 3;

            return (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface font-black text-sm shadow-sm overflow-hidden border border-outline-variant/10">
                    {s.icon_url ? (
                      <img src={s.icon_url} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{s.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">{s.name}</h4>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1 ${
                        isCritical ? "text-error" : "text-on-surface-variant"
                      }`}
                    >
                      {isCritical && <span className="w-1 h-1 bg-error rounded-full animate-pulse"></span>}
                      {daysLeft === 0 ? "Due Today" : daysLeft === 1 ? "Due Tomorrow" : `Due in ${daysLeft} days`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-on-surface">{formatCurrency(s.amount)}</p>
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
