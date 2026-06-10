import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector,
} from "recharts";
import { formatCurrency } from "../../../utils/currency";
import type { CategorySlice } from "../hooks/useLedgerData";

// ── Colour palette ────────────────────────────────────────────────────────────
const PALETTE = [
  "#818cf8", // indigo-400
  "#f472b6", // pink-400
  "#34d399", // emerald-400
  "#fb923c", // orange-400
  "#60a5fa", // blue-400
  "#facc15", // yellow-400
  "#a78bfa", // violet-400
  "#4ade80", // green-400
  "#f87171", // red-400
  "#38bdf8", // sky-400
  "#c084fc", // purple-400
  "#2dd4bf", // teal-400
];

function colorFor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

// ── Custom active shape (enlarges on hover) ───────────────────────────────────
function ActiveShape(props: any) {
  const {
    cx, cy,
    innerRadius, outerRadius,
    startAngle, endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
    </g>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, currencyCode }: any) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: { emoji, percentage } } = payload[0];
  return (
    <div className="bg-surface-container border border-outline-variant/30 rounded-xl shadow-xl px-4 py-3 text-xs space-y-0.5 min-w-[160px]">
      <p className="font-black text-on-surface mb-1">
        {emoji ? `${emoji} ` : ""}{name}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-on-surface-variant">Amount</span>
        <span className="font-bold text-on-surface tabular-nums">
          {formatCurrency(value, currencyCode)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-on-surface-variant">Share</span>
        <span className="font-bold text-on-surface tabular-nums">{percentage}%</span>
      </div>
    </div>
  );
}

// ── Legend item ───────────────────────────────────────────────────────────────
function LegendRow({
  slice,
  color,
  currencyCode,
  isActive,
  onHover,
}: {
  slice: CategorySlice;
  color: string;
  currencyCode: string;
  isActive: boolean;
  onHover: (active: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 py-1.5 px-2 rounded-lg cursor-default transition-colors ${
        isActive ? "bg-surface-container" : "hover:bg-surface-container/60"
      }`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Colour dot */}
      <span
        className="shrink-0 w-2.5 h-2.5 rounded-full"
        style={{ background: color }}
      />

      {/* Emoji + name */}
      <span className="flex-1 min-w-0 text-xs font-semibold text-on-surface truncate">
        {slice.emoji ? `${slice.emoji} ` : ""}
        {slice.name}
      </span>

      {/* Percentage */}
      <span
        className="text-[10px] font-black tabular-nums shrink-0"
        style={{ color }}
      >
        {slice.percentage}%
      </span>

      {/* Amount */}
      <span className="text-xs font-bold text-on-surface-variant tabular-nums shrink-0">
        {formatCurrency(slice.value, currencyCode)}
      </span>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface CategoryBreakdownProps {
  data: CategorySlice[];
  currencyCode: string;
  totalSpent: number;
}

const MAX_VISIBLE = 6;

// ── Main component ────────────────────────────────────────────────────────────
export function CategoryBreakdown({ data, currencyCode, totalSpent }: CategoryBreakdownProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const isEmpty = data.length === 0;

  // Collapse long lists into an "Others" slice for the chart
  const visibleSlices = showAll ? data : data.slice(0, MAX_VISIBLE);
  const otherSlices   = showAll ? [] : data.slice(MAX_VISIBLE);
  const othersTotal   = otherSlices.reduce((s, c) => s + c.value, 0);
  const othersPerc    = otherSlices.reduce((s, c) => s + c.percentage, 0);

  const chartData: (CategorySlice & { color: string })[] = [
    ...visibleSlices.map((s, i) => ({ ...s, color: colorFor(i) })),
    ...(othersTotal > 0 && !showAll
      ? [{ name: t("search.categoryBreakdown.others"), emoji: null, value: othersTotal, percentage: othersPerc, color: "#475569" }]
      : []),
  ];

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-on-surface font-bold">
          <LayoutGrid size={16} className="text-secondary" />
          <h3 className="text-sm">{t("search.categoryBreakdown.title")}</h3>
        </div>

        {data.length > MAX_VISIBLE && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
          >
            {showAll
              ? t("expenses.charts.categoryDonut.showLess")
              : t("expenses.charts.categoryDonut.viewAll", { count: data.length })}
          </button>
        )}
      </div>

      {isEmpty ? (
        /* ── Empty state ───────────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant/50">
          <LayoutGrid size={32} className="mb-2 opacity-40" />
          <p className="text-xs font-semibold">{t("search.categoryBreakdown.noData")}</p>
        </div>
      ) : (
        /* ── Chart + legend layout ─────────────────────────────────────────── */
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Donut */}
          <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={ActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={activeIndex === null || activeIndex === i ? 0.92 : 0.35} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {activeIndex !== null && chartData[activeIndex] ? (
                <>
                  <span className="text-lg">{chartData[activeIndex].emoji ?? "📦"}</span>
                  <span
                    className="text-[11px] font-black tabular-nums mt-0.5"
                    style={{ color: chartData[activeIndex].color }}
                  >
                    {chartData[activeIndex].percentage}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    {t("search.totalSpent")}
                  </span>
                  <span className="text-sm font-black text-on-surface tabular-nums mt-0.5">
                    {formatCurrency(totalSpent, currencyCode)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Ranked legend */}
          <div className="flex-1 w-full space-y-0.5 min-w-0">
            {chartData.map((slice, i) => (
              <LegendRow
                key={slice.name}
                slice={slice}
                color={slice.color}
                currencyCode={currencyCode}
                isActive={activeIndex === i}
                onHover={(active) => setActiveIndex(active ? i : null)}
              />
            ))}

            {/* Progress bar for each item (desktop only, subtle) */}
            <div className="hidden sm:block mt-3 space-y-1.5">
              {chartData.map((slice, i) => (
                <div key={slice.name} className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${slice.percentage}%`,
                        background: slice.color,
                        opacity: activeIndex === null || activeIndex === i ? 1 : 0.3,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
