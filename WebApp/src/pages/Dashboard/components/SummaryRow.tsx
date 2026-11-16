import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import { startOfMonth, endOfMonth, differenceInDays, subMonths, format, getDate, isAfter, parseISO } from "date-fns";
import { useInvestments } from "../../../hooks/useInvestments";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/cn";

type Tone = "positive" | "negative";

interface Metric {
  key: string;
  title: string;
  amount: string;
  unit?: string;
  subtext: string;
  change?: string;
  changeType?: Tone;
  hero?: boolean;
  isBudget?: boolean;
  span: string;
}

export default function SummaryRow() {
  const { t } = useTranslation();
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
    pageSize: 1000,
  });

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

  const investmentTrend =
    value30DaysAgo > 0
      ? ((invMetrics.totalValue - value30DaysAgo) / value30DaysAgo) * 100
      : invMetrics.totalValue > 0
        ? 100
        : 0;
  const investmentDiff = invMetrics.totalValue - value30DaysAgo;
  const totalReturn = invMetrics.totalValue - invMetrics.totalInvested;

  const metrics: Metric[] = [
    {
      key: "netWorth",
      title: t("dashboard.summary.netWorth"),
      amount: formatCurrency(invMetrics.totalValue, currency.code),
      subtext: `${investmentDiff >= 0 ? "+" : ""}${formatCurrency(investmentDiff, currency.code)} ${t("dashboard.summary.vsLastMonth")}`,
      change: `${investmentTrend >= 0 ? "+" : ""}${investmentTrend.toFixed(1)}%`,
      changeType: investmentTrend >= 0 ? "positive" : "negative",
      hero: true,
      span: "col-span-2 lg:col-span-1",
    },
    {
      key: "income",
      title: t("dashboard.summary.monthlyIncome"),
      amount: formatCurrency(currentMonthIncome, currency.code),
      subtext: `${incomeDiff >= 0 ? "+" : ""}${formatCurrency(incomeDiff, currency.code)} ${t("dashboard.summary.vsLastMonth")}`,
      change: `${incomeTrend >= 0 ? "+" : ""}${incomeTrend.toFixed(1)}%`,
      changeType: incomeTrend >= 0 ? "positive" : "negative",
      span: "col-span-2 sm:col-span-1",
    },
    {
      key: "invested",
      title: t("dashboard.summary.totalInvested"),
      amount: formatCurrency(invMetrics.totalInvested, currency.code),
      subtext: `${totalReturn >= 0 ? "+" : ""}${formatCurrency(totalReturn, currency.code)} ${t("dashboard.summary.totalReturn")}`,
      change: `${invMetrics.roi >= 0 ? "+" : ""}${invMetrics.roi.toFixed(1)}% ${t("dashboard.summary.roi")}`,
      changeType: invMetrics.roi >= 0 ? "positive" : "negative",
      span: "col-span-2 sm:col-span-1",
    },
    {
      key: "safeToSpend",
      title: t("dashboard.summary.safeToSpend"),
      amount: formatCurrency(safeToSpend, currency.code),
      unit: `/ ${t("dashboard.summary.day")}`,
      subtext: `${formatCurrency(budgetRemaining, currency.code)} ${t("dashboard.summary.leftThisMonth")}`,
      isBudget: true,
      span: "col-span-2 lg:col-span-1",
    },
  ];

  if (loadingCurrent && currentTx.length === 0) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-px bg-outline-variant border border-outline-variant rounded-2xl overflow-hidden">
        {metrics.map((m) => (
          <div key={m.key} className={cn("h-[148px] bg-surface-container-lowest p-5", m.span)}>
            <div className="h-3 w-24 rounded bg-surface-container animate-pulse" />
            <div className="h-7 w-36 rounded bg-surface-container animate-pulse mt-4" />
            <div className="h-3 w-28 rounded bg-surface-container animate-pulse mt-6" />
          </div>
        ))}
      </div>
    );
  }

  const budgetBarColor = budgetUsagePercent > 90 ? "bg-error" : budgetUsagePercent > 70 ? "bg-amber-500" : "bg-secondary";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-px bg-outline-variant border border-outline-variant rounded-2xl overflow-hidden">
      {metrics.map((metric) => (
        <div
          key={metric.key}
          className={cn(
            "flex flex-col justify-between gap-5 p-5 min-h-[148px] min-w-0",
            metric.hero ? "bg-rail text-on-rail" : "bg-surface-container-lowest",
            metric.span,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className={cn("eyebrow", metric.hero && "!text-on-rail-variant")}>{metric.title}</p>
            {metric.change && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 h-5 px-1.5 rounded text-[11px] font-medium tabular-nums whitespace-nowrap",
                  metric.hero
                    ? metric.changeType === "positive"
                      ? "bg-accent text-on-accent"
                      : "bg-error text-white"
                    : metric.changeType === "positive"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-error/10 text-error",
                )}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {metric.changeType === "positive" ? "arrow_upward" : "arrow_downward"}
                </span>
                {metric.change}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p
              title={metric.amount}
              className={cn(
                "font-semibold tracking-tight tabular-nums leading-none truncate",
                metric.hero ? "text-[30px]" : "text-2xl",
              )}
            >
              {metric.amount}
              {metric.unit && (
                <span className="ml-1 text-sm font-normal text-on-surface-variant tracking-normal">{metric.unit}</span>
              )}
            </p>
            <p
              className={cn(
                "text-xs mt-2 truncate tabular-nums",
                metric.hero ? "text-on-rail-variant" : "text-on-surface-variant",
              )}
            >
              {metric.subtext}
            </p>

            {metric.isBudget && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-700", budgetBarColor)}
                    style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
                  />
                </div>
                <span className="text-[11px] text-on-surface-variant tabular-nums">
                  {budgetUsagePercent.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
