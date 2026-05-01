import { useRef, useState, useEffect, useCallback } from "react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import { startOfMonth, endOfMonth, differenceInDays, subMonths, format, getDate, isAfter, parseISO } from "date-fns";
import { useInvestments } from "../../../hooks/useInvestments";

import { useTranslation } from "react-i18next";

export default function SummaryRow() {
  const { t } = useTranslation();
  const { monthlyBudget, currency } = useUserPreferences();
  const { metrics: invMetrics, assets } = useInvestments();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
    pageSize: 1000,
  });

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    const cardWidth = scrollWidth / 4;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loadingCurrent, handleScroll]);

  // Previous Month Data (to calculate trend)
  const { transactions: prevTx } = useTransactions({
    startDate: format(prevStart, "yyyy-MM-dd"),
    endDate: format(prevEnd, "yyyy-MM-dd"),
    pageSize: 1000,
  });

  // 2. LOGIC: MONTHLY INCOME
  const currentMonthIncome = currentTx.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);

  const prevMonthIncomeMTD = prevTx
    .filter((tx) => {
      if (tx.type !== "income") return false;
      const txDay = getDate(parseISO(tx.date));
      return txDay <= currentDayOfMonth;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const incomeTrend =
    prevMonthIncomeMTD > 0 ? ((currentMonthIncome - prevMonthIncomeMTD) / prevMonthIncomeMTD) * 100 : 0;
  const incomeDiff = currentMonthIncome - prevMonthIncomeMTD;

  // 3. LOGIC: SAFE TO SPEND
  const currentMonthSpend = currentTx.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);

  const daysInMonth = differenceInDays(currentEnd, currentStart) + 1;
  const daysRemaining = Math.max(1, daysInMonth - currentDayOfMonth + 1);

  const budgetRemaining = Math.max(0, monthlyBudget - currentMonthSpend);
  const safeToSpend = budgetRemaining / daysRemaining;
  const budgetUsagePercent = monthlyBudget > 0 ? (currentMonthSpend / monthlyBudget) * 100 : 0;

  // 4. LOGIC: INVESTMENTS TREND (Value 30 days ago)
  const date30DaysAgo = subMonths(now, 1);
  let value30DaysAgo = 0;

  assets.forEach((asset) => {
    const snap30 = asset.asset_snapshots.find((s) => !isAfter(parseISO(s.date), date30DaysAgo));
    value30DaysAgo += Number(snap30?.total_value || 0);
  });

  const investmentTrend = value30DaysAgo > 0 
    ? ((invMetrics.totalValue - value30DaysAgo) / value30DaysAgo) * 100 
    : (invMetrics.totalValue > 0 ? 100 : 0);
  const investmentDiff = invMetrics.totalValue - value30DaysAgo;
  const totalReturn = invMetrics.totalValue - invMetrics.totalInvested;

  const metrics = [
    {
      title: t("dashboard.summary.netWorth"),
      amount: formatCurrency(invMetrics.totalValue, currency.code),
      subtext: `${investmentDiff >= 0 ? "+" : ""}${formatCurrency(investmentDiff, currency.code)} ${t("dashboard.summary.vsLastMonth")}`,
      change: `${investmentTrend >= 0 ? "+" : ""}${investmentTrend.toFixed(1)}%`,
      changeType: investmentTrend >= 0 ? "positive" : "negative",
      icon: "account_balance_wallet",
      bg: "bg-primary/10",
      text: "text-primary",
    },
    {
      title: t("dashboard.summary.monthlyIncome"),
      amount: formatCurrency(currentMonthIncome, currency.code),
      subtext: `${incomeDiff >= 0 ? "+" : ""}${formatCurrency(incomeDiff, currency.code)} ${t("dashboard.summary.vsLastMonth")}`,
      change: `${incomeTrend >= 0 ? "+" : ""}${incomeTrend.toFixed(1)}%`,
      changeType: incomeTrend >= 0 ? "positive" : "negative",
      icon: "trending_up",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
    },
    {
      title: t("dashboard.summary.safeToSpend"),
      amount: `${formatCurrency(safeToSpend, currency.code)} / ${t("dashboard.summary.day")}`,
      subtext: `${formatCurrency(budgetRemaining, currency.code)} ${t("dashboard.summary.leftThisMonth")}`,
      icon: "payments",
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      isBudget: true,
    },
    {
      title: t("dashboard.summary.totalInvested"),
      amount: formatCurrency(invMetrics.totalInvested, currency.code),
      subtext: `${totalReturn >= 0 ? "+" : ""}${formatCurrency(totalReturn, currency.code)} ${t("dashboard.summary.totalReturn")}`,
      change: invMetrics.roi >= 0 ? `+${invMetrics.roi.toFixed(1)}% ${t("dashboard.summary.roi")}` : `${invMetrics.roi.toFixed(1)}% ${t("dashboard.summary.roi")}`,
      changeType: invMetrics.roi >= 0 ? "positive" : "negative",
      icon: "auto_graph",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
  ];

  if (loadingCurrent && currentTx.length === 0) {
    return (
      <div className="flex sm:grid sm:grid-cols-4 gap-6 -mx-2 md:mx-0 px-2 md:px-0 overflow-x-auto pb-4 sm:pb-0 hide-scrollbar animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-none w-[82vw] sm:w-auto h-40 bg-surface-container-lowest rounded-2xl border border-outline-variant/10"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 w-full min-w-0">
      <div
        ref={scrollRef}
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mx-2 md:mx-0 px-2 md:px-0 overflow-x-auto pb-6 sm:pb-0 snap-x snap-mandatory hide-scrollbar"
      >
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="flex-none w-[82vw] sm:w-auto bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-all duration-300 relative overflow-hidden snap-start flex flex-col justify-start h-52 sm:h-auto min-h-[180px]"
          >
            {/* Subtle glow effect on hover */}
            <div
              className={`absolute -top-10 -right-10 w-24 h-24 ${metric.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            ></div>

            {/* BLOCK 1: TOP (Icon + Change) */}
            <div className="flex justify-between items-center relative z-10 mb-4">
              <div
                className={`w-11 h-11 rounded-2xl ${metric.bg} flex items-center justify-center border border-white/5 shadow-inner`}
              >
                <span className={`material-symbols-outlined ${metric.text} text-[22px]`}>{metric.icon}</span>
              </div>
              {"change" in metric && (
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                    metric.changeType === "positive" ? "text-emerald-500 bg-emerald-500/10" : "text-error bg-error/10"
                  }`}
                >
                  {metric.change}
                </span>
              )}
            </div>

            {/* BLOCK 2: BOTTOM (Title + Value + Subtext) */}
            <div className="mt-auto flex flex-col gap-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/50">
                {metric.title}
              </p>
              <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight leading-tight">
                {metric.amount}
              </h3>
              <p className="text-xs text-on-surface-variant/60 font-medium">{metric.subtext}</p>

              {metric.isBudget && (
                <div className="mt-3 w-full">
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        budgetUsagePercent > 90
                          ? "bg-error"
                          : budgetUsagePercent > 70
                            ? "bg-orange-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots (Mobile Only) */}
      <div className="flex sm:hidden justify-center gap-1.5 mt-2 mb-4">
        {metrics.map((_, i) => (
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
