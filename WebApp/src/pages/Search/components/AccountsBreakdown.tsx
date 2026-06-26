import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Landmark } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { formatCurrency, formatCompactCurrency } from "../../../utils/currency";
import { useAccounts } from "../../../hooks/useAccounts";
import type { AccountWithBalance } from "../../../types/accounts";

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, currencyCode }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload as AccountWithBalance & { displayBalance: number };
  const isNeg = entry.balance < 0;
  return (
    <div className="bg-surface-container border border-outline-variant/30 rounded-xl shadow-xl px-4 py-3 text-xs space-y-1.5 min-w-[160px]">
      <p className="font-black text-on-surface flex items-center gap-2">
        <span>{entry.icon || "🏦"}</span>
        {entry.name}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-on-surface-variant">Balance</span>
        <span className={`font-bold tabular-nums ${isNeg ? "text-error" : "text-emerald-400"}`}>
          {isNeg ? "−" : "+"}{formatCurrency(Math.abs(entry.balance), currencyCode)}
        </span>
      </div>
    </div>
  );
}

// ── Legend row ────────────────────────────────────────────────────────────────
function AccountRow({
  account,
  currencyCode,
  isActive,
  onHover,
}: {
  account: AccountWithBalance;
  currencyCode: string;
  isActive: boolean;
  onHover: (active: boolean) => void;
}) {
  const isNeg = account.balance < 0;
  return (
    <div
      className={`flex items-center gap-3 py-2 px-2.5 rounded-lg cursor-default transition-colors ${
        isActive ? "bg-surface-container" : "hover:bg-surface-container/60"
      }`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Colour dot */}
      <span
        className="shrink-0 w-2.5 h-2.5 rounded-full"
        style={{ background: account.color }}
      />
      {/* Icon + name */}
      <span className="text-sm">{account.icon || "🏦"}</span>
      <span className="flex-1 min-w-0 text-xs font-semibold text-on-surface truncate">
        {account.name}
      </span>
      {/* Balance */}
      <span
        className={`text-xs font-black tabular-nums shrink-0 ${
          isNeg ? "text-error" : "text-emerald-400"
        }`}
      >
        {isNeg ? "−" : "+"}
        {formatCurrency(Math.abs(account.balance), currencyCode)}
      </span>
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

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-on-surface font-bold">
          <Landmark size={16} className="text-primary" />
          <h3 className="text-sm">{t("accounts.breakdown.title", { defaultValue: "Account Balances" })}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            {t("accounts.breakdown.total", { defaultValue: "Total" })}
          </span>
          <span
            className={`text-sm font-black tabular-nums ${
              isNegTotal ? "text-error" : "text-emerald-400"
            }`}
          >
            {isNegTotal ? "−" : "+"}
            {formatCurrency(Math.abs(totalBalance), currencyCode)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* ── Bar Chart ─────────────────────────────────────────────────────── */}
        <div className="w-full sm:flex-1 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              barCategoryGap="30%"
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "var(--color-on-surface-variant)", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "var(--color-on-surface-variant)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCompactCurrency(v, currencyCode)}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                content={(props) => <CustomTooltip {...props} currencyCode={currencyCode} />}
              />
              <Bar dataKey="displayBalance" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.id}
                    fill={entry.balance >= 0 ? entry.color : "#f87171"}
                    opacity={activeIndex === null || activeIndex === i ? 0.9 : 0.35}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        <div className="w-full sm:w-[220px] space-y-0.5 shrink-0">
          {accounts.map((acc, i) => (
            <AccountRow
              key={acc.id}
              account={acc}
              currencyCode={currencyCode}
              isActive={activeIndex === i}
              onHover={(active) => setActiveIndex(active ? i : null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
