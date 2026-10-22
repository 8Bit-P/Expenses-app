import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useInvestments } from "../../../hooks/useInvestments";
import { useTransactions } from "../../../hooks/useTransactions";
import { useMemo, useState } from "react";
import { subMonths, endOfMonth, format, parseISO, isAfter } from "date-fns";
import { formatCurrency } from "../../../utils/currency";
import { useTranslation } from "react-i18next";
import { useAccounts } from "../../../hooks/useAccounts";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import Panel from "../../../components/ui/Panel";
import { AXIS_TICK, CHART } from "../../../constants/chartColors";
import type { TFunction } from "i18next";

interface TooltipEntry {
  name: string;
  value: number;
  fill: string;
}

interface WealthTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  currencyCode: string;
  t: TFunction;
}

const CustomTooltip = ({ active, payload, label, currencyCode, t }: WealthTooltipProps) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + Number(entry.value || 0), 0);
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2.5 text-xs min-w-[190px]">
        <p className="eyebrow mb-2">
          {label} {t("dashboard.wealthEvolution.snapshot")}
        </p>
        {[...payload].reverse().map((entry, index) => (
          <div key={index} className="flex justify-between items-center gap-4 py-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.fill }} />
              <span className="text-on-surface-variant">
                {t(`dashboard.wealthEvolution.${entry.name.toLowerCase()}`)}
              </span>
            </div>
            <span className="font-medium text-on-surface tabular-nums">
              {formatCurrency(entry.value, currencyCode)}
            </span>
          </div>
        ))}
        {payload.length > 1 && (
          <div className="flex justify-between items-center gap-4 pt-1.5 mt-1.5 border-t border-outline-variant">
            <span className="text-on-surface-variant">{t("accounts.breakdown.total")}</span>
            <span className="font-semibold text-on-surface tabular-nums">{formatCurrency(total, currencyCode)}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function WealthEvolution() {
  const { t, i18n } = useTranslation();
  const { currency } = useUserPreferences();
  const { assets, isLoading: invLoading } = useInvestments();
  const { transactions, loading: txLoading } = useTransactions({ pageSize: 1000 });
  const { accounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const accountOptions = useMemo(() => {
    if (!accounts) return [];
    return [
      { value: "", label: t("dashboard.wealthEvolution.allAccounts", "Todas las cuentas") },
      ...accounts.map((acc) => ({
        value: acc.id,
        label: `${acc.icon} ${acc.name}`,
      })),
    ];
  }, [accounts, t]);

  const chartData = useMemo(() => {
    if (invLoading || txLoading) return [];

    // 1. Generate last 6 months
    const months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));

    return months.map((m) => {
      const monthEnd = endOfMonth(m);
      const label = format(m, "MMM");

      // Investments: Sum latest snapshot for each asset on or before month end
      let investments = 0;
      if (!selectedAccountId) {
        assets.forEach((asset) => {
          const snap = asset.asset_snapshots.find((s) => !isAfter(parseISO(s.date), monthEnd));
          if (snap) investments += Number(snap.total_value);
        });
      }

      // Liquidity: Cumulative flow (all time up to month end)
      // Since our transactions are order desc, we filter for everything before monthEnd
      const liquidity = transactions
        .filter((tx) => !isAfter(parseISO(tx.date), monthEnd))
        .filter((tx) => (selectedAccountId ? tx.account_id === selectedAccountId : true))
        .reduce((sum, tx) => sum + (tx.type === "income" ? Number(tx.amount) : -Number(tx.amount)), 0);

      return {
        name: label,
        investments,
        liquidity: Math.max(0, liquidity), // Protect against negative chart bars
      };
    });
  }, [assets, transactions, invLoading, txLoading, selectedAccountId]);

  const compactCurrency = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency: currency.code,
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [i18n.language, currency.code],
  );

  const legend = (
    <div className="flex items-center gap-4 text-xs text-on-surface-variant">
      {!selectedAccountId && (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART.primary }} />
          {t("dashboard.wealthEvolution.investments")}
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART.secondary }} />
        {t("dashboard.wealthEvolution.liquidity")}
      </span>
    </div>
  );

  return (
    <Panel
      className="h-full"
      bodyClassName="flex flex-col"
      title={t("dashboard.wealthEvolution.title")}
      subtitle={t("dashboard.wealthEvolution.subtitle")}
      actions={
        accounts && accounts.length > 0 ? (
          <div className="w-[170px] relative z-30">
            <CustomSelect value={selectedAccountId} onChange={setSelectedAccountId} options={accountOptions} size="sm" />
          </div>
        ) : undefined
      }
    >
      {invLoading || txLoading ? (
        <div className="h-[320px] rounded-lg bg-surface-container-low animate-pulse flex items-center justify-center">
          <span className="text-xs text-on-surface-variant">{t("dashboard.syncing")}</span>
        </div>
      ) : (
        <>
          <div className="mb-3">{legend}</div>
          <div className="w-full flex-1 min-h-[290px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={290} debounce={50}>
              <BarChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke={CHART.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={8} tick={AXIS_TICK} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={56}
                  tick={AXIS_TICK}
                  tickFormatter={(val) => compactCurrency.format(val)}
                />
                <Tooltip content={<CustomTooltip currencyCode={currency.code} t={t} />} cursor={{ fill: CHART.cursor }} />
                <Bar
                  dataKey="investments"
                  stackId="wealth"
                  fill={CHART.primary}
                  stroke={CHART.surface}
                  strokeWidth={1}
                  maxBarSize={44}
                />
                <Bar
                  dataKey="liquidity"
                  stackId="wealth"
                  fill={CHART.secondary}
                  radius={[3, 3, 0, 0]}
                  stroke={CHART.surface}
                  strokeWidth={1}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Panel>
  );
}
