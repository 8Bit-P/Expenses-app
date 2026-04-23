import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import { startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { useInvestments } from "../../../hooks/useInvestments";

export default function SummaryRow() {
  const { monthlyBudget } = useUserPreferences();
  const { metrics: invMetrics } = useInvestments();
  
  const start = startOfMonth(new Date()).toISOString().split("T")[0];
  const end = endOfMonth(new Date()).toISOString().split("T")[0];
  
  const { transactions } = useTransactions({
    startDate: start,
    endDate: end,
    type: "expense"
  });

  const currentMonthSpend = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const daysInMonth = differenceInDays(endOfMonth(new Date()), startOfMonth(new Date())) + 1;
  const daysPassed = differenceInDays(new Date(), startOfMonth(new Date()));
  const daysRemaining = Math.max(1, daysInMonth - daysPassed);
  
  const budgetRemaining = Math.max(0, monthlyBudget - currentMonthSpend);
  const dailySafe = budgetRemaining / daysRemaining;
  const budgetUsagePercent = Math.min(100, (currentMonthSpend / monthlyBudget) * 100);

  const metrics = [
    {
      title: "Net Worth",
      amount: formatCurrency(invMetrics.totalValue),
      change: "+2.4%", // Placeholder for now
      changeType: "positive",
      icon: "account_balance_wallet",
      bg: "bg-primary/10",
      text: "text-primary",
    },
    {
      title: "Monthly Income",
      amount: formatCurrency(12450), // Placeholder
      change: "+12%",
      changeType: "positive",
      icon: "trending_up",
      bg: "bg-secondary/10",
      text: "text-secondary",
    },
    {
      title: "Safe to Spend",
      amount: `${formatCurrency(dailySafe)} / day`,
      subtext: `${formatCurrency(budgetRemaining)} left this month`,
      icon: "payments",
      bg: "bg-tertiary/10",
      text: "text-tertiary",
      isBudget: true,
    },
    {
      title: "Total Invested",
      amount: formatCurrency(invMetrics.totalInvested),
      change: "+8.1%",
      changeType: "positive",
      icon: "auto_graph",
      bg: "bg-tertiary/10",
      text: "text-tertiary",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle glow effect on hover */}
          <div
            className={`absolute -top-10 -right-10 w-24 h-24 ${metric.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          ></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div
              className={`w-12 h-12 rounded-2xl ${metric.bg} flex items-center justify-center border border-white/10`}
            >
              <span className={`material-symbols-outlined ${metric.text}`}>{metric.icon}</span>
            </div>
            {'change' in metric && (
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                  metric.changeType === "positive"
                    ? "text-secondary bg-secondary-container/50"
                    : "text-error bg-error-container/50"
                }`}
              >
                {metric.change}
              </span>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 mb-1 relative z-10">
            {metric.title}
          </p>
          <h3 className="text-2xl font-extrabold font-headline tracking-tight text-on-surface relative z-10">
            {metric.amount}
          </h3>
          
          {metric.isBudget && (
            <div className="mt-4 relative z-10">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">Budget Usage</span>
                <span className="text-[10px] font-black text-on-surface">{Math.round(budgetUsagePercent)}%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    budgetUsagePercent > 90 ? 'bg-error' : budgetUsagePercent > 70 ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${budgetUsagePercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
