import { useTranslation } from "react-i18next";
import type { AssetWithSnapshots, AssetType } from "../../../types/investments";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import Panel from "../../../components/ui/Panel";
import { CATEGORY_COLORS, CHART } from "../../../constants/chartColors";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { formatCurrency } from "../../../utils/currency";

interface AllocationDonutProps {
  assets: AssetWithSnapshots[];
  stealthMode: boolean;
}

export default function AllocationDonut({ assets, stealthMode }: AllocationDonutProps) {
  const { t } = useTranslation();
  const { currency } = useUserPreferences();

  const TYPE_CONFIG: Record<AssetType, { label: string; hex: string }> = {
    fund:        { label: t("investments.allocation.types.fund"),        hex: CATEGORY_COLORS[0] },
    stock:       { label: t("investments.allocation.types.stock"),       hex: CATEGORY_COLORS[2] },
    crypto:      { label: t("investments.allocation.types.crypto"),      hex: CATEGORY_COLORS[1] },
    real_estate: { label: t("investments.allocation.types.real_estate"), hex: CATEGORY_COLORS[4] },
    cash:        { label: t("investments.allocation.types.cash"),        hex: CATEGORY_COLORS[5] },
    other:       { label: t("investments.allocation.types.other"),       hex: CATEGORY_COLORS[9] },
  };

  const typeValues: Record<string, number> = {};
  let overallTotal = 0;

  assets.forEach((asset) => {
    const latest = asset.asset_snapshots[0];
    if (latest) {
      const val = Number(latest.total_value);
      typeValues[asset.type] = (typeValues[asset.type] || 0) + val;
      overallTotal += val;
    }
  });

  const allocations = Object.entries(typeValues)
    .filter(([, val]) => val > 0)
    .map(([type, val]) => {
      const percentage = overallTotal > 0 ? (val / overallTotal) * 100 : 0;
      return {
        type: type as AssetType,
        value: val,
        percentage,
        config: TYPE_CONFIG[type as AssetType] || TYPE_CONFIG.other,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (!data || !data.config) return null;

      return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: data.config.hex }} />
          <span className="font-medium text-on-surface">{data.config.label}</span>
          <span className="text-on-surface-variant tabular-nums">
            {stealthMode ? "**%" : `${data.percentage.toFixed(1)}%`}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Panel title={t("investments.allocation.title")} className="h-full">
      {allocations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <span className="material-symbols-outlined text-[24px] text-outline">donut_large</span>
          <p className="text-sm font-medium text-on-surface">{t("investments.allocation.noData")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="relative w-full h-[200px]">
            <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0} debounce={50}>
              <PieChart>
                <Pie
                  data={allocations}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="96%"
                  paddingAngle={0}
                  stroke={CHART.surface}
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {allocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.config.hex} />
                  ))}
                </Pie>
                <Tooltip wrapperStyle={{ zIndex: 1000 }} content={renderTooltip} cursor={false} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="eyebrow">{t("investments.allocation.diversified")}</span>
              <span className="text-3xl font-semibold tracking-tight tabular-nums text-on-surface leading-tight">
                {stealthMode ? "?" : allocations.length}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {t("investments.allocation.assetClass", { count: allocations.length })}
              </span>
            </div>
          </div>

          <table className="w-full text-sm">
            <tbody className="divide-y divide-outline-variant border-t border-outline-variant">
              {allocations.map((alloc) => (
                <tr key={alloc.type} className="h-10">
                  <td className="pr-3">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: alloc.config.hex }} />
                      <span className="truncate text-on-surface">{alloc.config.label}</span>
                    </span>
                  </td>
                  <td className="px-2 text-right tabular-nums text-on-surface-variant whitespace-nowrap">
                    {stealthMode ? "**%" : `${alloc.percentage.toFixed(1)}%`}
                  </td>
                  <td className="pl-2 text-right font-medium tabular-nums text-on-surface whitespace-nowrap">
                    {stealthMode ? "****" : formatCurrency(alloc.value, currency.code)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
