import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactions } from "../../../hooks/useTransactions";
import { startOfMonth, subMonths, format, eachMonthOfInterval } from "date-fns";
import { useMemo } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";
import { useTranslation } from "react-i18next";
import { CHART, AXIS_TICK } from "../../../constants/chartColors";
import Panel from "../../../components/ui/Panel";

interface BarTooltipProps {
  active?: boolean;
  payload?: { name?: string; value?: number; fill?: string }[];
  label?: string;
  currency: { code: string };
}

const CustomTooltip = ({ active, payload, label, currency }: BarTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs min-w-[150px]">
        <p className="eyebrow mb-1">{label}</p>
        <div className="space-y-0.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
                <span className="text-on-surface-variant">{entry.name}</span>
              </div>
              <span className="font-medium text-on-surface tabular-nums">
                {formatCurrency(entry.value ?? 0, currency.code)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function IncomeVsExpenseChart() {
  const { t } = useTranslation();
  const { currency } = useUserPreferences();
  const now = new Date();
  const startDate = startOfMonth(subMonths(now, 5)); // 6 months ago

  const isMobile = useIsMobile(640);

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
  }, [transactions, loading, startDate, now]);

  if (loading) {
    return (
      <Panel className="h-full min-h-100" bodyClassName="flex items-center justify-center">
        <span className="text-sm text-on-surface-variant animate-pulse">
          {t("expenses.charts.incomeVsExpense.analyzing")}
        </span>
      </Panel>
    );
  }

  return (
    <Panel
      className="h-full"
      title={t("expenses.charts.incomeVsExpense.title")}
      subtitle={t("expenses.charts.incomeVsExpense.subtitle")}
      actions={
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-secondary" />
            <span className="text-on-surface">{t("expenses.charts.incomeVsExpense.income")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-error" />
            <span className="text-on-surface">{t("expenses.charts.incomeVsExpense.expense")}</span>
          </div>
        </div>
      }
    >
      <div className="w-full">
        <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={0} debounce={50}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: isMobile ? 0 : 8, left: isMobile ? -12 : 0, bottom: 0 }}
            barGap={isMobile ? 2 : 4}
          >
            <CartesianGrid vertical={false} stroke={CHART.grid} strokeDasharray="0" />

            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={8} />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={isMobile ? 44 : 72}
              tick={AXIS_TICK}
              tickFormatter={(value) =>
                formatCurrency(value, currency.code, {
                  notation: isMobile ? "compact" : "standard",
                  maximumFractionDigits: 0,
                })
              }
            />

            <Tooltip
              isAnimationActive={false}
              cursor={{ fill: CHART.cursor }}
              content={<CustomTooltip currency={currency} />}
            />

            <Bar
              dataKey="income"
              name={t("expenses.charts.incomeVsExpense.income")}
              fill={CHART.income}
              radius={[3, 3, 0, 0]}
              barSize={isMobile ? 10 : 22}
            />
            <Bar
              dataKey="expense"
              name={t("expenses.charts.incomeVsExpense.expense")}
              fill={CHART.expense}
              radius={[3, 3, 0, 0]}
              barSize={isMobile ? 10 : 22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
