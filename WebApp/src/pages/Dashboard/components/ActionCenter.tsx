import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { differenceInDays, parseISO, startOfMonth, endOfMonth, getDate } from "date-fns";

import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../utils/currency";

export default function ActionCenter() {
  const { t } = useTranslation();
  const { subscriptions } = useSubscriptions();
  const { monthlyBudget, currency } = useUserPreferences();

  const start = startOfMonth(new Date()).toISOString().split("T")[0];
  const end = endOfMonth(new Date()).toISOString().split("T")[0];

  const { transactions } = useTransactions({
    startDate: start,
    endDate: end,
    pageSize: 1000, // Increased to ensure accurate monthly totals
  });

  // Programmatic Logic Block
  const alerts = [];

  // 1. Budget Usage Alert
  if (monthlyBudget > 0) {
    const currentMonthSpend = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const budgetUsage = (currentMonthSpend / monthlyBudget) * 100;

    if (budgetUsage > 85) {
      alerts.push({
        id: "budget-alert",
        priority: 1,
        title: t("dashboard.actionCenter.budgetWarning.title"),
        message: t("dashboard.actionCenter.budgetWarning.message", { percent: budgetUsage.toFixed(0) }),
        icon: "warning",
        bg: "bg-error/5",
        border: "border-error/30",
        accent: "text-error",
      });
    }
  }

  // 2. Negative Cashflow Alert
  const currentMonthIncome = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);

  const currentMonthSpend = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);

  const dayOfMonth = getDate(new Date());
  if (currentMonthSpend > currentMonthIncome && dayOfMonth > 5) {
    alerts.push({
      id: "negative-cashflow",
      priority: 2,
      title: t("dashboard.actionCenter.negativeCashflow.title"),
      message: t("dashboard.actionCenter.negativeCashflow.message"),
      icon: "trending_down",
      bg: "bg-orange-500/5",
      border: "border-orange-500/30",
      accent: "text-orange-500",
    });
  }

  // 3. Subscription Renewal Alert
  const soonRenewal = subscriptions.find((s) => {
    const days = differenceInDays(parseISO(s.next_billing_date), new Date());
    return days >= 0 && days <= 3;
  });

  if (soonRenewal) {
    const days = differenceInDays(parseISO(soonRenewal.next_billing_date), new Date());
    let timingStr = "";
    if (days === 0) timingStr = t("dashboard.actionCenter.upcomingCharge.today");
    else if (days === 1) timingStr = t("dashboard.actionCenter.upcomingCharge.tomorrow");
    else timingStr = t("dashboard.actionCenter.upcomingCharge.inDays", { days });

    alerts.push({
      id: "sub-renewal",
      priority: 3,
      title: t("dashboard.actionCenter.upcomingCharge.title"),
      message: t("dashboard.actionCenter.upcomingCharge.message", {
        name: soonRenewal.name,
        timing: timingStr,
        amount: formatCurrency(soonRenewal.amount, currency.code),
      }),
      icon: "sync",
      bg: "bg-primary/5",
      border: "border-primary/30",
      accent: "text-primary",
    });
  }

  // 4. Large Transaction Alert (Last 3 days only)
  const largeTx = transactions.find(
    (tx) => tx.amount > 200 && tx.type === "expense" && differenceInDays(new Date(), parseISO(tx.date)) <= 3,
  );

  if (largeTx) {
    alerts.push({
      id: "large-tx",
      priority: 4,
      title: t("dashboard.actionCenter.largeExpense.title"),
      message: t("dashboard.actionCenter.largeExpense.message", {
        amount: formatCurrency(largeTx.amount, currency.code),
        description: largeTx.description,
      }),
      icon: "credit_card",
      bg: "bg-secondary/5",
      border: "border-secondary/30",
      accent: "text-secondary",
    });
  }

  // Sort by priority and take top 2
  const activeAlerts = [...alerts].sort((a, b) => a.priority - b.priority).slice(0, 2);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
          {t("dashboard.actionCenter.priorityCommand")}
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </div>

      <div className={`grid gap-4 ${activeAlerts.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`${alert.bg} p-4 rounded-2xl border ${alert.border} flex gap-4 items-start transition-all hover:scale-[1.01] cursor-pointer group`}
          >
            <div
              className={`w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-sm ${alert.accent} group-hover:scale-110 transition-transform`}
            >
              <span className="material-symbols-outlined text-[20px]">{alert.icon}</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-black text-on-surface uppercase tracking-wider mb-1">{alert.title}</h4>
              <p className="text-xs text-on-surface-variant leading-snug font-medium">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
