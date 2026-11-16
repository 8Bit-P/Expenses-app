import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine, CartesianGrid } from "recharts";
import { formatCurrency, formatCompactCurrency } from "../../../utils/currency";
import { AXIS_TICK, CHART } from "../../../constants/chartColors";
import Panel from "../../../components/ui/Panel";
import { useAccounts } from "../../../hooks/useAccounts";
import type { AccountWithBalance } from "../../../types/accounts";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  currencyCode,
}: Partial<TooltipContentProps<ValueType, NameType>> & { currencyCode: string }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload as AccountWithBalance & { displayBalance: number };
  const isNeg = entry.balance < 0;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg px-3 py-2 text-xs space-y-1 min-w-[160px]">
      <p className="font-medium text-on-surface flex items-center gap-2">
        <span>{entry.icon || "🏦"}</span>
        {entry.name}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-on-surface-variant">Balance</span>
        <span className={`font-medium tabular-nums ${isNeg ? "text-error" : "text-on-surface"}`}>
          {isNeg ? "−" : "+"}
          {formatCurrency(Math.abs(entry.balance), currencyCode)}
        </span>
      </div>
    </div>
  );
}

// ── Legend row with thin magnitude bar ────────────────────────────────────────
function AccountRow({
  account,
  currencyCode,
  share,
  isActive,
  onHover,
}: {
  account: AccountWithBalance;
  currencyCode: string;
  share: number;
  isActive: boolean;
  onHover: (active: boolean) => void;
}) {
  const isNeg = account.balance < 0;
  return (
    <div
      className={`-mx-2 px-2 py-2 rounded-md cursor-default transition-colors ${
        isActive ? "bg-surface-container-low" : ""
      }`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: account.color }} />
        <span className="flex-1 min-w-0 text-[13px] text-on-surface truncate">
          {account.icon || "🏦"} {account.name}
        </span>
        <span
          className={`text-[13px] font-medium tabular-nums shrink-0 ${isNeg ? "text-error" : "text-on-surface"}`}
        >
          {isNeg ? "−" : "+"}
          {formatCurrency(Math.abs(account.balance), currencyCode)}
        </span>
      </div>
      <div className="mt-1.5 ml-[18px] h-1 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${share}%`, background: isNeg ? CHART.expense : account.color }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface AccountsBreakdownProps {
  currencyCode: string;
}

export function AccountsBreakdown({ currencyCode }: AccountsBreakdownProps) {
  const { t } = useTranslation();
  const { accounts, isLoading } = useAccounts();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Only show this widget if the user has accounts
  if (isLoading || accounts.length === 0) return null;

  // Build chart data: use absolute value for bar height, colour by sign
  const chartData = accounts.map((acc) => ({
    ...acc,
    displayBalance: Math.abs(acc.balance),
  }));

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const isNegTotal = totalBalance < 0;
  const maxAbs = Math.max(...chartData.map((a) => a.displayBalance), 0);

  const totalBadge = (
    <div className="flex items-baseline gap-2">
      <span className="eyebrow">{t("accounts.breakdown.total", { defaultValue: "Total" })}</span>
      <span className={`text-[15px] font-semibold tabular-nums ${isNegTotal ? "text-error" : "text-on-surface"}`}>
        {isNegTotal ? "−" : "+"}
        {formatCurrency(Math.abs(totalBalance), currencyCode)}
      </span>
    </div>
  );

  return (
    <Panel title={t("accounts.breakdown.title", { defaultValue: "Account Balances" })} actions={totalBadge}>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        {/* ── Bar Chart ─────────────────────────────────────────────────────── */}
        <div className="w-full md:flex-1 h-48 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke={CHART.grid} />
              <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
              <YAxis
                width={64}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCompactCurrency(v, currencyCode)}
              />
              <ReferenceLine y={0} stroke={CHART.grid} />
              <Tooltip
                cursor={{ fill: CHART.cursor }}
                content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
              />
              <Bar dataKey="displayBalance" radius={[3, 3, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.id}
                    fill={entry.balance >= 0 ? entry.color : CHART.expense}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        <div className="w-full md:w-[260px] shrink-0">
          {accounts.map((acc, i) => (
            <AccountRow
              key={acc.id}
              account={acc}
              currencyCode={currencyCode}
              share={maxAbs > 0 ? (Math.abs(acc.balance) / maxAbs) * 100 : 0}
              isActive={activeIndex === i}
              onHover={(active) => setActiveIndex(active ? i : null)}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}
