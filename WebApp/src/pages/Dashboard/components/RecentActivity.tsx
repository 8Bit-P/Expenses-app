import { useRecentActivity } from "../../../hooks/useRecentActivity";
import { formatCurrency } from "../../../utils/currency";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { Link } from "react-router-dom";

export default function RecentActivity() {
  const { activity, loading } = useRecentActivity(6);
  const { currency } = useUserPreferences();

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">history</span>
          Recent Activity
        </h2>
        <Link 
          to="/search" 
          className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline transition-all"
        >
          View All
        </Link>
      </div>

      <div className="space-y-1">
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-surface-container-low rounded-xl"></div>
            ))}
          </div>
        ) : activity.length === 0 ? (
          <p className="text-center py-8 text-xs font-medium text-on-surface-variant italic">No recent activity.</p>
        ) : (
          activity.map((item) => {
            if (item.type === "transaction") {
              const tx = item.data;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-outline-variant/10 hover:bg-surface-container-low/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant text-lg">
                      {tx.category?.emoji || "💳"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-on-surface truncate pr-2">{tx.description}</h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 mt-0.5">
                        {tx.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-black text-sm ${tx.type === "income" ? "text-secondary" : "text-on-surface"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, currency.code)}
                    </p>
                  </div>
                </div>
              );
            }

            const snap = item.data;
            return (
              <div
                key={snap.id}
                className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-outline-variant/10 hover:bg-surface-container-low/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg">
                    <span className="material-symbols-outlined text-[20px]">monitoring</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-on-surface truncate pr-2">{snap.assetName}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 mt-0.5">
                      Investment Snapshot
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-sm text-on-surface">{formatCurrency(snap.total_value, currency.code)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
