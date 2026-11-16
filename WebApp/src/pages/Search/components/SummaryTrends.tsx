import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart2, TrendingUp, PieChart, BarChart3, ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../../../utils/currency";
import { AXIS_TICK, CHART } from "../../../constants/chartColors";
import Panel from "../../../components/ui/Panel";
import type { ChartBucket } from "../hooks/useLedgerData";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type ChartView = "bar" | "line" | "donut";

interface SummaryTrendsProps {
  totalSpent: number;
  totalIncome: number;
  netFlow: number;
  currencyCode: string;
  chartData: ChartBucket[];
}

// ── Colours ───────────────────────────────────────────────────────────────────
const COLOR_INCOME = CHART.income;
const COLOR_EXPENSE = CHART.expense;
const COLOR_ASSET = CHART.secondary;

const LEGEND_PROPS = {
  iconType: "circle" as const,
  iconSize: 7,
  wrapperStyle: { fontSize: 11, paddingTop: 6 },
  formatter: (value: string) => <span className="text-on-surface-variant">{value}</span>,
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
  currencyCode,
}: Partial<TooltipContentProps<ValueType, NameType>> & { currencyCode: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs space-y-1 min-w-[150px]">
      {label && <p className="font-medium text-on-surface mb-1.5">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="w-2 h-2 rounded-full" style={{ background: p.payload?.color ?? p.color }} />
            {p.name}
          </span>
          <span className="font-medium text-on-surface tabular-nums">{formatCurrency(Number(p.value), currencyCode)}</span>
        </div>
      ))}
    </div>
  );
}

// ── KPI cell ──────────────────────────────────────────────────────────────────
function KpiCell({
  label,
  value,
  toneClass,
  icon,
  currencyCode,
}: {
  label: string;
  value: number;
  toneClass: string;
  icon: React.ReactNode;
  currencyCode: string;
}) {
  return (
    <div className="px-5 py-4 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow truncate">{label}</span>
        <span className="text-outline shrink-0">{icon}</span>
      </div>
      <span className={`text-2xl font-semibold tabular-nums tracking-tight truncate ${toneClass}`}>
        {value >= 0 ? "" : "−"}
        {formatCurrency(Math.abs(value), currencyCode)}
      </span>
    </div>
  );
}

export function SummaryTrends({ totalSpent, totalIncome, netFlow, currencyCode, chartData }: SummaryTrendsProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<ChartView>("bar");

  const isEmpty = chartData.length === 0;

  // Donut data
  const donutData = [
    { name: t("search.chartLegend.income"), value: totalIncome, color: COLOR_INCOME },
    { name: t("search.chartLegend.expenses"), value: totalSpent, color: COLOR_EXPENSE },
    { name: t("search.chartLegend.assets"), value: chartData.reduce((s, d) => s + d.assets, 0), color: COLOR_ASSET },
  ].filter((d) => d.value > 0);

  const viewButtons: { key: ChartView; icon: React.ReactNode; label: string }[] = [
    { key: "bar", icon: <BarChart2 size={14} />, label: t("search.views.bar") },
    { key: "line", icon: <TrendingUp size={14} />, label: t("search.views.line") },
    { key: "donut", icon: <PieChart size={14} />, label: t("search.views.donut") },
  ];

  const segmented = (
    <div className="inline-flex p-0.5 rounded-lg bg-surface-container border border-outline-variant">
      {viewButtons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => setView(btn.key)}
          title={btn.label}
          aria-pressed={view === btn.key}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-8 rounded-md text-xs font-medium transition-colors ${
            view === btn.key
              ? "bg-surface-container-lowest text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {btn.icon}
          <span className="hidden sm:inline">{btn.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* ── KPI strip ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-surface-container-lowest border border-outline-variant rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-outline-variant">
        <KpiCell
          label={t("search.totalIncome")}
          value={totalIncome}
          toneClass="text-secondary"
          icon={<ArrowUpRight size={15} />}
          currencyCode={currencyCode}
        />
        <KpiCell
          label={t("search.totalSpent")}
          value={totalSpent}
          toneClass="text-on-surface"
          icon={<ArrowDownRight size={15} />}
          currencyCode={currencyCode}
        />
        <KpiCell
          label={t("search.netFlow")}
          value={netFlow}
          toneClass={netFlow >= 0 ? "text-secondary" : "text-error"}
          icon={<Minus size={15} />}
          currencyCode={currencyCode}
        />
      </div>

      {/* ── Chart ─────────────────────────────────────────────────────────── */}
      <Panel title={t("search.summaryTrends")} actions={segmented}>
        <div className="h-[220px]">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant">
              <BarChart3 size={20} className="text-outline" />
              <p className="text-sm font-medium">{t("search.noData")}</p>
            </div>
          ) : view === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="30%" barGap={2} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART.grid} />
                <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
                  cursor={{ fill: CHART.cursor }}
                />
                <Legend {...LEGEND_PROPS} />
                <Bar dataKey="income" name={t("search.chartLegend.income")} fill={COLOR_INCOME} radius={[2, 2, 0, 0]} />
                <Bar dataKey="expenses" name={t("search.chartLegend.expenses")} fill={COLOR_EXPENSE} radius={[2, 2, 0, 0]} />
                <Bar dataKey="assets" name={t("search.chartLegend.assets")} fill={COLOR_ASSET} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : view === "line" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART.grid} />
                <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
                  cursor={{ stroke: CHART.grid }}
                />
                <Legend {...LEGEND_PROPS} />
                <Line
                  type="monotone"
                  dataKey="income"
                  name={t("search.chartLegend.income")}
                  stroke={COLOR_INCOME}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name={t("search.chartLegend.expenses")}
                  stroke={COLOR_EXPENSE}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="assets"
                  name={t("search.chartLegend.assets")}
                  stroke={COLOR_ASSET}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="80%"
                  dataKey="value"
                  stroke={CHART.surface}
                  strokeWidth={2}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />} />
                <Legend {...LEGEND_PROPS} />
              </RPieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Panel>
    </div>
  );
}
