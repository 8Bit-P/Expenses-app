import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactions } from "../../../hooks/useTransactions";
import { startOfMonth, subMonths, format, eachMonthOfInterval } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-3 flex flex-col gap-1.5 min-w-[140px]">
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 border-b border-outline-variant/10 pb-1 mb-0.5">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
              <span className="text-xs font-bold text-on-surface capitalize">{entry.name}</span>
            </div>
            <span className="text-xs font-black text-on-surface">
              {formatCurrency(entry.value, currency.code)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function IncomeVsExpenseChart() {
  const { currency } = useUserPreferences();
  const now = new Date();
  const startDate = startOfMonth(subMonths(now, 5)); // 6 months ago

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    setIsMobile(mql.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  const { transactions, loading } = useTransactions({
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(now, "yyyy-MM-dd"),
    pageSize: 1000,
  });

  const chartData = useMemo(() => {
    if (loading) return [];

    const months = eachMonthOfInterval({ start: startDate, end: now });

    return months.map((month) => {
      const monthStr = format(month, "yyyy-MM");
      const monthLabel = format(month, "MMM");

      const monthTransactions = transactions.filter((t) => format(new Date(t.date), "yyyy-MM") === monthStr);

      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

      return {
        month: monthLabel,
        income,
        expense,
      };
    });
  }, [transactions, loading]);

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 h-100 flex items-center justify-center animate-pulse">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/40">
          Analyzing History...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-lg font-bold font-headline text-on-surface">Income vs. Expense</h4>
          <p className="text-xs font-medium text-on-surface-variant mt-0.5">6-month historical view</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-secondary"></div>
            <span className="text-on-surface">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
            <span className="text-on-surface-variant">Expense</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1} debounce={50}>
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: isMobile ? 0 : 20, left: isMobile ? -25 : 0, bottom: 0 }} 
            barGap={isMobile ? 2 : 4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-outline-variant/20"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-on-surface-variant/60 font-semibold"
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={isMobile ? 40 : 80}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-on-surface-variant/60 font-semibold"
              tickFormatter={(value) => formatCurrency(value, currency.code, { 
                notation: isMobile ? 'compact' : 'standard', 
                maximumFractionDigits: 0 
              })}
            />

            <Tooltip
              cursor={{ fill: "var(--surface-container-low)", opacity: 0.4 }}
              content={<CustomTooltip currency={currency} />}
            />

            <Bar dataKey="income" name="Income" fill="var(--secondary)" radius={[2, 2, 0, 0]} barSize={isMobile ? 10 : 24} />
            <Bar dataKey="expense" name="Expense" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={isMobile ? 10 : 24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
