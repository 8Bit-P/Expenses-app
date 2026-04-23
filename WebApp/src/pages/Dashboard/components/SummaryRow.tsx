import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import { 
  startOfMonth, 
  endOfMonth, 
  differenceInDays, 
  subMonths, 
  format, 
  getDate, 
  isAfter,
  parseISO
} from "date-fns";
import { useInvestments } from "../../../hooks/useInvestments";

export default function SummaryRow() {
  const { monthlyBudget, currency } = useUserPreferences();
  const { metrics: invMetrics, assets } = useInvestments();
  
  const now = new Date();
  const currentDayOfMonth = getDate(now);
  
  // 1. DATES FOR TRANSACTIONS
  const currentStart = startOfMonth(now);
  const currentEnd = endOfMonth(now);
  const prevStart = startOfMonth(subMonths(now, 1));
  const prevEnd = endOfMonth(subMonths(now, 1));

  // Current Month Data
  const { transactions: currentTx, loading: loadingCurrent } = useTransactions({
    startDate: format(currentStart, "yyyy-MM-dd"),
    endDate: format(currentEnd, "yyyy-MM-dd"),
    pageSize: 1000
  });

  // Previous Month Data (to calculate trend)
  const { transactions: prevTx } = useTransactions({
    startDate: format(prevStart, "yyyy-MM-dd"),
    endDate: format(prevEnd, "yyyy-MM-dd"),
    pageSize: 1000
  });

  // 2. LOGIC: MONTHLY INCOME
  const currentMonthIncome = currentTx
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const prevMonthIncomeMTD = prevTx
    .filter(tx => {
      if (tx.type !== 'income') return false;
      const txDay = getDate(parseISO(tx.date));
      return txDay <= currentDayOfMonth;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const incomeTrend = prevMonthIncomeMTD > 0 
    ? ((currentMonthIncome - prevMonthIncomeMTD) / prevMonthIncomeMTD) * 100 
    : 0;

  // 3. LOGIC: SAFE TO SPEND
  const currentMonthSpend = currentTx
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const daysInMonth = differenceInDays(currentEnd, currentStart) + 1;
  const daysRemaining = Math.max(1, daysInMonth - currentDayOfMonth + 1);
  
  const budgetRemaining = Math.max(0, monthlyBudget - currentMonthSpend);
  const safeToSpend = budgetRemaining / daysRemaining;
  const budgetUsagePercent = monthlyBudget > 0 ? (currentMonthSpend / monthlyBudget) * 100 : 0;

  // 4. LOGIC: INVESTMENTS TREND (Value 30 days ago)
  const date30DaysAgo = subMonths(now, 1);
  let value30DaysAgo = 0;
  
  assets.forEach(asset => {
    const snap30 = asset.asset_snapshots.find(s => !isAfter(parseISO(s.date), date30DaysAgo));
    value30DaysAgo += Number(snap30?.total_value || 0);
  });

  const investmentTrend = value30DaysAgo > 0 
    ? ((invMetrics.totalValue - value30DaysAgo) / value30DaysAgo) * 100 
    : 0;

  const metrics = [
    {
      title: "Net Worth",
      amount: formatCurrency(invMetrics.totalValue, currency.code),
      change: `${investmentTrend >= 0 ? "+" : ""}${investmentTrend.toFixed(1)}%`,
      changeType: investmentTrend >= 0 ? "positive" : "negative",
      icon: "account_balance_wallet",
      bg: "bg-primary/10",
      text: "text-primary",
    },
    {
      title: "Monthly Income",
      amount: formatCurrency(currentMonthIncome, currency.code),
      change: `${incomeTrend >= 0 ? "+" : ""}${incomeTrend.toFixed(1)}%`,
      changeType: incomeTrend >= 0 ? "positive" : "negative",
      icon: "trending_up",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
    },
    {
      title: "Safe to Spend",
      amount: `${formatCurrency(safeToSpend, currency.code)} / day`,
      subtext: `${formatCurrency(budgetRemaining, currency.code)} left this month`,
      icon: "payments",
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      isBudget: true,
    },
    {
      title: "Total Invested",
      amount: formatCurrency(invMetrics.totalInvested, currency.code),
      change: invMetrics.roi >= 0 ? `+${invMetrics.roi.toFixed(1)}% ROI` : `${invMetrics.roi.toFixed(1)}% ROI`,
      changeType: invMetrics.roi >= 0 ? "positive" : "negative",
      icon: "auto_graph",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
  ];

  if (loadingCurrent && currentTx.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-surface-container-lowest rounded-2xl border border-outline-variant/10"></div>
        ))}
      </div>
    );
  }

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
              className={`w-12 h-12 rounded-2xl ${metric.bg} flex items-center justify-center border border-white/5 shadow-inner`}
            >
              <span className={`material-symbols-outlined ${metric.text}`}>{metric.icon}</span>
            </div>
            {'change' in metric && (
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                  metric.changeType === "positive"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-error bg-error/10"
                }`}
              >
                {metric.change}
              </span>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 mb-1 relative z-10">
            {metric.title}
          </p>
          <div className="flex flex-col relative z-10">
            <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">
              {metric.amount}
            </h3>
            {'subtext' in metric && (
              <p className="text-[11px] font-bold text-on-surface-variant/60 mt-1">
                {metric.subtext}
              </p>
            )}
            {metric.isBudget && (
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/50">Budget Usage</span>
                  <span className="text-[10px] font-black text-on-surface">{Math.round(budgetUsagePercent)}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      budgetUsagePercent > 90 ? "bg-error" : budgetUsagePercent > 70 ? "bg-orange-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
