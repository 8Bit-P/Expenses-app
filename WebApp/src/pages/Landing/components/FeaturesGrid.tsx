import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// --- 1. Universal Ledger Card ---
function UniversalLedgerCard() {
  const rows = [
    { emoji: "💰", name: "Salary — May", cat: "Income", amt: "+€3,800", type: "income" },
    { emoji: "🎵", name: "Spotify Premium", cat: "Media", amt: "-€9.99", type: "expense" },
    { emoji: "🛒", name: "Whole Foods", cat: "Groceries", amt: "-€67.30", type: "expense" },
    { emoji: "🔁", name: "Investment Deposit", cat: "Transfer", amt: "↔ €500", type: "transfer" },
    { emoji: "💡", name: "AWS Credits", cat: "Utilities", amt: "-€12.50", type: "expense" },
    { emoji: "🏠", name: "Freelance Project", cat: "Income", amt: "+€900", type: "income" },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
          <span className="material-symbols-outlined text-[18px]">table_rows</span>
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">Universal Ledger</h2>
          <p className="text-slate-400 text-sm mt-0.5">Every transaction, perfectly organized.</p>
        </div>
      </div>
      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-2 px-2 mb-1.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Description</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Category</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Amount</span>
      </div>
      <div className="flex-1 space-y-0 overflow-hidden divide-y divide-slate-800/60">
        {rows.map((tx) => (
          <div key={tx.name} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center py-2.5 px-2 hover:bg-white/3 rounded-lg transition-colors group cursor-default">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-sm shrink-0 group-hover:scale-110 transition-transform">
                {tx.emoji}
              </div>
              <span className="text-sm font-semibold text-slate-200 truncate">{tx.name}</span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md uppercase tracking-tight">
              {tx.cat}
            </span>
            <span className={`text-sm font-black tabular-nums ${tx.type === "income" ? "text-emerald-400" : tx.type === "transfer" ? "text-slate-500" : "text-slate-300"}`}>
              {tx.amt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 2. Spending by Category Donut Card ---
function CategoryDonutCard() {
  const cats = [
    { emoji: "🛒", name: "Groceries", pct: 34, color: "#6366f1", amt: "€342" },
    { emoji: "🎵", name: "Entertainment", pct: 22, color: "#818cf8", amt: "€221" },
    { emoji: "🍽️", name: "Dining", pct: 18, color: "#a78bfa", amt: "€181" },
    { emoji: "💡", name: "Utilities", pct: 14, color: "#c4b5fd", amt: "€140" },
    { emoji: "📦", name: "Other", pct: 12, color: "#334155", amt: "€120" },
  ];
  // Build SVG donut
  const radius = 36;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * radius;
  let cumulativePct = 0;
  const gap = 1.5; // percentage gap between segments

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400">
          <span className="material-symbols-outlined text-[18px]">donut_large</span>
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">Spending by Category</h2>
          <p className="text-slate-400 text-sm mt-0.5">🛒 Groceries leads at 34%</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
        {/* SVG Donut */}
        <div className="relative shrink-0 flex justify-center w-full sm:w-auto">
          <svg width="100" height="100" viewBox="0 0 100 100">
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
                  strokeWidth="16"
                  strokeDasharray={`${dashArray} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 50 50)"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-black text-white">€1,004</span>
            <span className="text-[7px] font-bold uppercase tracking-widest text-slate-600">Expenses</span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex-1 space-y-2">
          {cats.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2.5 group cursor-default">
              <div className="w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform" style={{ backgroundColor: cat.color }} />
              <span className="text-base leading-none">{cat.emoji}</span>
              <span className="text-xs font-semibold text-slate-400 flex-1 group-hover:text-slate-200 transition-colors">{cat.name}</span>
              <span className="text-[10px] font-bold text-slate-600 tabular-nums">{cat.pct}%</span>
              <span className="text-xs font-bold text-slate-300 tabular-nums shrink-0">{cat.amt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 3. Action Center Inbox Card ---
function ActionCenterCard() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
          <span className="material-symbols-outlined text-[18px]">inbox</span>
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">Action Center</h2>
          <p className="text-slate-400 text-sm mt-0.5">Priority alerts, surfaced automatically.</p>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        {/* Review Widget item */}
        <div className="bg-slate-800/50 rounded-2xl p-3 border border-amber-500/10">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-base">❓</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200">Unlabeled Transaction</p>
              <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Pending Verification</p>
            </div>
            <span className="text-sm font-black text-slate-300">-€42.00</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 py-1.5 rounded-lg bg-slate-700/60 flex items-center justify-center">
              <span className="text-[9px] font-bold text-slate-400">Select category</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-violet-600 text-[9px] font-bold text-white">Approve</button>
            <button className="px-2 py-1.5 rounded-lg bg-slate-700/60 text-[9px] font-bold text-slate-500">Discard</button>
          </div>
        </div>
        {/* Alerts */}
        {[
          { dot: "bg-amber-400", label: "Netflix renews in 3 days (€15.99)", pill: "Upcoming", pillCls: "text-amber-400 bg-amber-500/10" },
          { dot: "bg-red-400", label: "Spending 18% over monthly budget", pill: "Alert", pillCls: "text-red-400 bg-red-500/10" },
          { dot: "bg-emerald-400", label: "New salary credited: +€3,800", pill: "Income", pillCls: "text-emerald-400 bg-emerald-500/10" },
        ].map(({ dot, label, pill, pillCls }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
            <span className="text-slate-300 text-xs font-medium flex-1">{label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pillCls}`}>{pill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. Capital Reserves Card ---
function ReservesCard() {
  const reserves = [
    { emoji: "✈️", name: "Travel Fund", current: 1200, target: 3000, color: "bg-violet-500" },
    { emoji: "🚗", name: "New Car", current: 4500, target: 8000, color: "bg-indigo-400" },
    { emoji: "🏠", name: "Emergency Fund", current: 9800, target: 10000, color: "bg-emerald-400" },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
          <span className="material-symbols-outlined text-[18px]">savings</span>
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">Capital Reserves</h2>
          <p className="text-slate-400 text-sm mt-0.5">Virtual savings goals, always on track.</p>
        </div>
      </div>
      <div className="flex-1 space-y-5">
        {reserves.map((r) => {
          const pct = Math.round((r.current / r.target) * 100);
          return (
            <div key={r.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{r.emoji}</span>
                  <span className="text-sm font-bold text-slate-200">{r.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white tabular-nums">€{r.current.toLocaleString()}</span>
                  <span className="text-xs text-slate-600 font-medium"> / €{r.target.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${r.color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-600 font-semibold">{pct}% funded</span>
                <button className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors">Quick Fund →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- 5. Spending Trend Card ---
function SpendingTrendCard() {
  const points = [20, 35, 28, 55, 48, 72, 65, 88];
  const max = Math.max(...points);
  const w = 100 / (points.length - 1);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * w} ${100 - (p / max) * 80}`).join(" ");

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400">
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">Predictive Run Rates</h2>
          <p className="text-slate-400 text-sm mt-0.5">See where your money lands before the month ends.</p>
        </div>
      </div>
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 shrink-0">
        {[
          { label: "Total Income", val: "€5,200", color: "text-emerald-400" },
          { label: "Total Spent", val: "€3,840", color: "text-slate-300" },
          { label: "Net Flow", val: "+€1,360", color: "text-violet-400" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-slate-800/40 rounded-xl p-3 border border-white/5 text-center">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-1">{label}</p>
            <p className={`text-sm font-black tabular-nums ${color}`}>{val}</p>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="flex-1 relative min-h-[100px]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute left-0 right-0 border-t border-slate-800/60" style={{ top: `${i * 33}%` }} />
        ))}
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="runGradLanding" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#runGradLanding)" />
          <path d={pathD} stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dashed forecast extension */}
          <path
            d={`M ${(points.length - 1) * w} ${100 - (points[points.length - 1] / max) * 80} L 100 ${100 - 0.95 * 80}`}
            stroke="#7c3aed"
            strokeWidth="2"
            strokeDasharray="4,4"
            fill="none"
            opacity="0.5"
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={i * w}
              cy={100 - (p / max) * 80}
              r="2.5"
              fill="#7c3aed"
              stroke="#0F172A"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
      <div className="mt-3 flex items-center gap-2 shrink-0">
        <span className="text-xs text-violet-400 font-semibold bg-violet-500/10 px-2 py-1 rounded-full">
          ↑ 12% pace vs last month
        </span>
        <span className="text-xs text-slate-600 font-semibold bg-slate-800/40 px-2 py-1 rounded-full">
          Predicted end: €4,800
        </span>
      </div>
    </div>
  );
}

const boxes = [
  {
    id: "ledger",
    span: "md:col-span-2 row-span-1",
    minH: "min-h-[340px]",
    component: <UniversalLedgerCard />,
  },
  {
    id: "donut",
    span: "md:col-span-1 row-span-1",
    minH: "min-h-[340px]",
    component: <CategoryDonutCard />,
  },
  {
    id: "action",
    span: "md:col-span-1 row-span-1",
    minH: "min-h-[380px]",
    component: <ActionCenterCard />,
  },
  {
    id: "reserves",
    span: "md:col-span-1 row-span-1",
    minH: "min-h-[380px]",
    component: <ReservesCard />,
  },
  {
    id: "trends",
    span: "md:col-span-1 row-span-1",
    minH: "min-h-[380px]",
    component: <SpendingTrendCard />,
  },
];

export default function FeaturesGrid() {
  const { t } = useTranslation();
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            {t("landing.features.title")}{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {t("landing.features.subtitle_accent", { defaultValue: "Nothing you don't." })}
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {t("landing.features.subtitle")}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {boxes.map((box, i) => (
            <motion.div
              key={box.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.012, transition: { duration: 0.2 } }}
              className={`${box.span} ${box.minH} bg-slate-900/60 border border-slate-800 hover:border-violet-500/30 rounded-3xl p-8 transition-colors duration-300 backdrop-blur-sm`}
            >
              {box.component}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
