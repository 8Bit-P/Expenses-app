import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { differenceInDays, parseISO, startOfMonth, endOfMonth, getDate, format } from "date-fns";

import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../utils/currency";

type Tone = "error" | "warning" | "info" | "neutral";

const TONE_STYLES: Record<Tone, { bar: string; icon: string }> = {
  error: { bar: "bg-error", icon: "text-error" },
  warning: { bar: "bg-amber-500", icon: "text-amber-600 dark:text-amber-400" },
  info: { bar: "bg-tertiary", icon: "text-tertiary" },
  neutral: { bar: "bg-on-surface-variant", icon: "text-on-surface-variant" },
};

export default function ActionCenter() {
  const { t } = useTranslation();
  const { subscriptions } = useSubscriptions();
  const { monthlyBudget, currency } = useUserPreferences();

  const now = new Date();
  const start = format(startOfMonth(now), "yyyy-MM-dd");
  const end = format(endOfMonth(now), "yyyy-MM-dd");

  const { transactions } = useTransactions({
    startDate: start,
    endDate: end,
    pageSize: 1000, // Increased to ensure accurate monthly totals
  });

  // Programmatic Logic Block
  const alerts: { id: string; priority: number; title: string; message: string; icon: string; tone: Tone }[] = [];

  // 1. Budget Usage Alert
  if (monthlyBudget > 0) {
    const currentMonthSpend = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const budgetUsage = (currentMonthSpend / monthlyBudget) * 100;

    if (budgetUsage > 85) {
      alerts.push({
        id: "budget-alert",
        priority: 1,
        title: t("dashboard.actionCenter.budgetWarning.title"),
        message: t("dashboard.actionCenter.budgetWarning.message", { percent: budgetUsage.toFixed(0) }),
        icon: "warning",
        tone: "error",
      });
    }
  }

  // 2. Negative Cashflow Alert
  const currentMonthIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const currentMonthSpend = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const dayOfMonth = getDate(new Date());
  if (currentMonthSpend > currentMonthIncome && dayOfMonth > 5) {
    alerts.push({
      id: "negative-cashflow",
      priority: 2,
      title: t("dashboard.actionCenter.negativeCashflow.title"),
      message: t("dashboard.actionCenter.negativeCashflow.message"),
      icon: "trending_down",
      tone: "warning",
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
      tone: "info",
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
      tone: "neutral",
    });
  }

  // Sort by priority and take top 2
  const activeAlerts = [...alerts].sort((a, b) => a.priority - b.priority).slice(0, 2);

  if (activeAlerts.length === 0) return null;

  return (
    <section aria-label={t("dashboard.actionCenter.priorityCommand")}>
      <div
        className={`grid gap-px bg-outline-variant border border-outline-variant rounded-2xl overflow-hidden ${
          activeAlerts.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {activeAlerts.map((alert) => {
          const tone = TONE_STYLES[alert.tone];
          return (
            <div key={alert.id} className="relative bg-surface-container-lowest pl-5 pr-4 py-3.5 flex gap-3 items-start">
              <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${tone.bar}`} />
              <span className={`material-symbols-outlined text-[20px] mt-px ${tone.icon}`}>{alert.icon}</span>
              <div className="min-w-0">
                <h4 className="text-[13px] font-semibold text-on-surface">{alert.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
