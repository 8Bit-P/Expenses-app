import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CATEGORY_COLORS, CHART } from "../../../constants/chartColors";

function CellHeader({ index, icon, title, subtitle }: { index: string; icon: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] text-on-surface-variant">{index}</span>
        <span className="material-symbols-outlined text-[18px] text-outline">{icon}</span>
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-on-surface">{title}</h2>
      <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{subtitle}</p>
    </div>
  );
}

// --- 1. Universal Ledger Card ---
function UniversalLedgerCard() {
  const { t } = useTranslation();
  const rows = [
    { emoji: "💰", name: t("landing.features_grid.ledger.row1", { defaultValue: "Salary — May" }), cat: t("landing.features_grid.ledger.catIncome", { defaultValue: "Income" }), amt: "+€3,800", type: "income" },
    { emoji: "🎵", name: t("landing.features_grid.ledger.row2", { defaultValue: "Spotify Premium" }), cat: t("landing.features_grid.ledger.catMedia", { defaultValue: "Media" }), amt: "-€9.99", type: "expense" },
    { emoji: "🛒", name: t("landing.features_grid.ledger.row3", { defaultValue: "Whole Foods" }), cat: t("landing.features_grid.ledger.catGroceries", { defaultValue: "Groceries" }), amt: "-€67.30", type: "expense" },
    { emoji: "🔁", name: t("landing.features_grid.ledger.row4", { defaultValue: "Investment Deposit" }), cat: t("landing.features_grid.ledger.catTransfer", { defaultValue: "Transfer" }), amt: "-€500", type: "expense" },
    { emoji: "💡", name: t("landing.features_grid.ledger.row5", { defaultValue: "AWS Credits" }), cat: t("landing.features_grid.ledger.catUtilities", { defaultValue: "Utilities" }), amt: "-€12.50", type: "expense" },
    { emoji: "🏠", name: t("landing.features_grid.ledger.row6", { defaultValue: "Freelance Project" }), cat: t("landing.features_grid.ledger.catIncome", { defaultValue: "Income" }), amt: "+€900", type: "income" },
  ];
  return (
    <div className="h-full flex flex-col">
      <CellHeader
        index="01"
        icon="table_rows"
        title={t("landing.features_grid.ledger.title")}
        subtitle={t("landing.features_grid.ledger.subtitle")}
      />
      <div className="flex-1 rounded-lg border border-outline-variant overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_7rem_5.5rem] gap-3 px-3 h-8 items-center bg-surface-container-low border-b border-outline-variant">
          <span className="eyebrow">{t("landing.features_grid.ledger.desc")}</span>
          <span className="eyebrow">{t("landing.features_grid.ledger.cat")}</span>
          <span className="eyebrow text-right">{t("landing.features_grid.ledger.amt")}</span>
        </div>
        <div className="divide-y divide-outline-variant">
          {rows.map((tx) => (
            <div
              key={tx.name}
              className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_7rem_5.5rem] gap-3 items-center h-11 px-3 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-sm shrink-0">
                  {tx.emoji}
                </div>
                <span className="text-sm font-medium text-on-surface truncate">{tx.name}</span>
              </div>
              <span className="hidden sm:inline-flex items-center h-5 px-1.5 rounded bg-surface-container text-[11px] font-medium text-on-surface-variant w-fit">
                {tx.cat}
              </span>
              <span className={`text-sm font-medium tabular-nums text-right ${tx.type === "income" ? "text-secondary" : "text-on-surface"}`}>
                {tx.amt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 2. Spending by Category Donut Card ---
function CategoryDonutCard() {
  const { t } = useTranslation();
  const cats = [
    { emoji: "🛒", name: t("landing.features_grid.donut.cat1", { defaultValue: "Groceries" }), pct: 34, color: CATEGORY_COLORS[0], amt: "€342" },
    { emoji: "🎵", name: t("landing.features_grid.donut.cat2", { defaultValue: "Entertainment" }), pct: 22, color: CATEGORY_COLORS[1], amt: "€221" },
    { emoji: "🍽️", name: t("landing.features_grid.donut.cat3", { defaultValue: "Dining" }), pct: 18, color: CATEGORY_COLORS[2], amt: "€181" },
    { emoji: "💡", name: t("landing.features_grid.donut.cat4", { defaultValue: "Utilities" }), pct: 14, color: CATEGORY_COLORS[4], amt: "€140" },
    { emoji: "📦", name: t("landing.features_grid.donut.cat5", { defaultValue: "Other" }), pct: 12, color: CATEGORY_COLORS[9], amt: "€120" },
  ];
  // Build SVG donut
  const radius = 38;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * radius;
  let cumulativePct = 0;
  const gap = 0.8; // percentage gap between segments

  return (
    <div className="h-full flex flex-col">
      <CellHeader
        index="02"
        icon="donut_large"
        title={t("landing.features_grid.donut.title")}
        subtitle={t("landing.features_grid.donut.subtitle")}
      />
      <div className="flex flex-col items-center gap-6 flex-1">
        {/* SVG Donut */}
        <div className="relative shrink-0 flex justify-center">
          <svg width="128" height="128" viewBox="0 0 100 100">
            {cats.map((cat) => {
              const segPct = cat.pct - gap;
              const dashArray = (segPct / 100) * circumference;
              const dashOffset = -((cumulativePct / 100) * circumference);
              cumulativePct += cat.pct;
              return (
                <circle
                  key={cat.name}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth="11"
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 50 50)"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-semibold tracking-tight tabular-nums text-on-surface">€1,004</span>
            <span className="text-[10px] font-medium text-on-surface-variant">{t("landing.features_grid.donut.expenses")}</span>
          </div>
        </div>
        {/* Legend */}
        <div className="w-full divide-y divide-outline-variant border-t border-outline-variant">
          {cats.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2.5 h-8">
              <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-xs text-on-surface flex-1 truncate">{cat.name}</span>
              <span className="text-[11px] text-on-surface-variant tabular-nums">{cat.pct}%</span>
              <span className="w-12 text-right text-xs font-medium text-on-surface tabular-nums shrink-0">{cat.amt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 3. Action Center Inbox Card ---
function ActionCenterCard() {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col">
      <CellHeader
        index="03"
        icon="inbox"
        title={t("landing.features_grid.actionCenter.title")}
        subtitle={t("landing.features_grid.actionCenter.subtitle")}
      />
      <div className="flex-1 space-y-4">
        {/* Review widget item */}
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-md bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-sm">❓</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">{t("landing.features_grid.actionCenter.unlabeled")}</p>
              <p className="text-[11px] font-medium text-amber-600">{t("landing.features_grid.actionCenter.pending")}</p>
            </div>
            <span className="text-sm font-medium tabular-nums text-on-surface">-€42.00</span>
          </div>
          <div className="flex gap-1.5">
            <div className="flex-1 h-7 px-2 rounded-md border border-outline-variant bg-surface-container-lowest flex items-center justify-between min-w-0">
              <span className="text-[11px] text-on-surface-variant truncate">{t("landing.features_grid.actionCenter.selectCategory")}</span>
              <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
            </div>
            <button type="button" tabIndex={-1} className="h-7 px-2.5 rounded-md bg-primary text-on-primary text-[11px] font-medium">
              {t("landing.features_grid.actionCenter.approve")}
            </button>
            <button type="button" tabIndex={-1} className="h-7 px-2 rounded-md border border-outline-variant bg-surface-container-lowest text-[11px] font-medium text-on-surface-variant">
              {t("landing.features_grid.actionCenter.discard")}
            </button>
          </div>
        </div>
        {/* Alerts */}
        <div className="divide-y divide-outline-variant border-y border-outline-variant">
          {[
            { dot: "bg-amber-500", label: t("landing.features_grid.actionCenter.netflix"), pill: t("landing.features_grid.actionCenter.upcoming"), pillCls: "text-amber-600 bg-amber-500/10" },
            { dot: "bg-error", label: t("landing.features_grid.actionCenter.budgetOver"), pill: t("landing.features_grid.actionCenter.alert"), pillCls: "text-error bg-error/10" },
            { dot: "bg-secondary", label: t("landing.features_grid.actionCenter.salaryCredit"), pill: t("landing.features_grid.actionCenter.income"), pillCls: "text-secondary bg-secondary/10" },
          ].map(({ dot, label, pill, pillCls }) => (
            <div key={label} className="flex items-center gap-2.5 h-10">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
              <span className="text-on-surface text-xs flex-1 truncate">{label}</span>
              <span className={`inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium shrink-0 ${pillCls}`}>{pill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 4. Accounts Card ---
function AccountsCard() {
  const { t } = useTranslation();
  const accounts = [
    { emoji: "🏦", name: t("landing.features_grid.accounts.a1", { defaultValue: "Main Checking" }), balance: 4500 },
    { emoji: "💰", name: t("landing.features_grid.accounts.a2", { defaultValue: "Savings" }), balance: 12000 },
    { emoji: "💳", name: t("landing.features_grid.accounts.a3", { defaultValue: "Credit Card" }), balance: -1200 },
  ];
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);
  return (
    <div className="h-full flex flex-col">
      <CellHeader
        index="04"
        icon="account_balance"
        title={t("landing.features_grid.accounts.title")}
        subtitle={t("landing.features_grid.accounts.subtitle")}
      />
      <div className="flex-1 flex flex-col">
        <div className="divide-y divide-outline-variant border-y border-outline-variant">
          {accounts.map((a) => (
            <div key={a.name} className="flex items-center justify-between gap-3 h-14">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-base shrink-0">
                  {a.emoji}
                </div>
                <span className="text-sm font-medium text-on-surface truncate">{a.name}</span>
              </div>
              <span className={`text-sm font-medium tabular-nums ${a.balance >= 0 ? "text-on-surface" : "text-error"}`}>
                {a.balance >= 0 ? "" : "-"}€{Math.abs(a.balance).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-6 flex items-end justify-between">
          <span className="font-mono text-[11px] text-on-surface-variant">Σ</span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums text-on-surface">
            €{total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- 5. Spending Trend Card ---
function SpendingTrendCard() {
  const { t } = useTranslation();
  const points = [20, 35, 28, 55, 48, 72, 65, 88];
  const max = Math.max(...points);
  const w = 100 / (points.length - 1);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * w} ${100 - (p / max) * 80}`).join(" ");

  return (
    <div className="h-full flex flex-col">
      <CellHeader
        index="05"
        icon="trending_up"
        title={t("landing.features_grid.trends.title")}
        subtitle={t("landing.features_grid.trends.subtitle")}
      />
      {/* KPI row */}
      <div className="grid grid-cols-3 border-y border-outline-variant divide-x divide-outline-variant mb-4 shrink-0">
        {[
          { label: t("landing.features_grid.trends.income"), val: "€5,200", color: "text-secondary" },
          { label: t("landing.features_grid.trends.spent"), val: "€3,840", color: "text-on-surface" },
          { label: t("landing.features_grid.trends.flow"), val: "+€1,360", color: "text-on-surface" },
        ].map(({ label, val, color }) => (
          <div key={label} className="py-2.5 px-2 first:pl-0 min-w-0">
            <p className="text-[11px] text-on-surface-variant mb-0.5 truncate">{label}</p>
            <p className={`text-sm font-semibold tabular-nums ${color}`}>{val}</p>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="flex-1 relative min-h-[100px]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute left-0 right-0 border-t border-outline-variant" style={{ top: `${i * 33}%` }} />
        ))}
        <svg viewBox="0 0 100 100" className="relative w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="runGradLanding" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.primary} stopOpacity="0.12" />
              <stop offset="100%" stopColor={CHART.primary} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#runGradLanding)" />
          <path
            d={pathD}
            stroke={CHART.primary}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Dashed forecast extension */}
          <path
            d={`M ${(points.length - 1) * w} ${100 - (points[points.length - 1] / max) * 80} L 100 ${100 - 0.95 * 80}`}
            stroke={CHART.axis}
            strokeWidth="1.5"
            strokeDasharray="4,4"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5 shrink-0">
        <span className="inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium bg-surface-container text-on-surface">
          {t("landing.features_grid.trends.pace", { pct: 12 })}
        </span>
        <span className="inline-flex items-center h-5 px-1.5 rounded text-[11px] font-medium bg-surface-container text-on-surface-variant">
          {t("landing.features_grid.trends.predicted", { amount: "€4,800" })}
        </span>
      </div>
    </div>
  );
}

const boxes = [
  { id: "ledger", span: "md:col-span-2", component: <UniversalLedgerCard /> },
  { id: "donut", span: "md:col-span-1", component: <CategoryDonutCard /> },
  { id: "action", span: "md:col-span-1", component: <ActionCenterCard /> },
  { id: "accounts", span: "md:col-span-1", component: <AccountsCard /> },
  { id: "trends", span: "md:col-span-1", component: <SpendingTrendCard /> },
];

export default function FeaturesGrid() {
  const { t } = useTranslation();
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-on-surface mb-10 md:mb-14"
        >
          <div className="lg:col-span-8">
            <span className="font-mono text-[11px] text-on-surface-variant">§ 01</span>
            <h2 className="mt-4 font-display font-normal text-[40px] md:text-[56px] leading-[0.95] tracking-[-0.01em] text-on-surface">
              {t("landing.features.title")}{" "}
              <span className="text-on-surface-variant">
                {t("landing.features.subtitle_accent", { defaultValue: "Nothing you don't." })}
              </span>
            </h2>
          </div>
          <p className="lg:col-span-4 lg:self-end text-base text-on-surface-variant leading-relaxed">
            {t("landing.features.subtitle")}
          </p>
        </motion.div>

        {/* Bordered feature grid — shared hairlines via gap-px */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant border border-outline-variant"
        >
          {boxes.map((box) => (
            <div key={box.id} className={`${box.span} bg-surface-container-lowest p-6 md:p-8 min-h-[360px]`}>
              {box.component}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
