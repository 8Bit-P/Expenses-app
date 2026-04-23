import { useSubscriptions } from "../../../hooks/useSubscriptions";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { differenceInDays, parseISO, startOfMonth, endOfMonth } from "date-fns";

export default function ActionCenter() {
  const { subscriptions } = useSubscriptions();
  const { monthlyBudget } = useUserPreferences();
  
  const start = startOfMonth(new Date()).toISOString().split("T")[0];
  const end = endOfMonth(new Date()).toISOString().split("T")[0];
  
  const { transactions } = useTransactions({
    startDate: start,
    endDate: end,
    pageSize: 20
  });

  // Programmatic Logic Block
  const alerts = [];

  // 1. Budget Usage Alert
  const currentMonthSpend = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const budgetUsage = (currentMonthSpend / (monthlyBudget || 1)) * 100;

  if (budgetUsage > 85) {
    alerts.push({
      id: "budget-alert",
      title: "Budget Warning",
      message: `You've used ${budgetUsage.toFixed(0)}% of your monthly budget. Consider scaling back.`,
      icon: "warning",
      bg: "bg-error/5",
      border: "border-error/30",
      accent: "text-error"
    });
  }

  // 2. Subscription Renewal Alert
  const soonRenewal = subscriptions.find(s => {
    const days = differenceInDays(parseISO(s.next_billing_date), new Date());
    return days >= 0 && days <= 3;
  });

  if (soonRenewal) {
    const days = differenceInDays(parseISO(soonRenewal.next_billing_date), new Date());
    alerts.push({
      id: "sub-renewal",
      title: "Upcoming Charge",
      message: `'${soonRenewal.name}' renews in ${days === 0 ? "today" : days === 1 ? "tomorrow" : `${days} days`} (€${soonRenewal.amount}).`,
      icon: "sync",
      bg: "bg-primary/5",
      border: "border-primary/30",
      accent: "text-primary"
    });
  }

  // 3. Large Transaction Alert
  const largeTx = transactions.find(tx => tx.amount > 200 && tx.type === 'expense');
  if (largeTx) {
    alerts.push({
      id: "large-tx",
      title: "Large Expense",
      message: `A transaction of €${largeTx.amount} at '${largeTx.description}' was detected.`,
      icon: "credit_card",
      bg: "bg-secondary/5",
      border: "border-secondary/30",
      accent: "text-secondary"
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
          Priority Command
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.slice(0, 2).map(alert => (
          <div 
            key={alert.id}
            className={`${alert.bg} p-4 rounded-2xl border ${alert.border} flex gap-4 items-start transition-all hover:scale-[1.01] cursor-pointer group`}
          >
            <div className={`w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-sm ${alert.accent} group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined text-[20px]">{alert.icon}</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-black text-on-surface uppercase tracking-wider mb-1">{alert.title}</h4>
              <p className="text-xs text-on-surface-variant leading-snug font-medium">
                {alert.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
