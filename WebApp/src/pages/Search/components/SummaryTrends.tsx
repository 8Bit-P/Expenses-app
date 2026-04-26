import { useState } from "react";
import {
  BarChart2,
  TrendingUp,
  PieChart,
  BarChart3,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";
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
import type { ChartBucket } from "../hooks/useLedgerData";

type ChartView = "bar" | "line" | "donut";

interface SummaryTrendsProps {
  totalSpent: number;
  totalIncome: number;
  netFlow: number;
  currencyCode: string;
  chartData: ChartBucket[];
}

// ── Colours ───────────────────────────────────────────────────────────────────
const COLOR_INCOME = "#34d399";   // emerald-400
const COLOR_EXPENSE = "#f87171";  // red-400
const COLOR_ASSET = "#a78bfa";    // violet-400

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, currencyCode }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container border border-outline-variant/30 rounded-xl shadow-xl px-4 py-3 text-xs space-y-1 min-w-[150px]">
      <p className="font-black text-on-surface mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold text-on-surface tabular-nums">
            {formatCurrency(p.value, currencyCode)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  color,
  icon,
  currencyCode,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  currencyCode: string;
}) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-sm flex-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <span style={{ color }} className="opacity-70">
          {icon}
        </span>
      </div>
      <span
        className="text-2xl font-black tabular-nums tracking-tight"
        style={{ color }}
      >
        {value >= 0 ? "" : "−"}
        {formatCurrency(Math.abs(value), currencyCode)}
      </span>
    </div>
  );
}

export function SummaryTrends({
  totalSpent,
  totalIncome,
  netFlow,
  currencyCode,
  chartData,
}: SummaryTrendsProps) {
  const [view, setView] = useState<ChartView>("bar");

  const isEmpty = chartData.length === 0;

  // Donut data
  const donutData = [
    { name: "Income", value: totalIncome, color: COLOR_INCOME },
    { name: "Transactions", value: totalSpent, color: COLOR_EXPENSE },
    { name: "Assets", value: chartData.reduce((s, d) => s + d.assets, 0), color: COLOR_ASSET },
  ].filter((d) => d.value > 0);

  const viewButtons: { key: ChartView; icon: React.ReactNode; label: string }[] = [
    { key: "bar", icon: <BarChart2 size={14} />, label: "Bar" },
    { key: "line", icon: <TrendingUp size={14} />, label: "Line" },
    { key: "donut", icon: <PieChart size={14} />, label: "Donut" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── KPI Cards Row ──────────────────────────────────────────────────── */}
      <div className="flex gap-4">
        <KpiCard
          label="Total Income"
          value={totalIncome}
          color={COLOR_INCOME}
          icon={<ArrowUpRight size={16} />}
          currencyCode={currencyCode}
        />
        <KpiCard
          label="Total Spent"
          value={totalSpent}
          color={COLOR_EXPENSE}
          icon={<ArrowDownRight size={16} />}
          currencyCode={currencyCode}
        />
        <KpiCard
          label="Net Flow"
          value={netFlow}
          color={netFlow >= 0 ? COLOR_INCOME : COLOR_EXPENSE}
          icon={<Minus size={16} />}
          currencyCode={currencyCode}
        />
      </div>

      {/* ── Chart Card ─────────────────────────────────────────────────────── */}
      <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col" style={{ height: 260 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2 text-on-surface font-bold">
            <BarChart3 size={16} className="text-secondary" />
            <h3 className="text-sm">Summary Trends</h3>
          </div>

          {/* Segmented toggle */}
          <div className="flex items-center gap-0.5 bg-surface-container rounded-lg p-0.5 border border-outline-variant/20">
            {viewButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setView(btn.key)}
                title={btn.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  view === btn.key
                    ? "bg-surface-container-highest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 min-h-0">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50">
              <BarChart3 size={32} className="mb-1 opacity-40" />
              <p className="text-xs font-semibold">No data to display</p>
            </div>
          ) : view === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="30%" barGap={2}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
                  cursor={{ fill: "rgba(148,163,184,0.05)" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
                />
                <Bar dataKey="income" name="Income" fill={COLOR_INCOME} radius={[3, 3, 0, 0]} />
                <Bar dataKey="expenses" name="Spent" fill={COLOR_EXPENSE} radius={[3, 3, 0, 0]} />
                <Bar dataKey="assets" name="Assets" fill={COLOR_ASSET} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : view === "line" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke={COLOR_INCOME}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Spent"
                  stroke={COLOR_EXPENSE}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="assets"
                  name="Assets"
                  stroke={COLOR_ASSET}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            // Donut
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="78%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 10 }}
                />
              </RPieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
