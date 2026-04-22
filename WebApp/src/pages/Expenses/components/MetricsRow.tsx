import { useExpenses } from "../../../context/ExpensesContext";
import { usePeriodMetrics } from "../hooks/usePeriodMetrics";
import { useUserPreferences } from "../../../context/UserPreferencesContext";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { formatCompactCurrency } from "../../../utils/currency";

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct > 0;
  const color = up ? "text-red-400" : "text-green-500";
  const arrow = up ? "↑" : "↓";
  return (
    <span className={`text-xs font-black ${color} flex items-center gap-0.5`}>
      {arrow} {Math.abs(pct).toFixed(0)}%
      <span className="ml-1 text-on-surface-variant/40 font-medium text-[14px]">vs prev.</span>
    </span>
  );
}

function SkeletonCard() {
  // Added the same flex-none and w-[280px] to skeletons so they scroll seamlessly too!
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl h-36 border border-outline-variant/10 animate-pulse flex-none w-[280px] sm:w-auto snap-center" />
  );
}

export default function MetricsRow() {
  const { filters } = useExpenses();
  const m = usePeriodMetrics(filters.startDate, filters.endDate);
  const { monthlyBudget, currency } = useUserPreferences();

  // Skeleton loading state also updated to use the full-bleed layout
  if (m.loading) {
    return (
      <div className="grid grid-cols-1 w-full min-w-0">
        <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 -mx-4 md:-mx-6 px-4 md:px-6 overflow-x-auto pb-4 sm:pb-0 snap-x hide-scrollbar">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <div className="w-1 shrink-0 sm:hidden"></div>
        </div>
      </div>
    );
  }

  const internalFmt = (n: number) => formatCompactCurrency(n, currency.code);

  const pacePct = m.pacePercent;
  const actualVsProjected = m.projectedSpend > 0 ? (m.currentSpend / m.projectedSpend) * 100 : 0;
  const spendRatio = m.totalPeriodDays > 0 ? ((m.currentSpend / (m.projectedSpend || 1)) * 100).toFixed(0) : "—";

  const now = new Date();
  const thisMonthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const thisMonthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const isThisMonth =
    (filters.startDate ?? thisMonthStart) === thisMonthStart && (filters.endDate ?? thisMonthEnd) === thisMonthEnd;

  return (
    <div className="grid grid-cols-1 w-full min-w-0">
      <div
        className={`flex sm:grid gap-4 sm:gap-6 -mx-4 md:-mx-6 px-4 md:px-6 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory hide-scrollbar ${
          isThisMonth && monthlyBudget > 0 ? "sm:grid-cols-4" : "sm:grid-cols-3"
        }`}
      >
        {/* ── Card 1: Total Spend ── */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between flex-none w-[280px] sm:w-auto snap-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Spend</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">
              {internalFmt(m.currentSpend)}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <DeltaBadge pct={m.spendDeltaPct} />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
              <span>Period progress</span>
              <span>{pacePct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${m.isRunningHot ? "bg-red-400" : "bg-primary"}`}
                style={{ width: `${Math.min(100, actualVsProjected)}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant/50 font-medium">Spent {spendRatio}% of projected total</p>
          </div>
        </div>

        {/* ── Card 2: Projected Spend ── */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden flex-none w-[280px] sm:w-auto snap-center">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Projected Spend</span>
          </div>
          <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">
            {internalFmt(m.projectedSpend)}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            {m.isRunningHot ? (
              <span className="text-xs font-black text-red-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span> Running hot
              </span>
            ) : (
              <span className="text-xs font-black text-green-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> On track
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-on-surface-variant mt-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">speed</span>
            {internalFmt(m.dailyAverage)} / day avg · {m.daysElapsed} of {m.totalPeriodDays} days
          </p>
        </div>

        {/* ── Card 3: Top Category ── */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex-none w-[280px] sm:w-auto snap-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">pie_chart</span>
            </div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Top Category</span>
          </div>
          {m.topCategory ? (
            <>
              <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight flex items-center gap-2 truncate">
                {m.topCategory.emoji && <span>{m.topCategory.emoji}</span>}
                <span className="truncate">{m.topCategory.name}</span>
              </h2>
              <p className="text-xs font-bold text-on-surface-variant mt-2 ml-1 flex items-center gap-1">
                {internalFmt(m.topCategory.amount)} <span className="opacity-40">·</span>{" "}
                {m.topCategoryPercent.toFixed(0)}% of total
              </p>
            </>
          ) : (
            <p className="text-sm font-bold text-on-surface-variant/40 mt-4">No expense data</p>
          )}
        </div>

        {/* ── Card 4: Monthly Budget ── */}
        {isThisMonth &&
          monthlyBudget > 0 &&
          (() => {
            const budgetPct = Math.min(100, (m.currentSpend / monthlyBudget) * 100);
            const over = m.currentSpend > monthlyBudget;
            const remaining = monthlyBudget - m.currentSpend;
            return (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex-none w-[280px] sm:w-auto snap-center">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${over ? "bg-error/10 text-error" : "text-primary bg-primary/10"}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Monthly Budget
                  </span>
                </div>
                <h2
                  className={`text-3xl font-black font-headline tracking-tight ${over ? "text-error" : "text-on-surface"}`}
                >
                  {internalFmt(monthlyBudget)}
                </h2>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                    <span>{over ? "Over budget" : `${internalFmt(remaining)} left`}</span>
                    <span>{budgetPct.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${budgetPct >= 100 ? "bg-error" : budgetPct >= 80 ? "bg-amber-400" : "bg-primary"}`}
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant/50 font-medium">
                    Spent {internalFmt(m.currentSpend)} of {internalFmt(monthlyBudget)}
                  </p>
                </div>
              </div>
            );
          })()}

        {/* ── SPACER: Ensures the last card doesn't stick to the right edge when fully scrolled ── */}
        <div className="w-1 shrink-0 sm:hidden"></div>
      </div>
    </div>
  );
}
