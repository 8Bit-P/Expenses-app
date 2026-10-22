import { useState, useContext } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import { ExpensesContext } from "../../../context/ExpensesContext";
import { useTransactions } from "../../../hooks/useTransactions";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency, formatCompactCurrency } from "../../../utils/currency";
import { CATEGORY_COLORS, CHART } from "../../../constants/chartColors";
import Panel from "../../../components/ui/Panel";

interface CategoryDonutProps {
  startDate?: string;
  endDate?: string;
  title?: string;
  maxSlices?: number;
}

const OTHER_COLOR = "var(--outline)";

interface DonutTooltipProps {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: { color?: string } }[];
  currencyCode: string;
}

const DonutTooltip = ({ active, payload, currencyCode }: DonutTooltipProps) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload?.color }} />
        <span className="font-medium text-on-surface">{entry.name}</span>
      </div>
      <p className="mt-0.5 tabular-nums text-on-surface-variant">{formatCurrency(entry.value ?? 0, currencyCode)}</p>
    </div>
  );
};

export default function CategoryDonut({ startDate, endDate, title, maxSlices }: CategoryDonutProps) {
  const { t } = useTranslation();
  const { currency } = useUserPreferences();
  const [isExpanded, setIsExpanded] = useState(false);

  // Try to get filters from ExpensesContext, but fallback to props
  const expensesContext = useContext(ExpensesContext);
  const filters = expensesContext?.filters;

  const finalStartDate = startDate || filters?.startDate;
  const finalEndDate = endDate || filters?.endDate;

  const { transactions, loading } = useTransactions({
    startDate: finalStartDate,
    endDate: finalEndDate,
    pageSize: 1000,
  });

  if (loading) {
    return (
      <Panel className="h-full min-h-105" bodyClassName="flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-[14px] border-surface-container animate-pulse" />
      </Panel>
    );
  }

  // Aggregate spending by category, keeping emoji
  const categoryMap: Record<string, { name: string; emoji: string | null; value: number }> = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = t.category?.id || "uncategorized";
      const name = t.category?.name || "Uncategorized";
      const emoji = t.category?.emoji ?? null;
      if (!categoryMap[key]) {
        categoryMap[key] = { name, emoji, value: 0 };
      }
      categoryMap[key].value += t.amount;
    });

  let chartRawData = Object.values(categoryMap).sort((a, b) => b.value - a.value);

  // Apply maxSlices aggregation if requested
  if (maxSlices && chartRawData.length > maxSlices) {
    const top = chartRawData.slice(0, maxSlices);
    const others = chartRawData.slice(maxSlices);
    const othersValue = others.reduce((sum, item) => sum + item.value, 0);

    chartRawData = [...top, { name: t("expenses.charts.categoryDonut.other"), emoji: "📁", value: othersValue }];
  }

  const data = chartRawData.map((item, index) => ({
    ...item,
    color:
      item.name === t("expenses.charts.categoryDonut.other")
        ? OTHER_COLOR
        : CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const topPercent = data.length > 0 ? ((data[0].value / total) * 100).toFixed(0) : "0";

  return (
    <Panel
      className="h-full"
      title={title || t("expenses.charts.categoryDonut.title")}
      subtitle={
        data.length > 0
          ? t("expenses.charts.categoryDonut.leadsAt", {
              emoji: data[0].emoji,
              name: data[0].name,
              percent: topPercent,
            })
          : undefined
      }
      bodyClassName="flex flex-col"
    >
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-75 text-center">
          <span className="material-symbols-outlined text-[28px] text-outline">donut_large</span>
          <span className="text-sm font-medium text-on-surface">{t("expenses.charts.categoryDonut.noData")}</span>
        </div>
      ) : (
        <>
          {/* Chart Area */}
          <div className="relative w-full shrink-0 min-w-0">
            <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0} debounce={50}>
              <PieChart style={{ outline: "none" }} accessibilityLayer={false}>
                <Pie
                  data={data}
                  innerRadius={64}
                  outerRadius={86}
                  paddingAngle={0}
                  dataKey="value"
                  stroke={CHART.surface}
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 1000 }}
                  isAnimationActive={false}
                  content={<DonutTooltip currencyCode={currency.code} />}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-semibold tracking-tight tabular-nums text-on-surface">
                {formatCompactCurrency(total, currency.code)}
              </span>
              <span className="eyebrow mt-0.5">{t("expenses.charts.categoryDonut.expenses")}</span>
            </div>
          </div>

          {/* Legend */}
          <div
            className={`mt-4 overflow-y-auto -mx-1 px-1 divide-y divide-outline-variant transition-[max-height] duration-300 ${
              isExpanded ? "max-h-80" : "max-h-45"
            }`}
          >
            {(isExpanded ? data : data.slice(0, 3)).map((item, index) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
              return (
                <div key={index} className="flex items-center gap-2.5 h-10">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />

                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {item.emoji && <span className="text-sm leading-none select-none">{item.emoji}</span>}
                    <span className="text-[13px] text-on-surface truncate">{item.name}</span>
                  </div>

                  <span className="text-xs text-on-surface-variant tabular-nums w-9 text-right shrink-0">{pct}%</span>
                  <span className="text-[13px] font-medium text-on-surface tabular-nums text-right shrink-0 min-w-16">
                    {formatCompactCurrency(item.value, currency.code)}
                  </span>
                </div>
              );
            })}
          </div>

          {data.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 w-full h-9 flex items-center justify-center gap-1 rounded-lg text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span>
                {isExpanded
                  ? t("expenses.charts.categoryDonut.showLess")
                  : t("expenses.charts.categoryDonut.viewAll", { count: data.length })}
              </span>
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>
          )}
        </>
      )}
    </Panel>
  );
}
