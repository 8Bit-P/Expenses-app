import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import { formatCurrency } from "../../../utils/currency";
import { CATEGORY_COLORS, CHART } from "../../../constants/chartColors";
import Panel from "../../../components/ui/Panel";
import type { CategorySlice } from "../hooks/useLedgerData";
import type { SectorProps, TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const OTHERS_COLOR = "var(--outline)";

function colorFor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

// ── Custom active shape (slightly enlarges on hover) ──────────────────────────
function ActiveShape(props: SectorProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={(outerRadius ?? 0) + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke={CHART.surface}
        strokeWidth={2}
      />
    </g>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  currencyCode,
}: Partial<TooltipContentProps<ValueType, NameType>> & { currencyCode: string }) {
  if (!active || !payload?.length) return null;
  const {
    name,
    value,
    payload: { emoji, percentage },
  } = payload[0];
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs space-y-0.5 min-w-[160px]">
      <p className="font-medium text-on-surface mb-1">
        {emoji ? `${emoji} ` : ""}
        {name}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-on-surface-variant">Amount</span>
        <span className="font-medium text-on-surface tabular-nums">{formatCurrency(Number(value), currencyCode)}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-on-surface-variant">Share</span>
        <span className="font-medium text-on-surface tabular-nums">{percentage}%</span>
      </div>
    </div>
  );
}

// ── Legend row with thin share bar ────────────────────────────────────────────
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
      className={`-mx-2 px-2 py-2 rounded-md cursor-default transition-colors ${
        isActive ? "bg-surface-container-low" : ""
      }`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="flex-1 min-w-0 text-[13px] text-on-surface truncate">
          {slice.emoji ? `${slice.emoji} ` : ""}
          {slice.name}
        </span>
        <span className="w-10 text-right text-xs text-on-surface-variant tabular-nums shrink-0">
          {slice.percentage}%
        </span>
        <span className="min-w-[88px] text-right text-[13px] font-medium text-on-surface tabular-nums shrink-0">
          {formatCurrency(slice.value, currencyCode)}
        </span>
      </div>
      <div className="mt-1.5 ml-[18px] h-1 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${Math.min(100, Math.max(0, slice.percentage))}%`, background: color }}
        />
      </div>
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
  const otherSlices = showAll ? [] : data.slice(MAX_VISIBLE);
  const othersTotal = otherSlices.reduce((s, c) => s + c.value, 0);
  const othersPerc = otherSlices.reduce((s, c) => s + c.percentage, 0);

  const chartData: (CategorySlice & { color: string })[] = [
    ...visibleSlices.map((s, i) => ({ ...s, color: colorFor(i) })),
    ...(othersTotal > 0 && !showAll
      ? [
          {
            name: t("search.categoryBreakdown.others"),
            emoji: null,
            value: othersTotal,
            percentage: othersPerc,
            color: OTHERS_COLOR,
          },
        ]
      : []),
  ];

  const toggle =
    data.length > MAX_VISIBLE ? (
      <button
        onClick={() => setShowAll((v) => !v)}
        className="h-8 px-2.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
      >
        {showAll
          ? t("expenses.charts.categoryDonut.showLess")
          : t("expenses.charts.categoryDonut.viewAll", { count: data.length })}
      </button>
    ) : undefined;

  return (
    <Panel title={t("search.categoryBreakdown.title")} actions={toggle}>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-on-surface-variant">
          <LayoutGrid size={20} className="text-outline" />
          <p className="text-sm font-medium">{t("search.categoryBreakdown.noData")}</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
          {/* Donut */}
          <div className="relative shrink-0 w-[176px] h-[176px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="64%"
                  outerRadius="86%"
                  dataKey="value"
                  stroke={CHART.surface}
                  strokeWidth={2}
                  // @ts-expect-error - Recharts types are incomplete for activeIndex
                  activeIndex={activeIndex ?? undefined}
                  activeShape={ActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                    />
                  ))}
                </Pie>
                <Tooltip content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {activeIndex !== null && chartData[activeIndex] ? (
                <>
                  <span className="text-lg leading-none">{chartData[activeIndex].emoji ?? "📦"}</span>
                  <span className="text-sm font-semibold text-on-surface tabular-nums mt-1">
                    {chartData[activeIndex].percentage}%
                  </span>
                </>
              ) : (
                <>
                  <span className="eyebrow">{t("search.totalSpent")}</span>
                  <span className="text-sm font-semibold text-on-surface tabular-nums mt-0.5">
                    {formatCurrency(totalSpent, currencyCode)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Ranked legend */}
          <div className="flex-1 w-full min-w-0">
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
          </div>
        </div>
      )}
    </Panel>
  );
}
