import { useRecentActivity } from "../../../hooks/useRecentActivity";
import { formatCurrency } from "../../../utils/currency";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { Link } from "react-router-dom";
import Panel from "../../../components/ui/Panel";

import { useTranslation } from "react-i18next";

export default function RecentActivity() {
  const { t } = useTranslation();
  const { activity, loading } = useRecentActivity(6);
  const { currency } = useUserPreferences();

  return (
    <Panel
      flush
      title={t("dashboard.recentActivity.title")}
      actions={
        <Link
          to="/search"
          className="text-xs font-medium text-on-surface-variant hover:text-on-surface inline-flex items-center gap-0.5"
        >
          {t("dashboard.recentActivity.viewAll")}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      }
    >
      {loading ? (
        <div className="px-5 pb-5 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-surface-container rounded-lg animate-pulse" />
          ))}
        </div>
      ) : activity.length === 0 ? (
        <p className="px-5 pb-8 pt-4 text-center text-sm text-on-surface-variant">
          {t("dashboard.recentActivity.noActivity")}
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant border-t border-outline-variant">
          {activity.map((item) => {
            if (item.type === "transaction") {
              const tx = item.data;
              const isIncome = tx.type === "income";
              return (
                <li key={tx.id} className="flex items-center gap-3 px-5 h-14 hover:bg-surface-container-low transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-base shrink-0">
                    {tx.category?.emoji || "💳"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-on-surface truncate">{tx.description}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {tx.category?.name || t("dashboard.recentActivity.uncategorized")}
                    </p>
                  </div>
                  <p
                    className={`text-[13px] font-medium tabular-nums shrink-0 ${
                      isIncome ? "text-secondary" : "text-on-surface"
                    }`}
                  >
                    {isIncome ? "+" : "−"}
                    {formatCurrency(tx.amount, currency.code)}
                  </p>
                </li>
              );
            }

            const snap = item.data;
            return (
              <li key={snap.id} className="flex items-center gap-3 px-5 h-14 hover:bg-surface-container-low transition-colors">
                <span className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">monitoring</span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-on-surface truncate">{snap.assetName}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {t("dashboard.recentActivity.investmentSnapshot")}
                  </p>
                </div>
                <p className="text-[13px] font-medium tabular-nums text-on-surface shrink-0">
                  {formatCurrency(snap.total_value, currency.code)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
