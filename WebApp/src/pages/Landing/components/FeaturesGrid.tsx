import { motion, type Variants } from "framer-motion";
import { TrendingUp, AlertTriangle, BarChart2, ListOrdered } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function RunRatesCard() {
  const { t } = useTranslation();
  const points = [20, 35, 28, 55, 48, 72, 65, 88];
  const max = Math.max(...points);
  const w = 100 / (points.length - 1);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * w} ${100 - (p / max) * 80}`).join(" ");

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400">
          <TrendingUp size={18} />
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">{t("landing.features.runRates.title")}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{t("landing.features.runRates.desc")}</p>
        </div>
      </div>
      <div className="flex-1 relative min-h-[120px]">
        {/* Grid lines */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute left-0 right-0 border-t border-slate-800/60" style={{ top: `${i * 33}%` }} />
        ))}
        <svg viewBox={`0 0 100 100`} className="w-full h-full" preserveAspectRatio="none">
          {/* Gradient fill */}
          <defs>
            <linearGradient id="runGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pathD} L 100 100 L 0 100 Z`} fill="url(#runGrad)" />
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
          {/* Dots */}
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
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-violet-400 font-semibold bg-violet-500/10 px-2 py-1 rounded-full">
          {t("landing.features.runRates.pace", { pct: 12 })}
        </span>
      </div>
    </div>
  );
}

function ActionCenterCard() {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
          <AlertTriangle size={18} />
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">{t("landing.features.actionCenter.title")}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{t("landing.features.actionCenter.desc")}</p>
        </div>
      </div>
      <div className="space-y-3 flex-1">
        {[
          { label: t("landing.features.actionCenter.netflix"), color: "bg-amber-400", pill: t("landing.features.actionCenter.upcoming") },
          { label: t("landing.features.actionCenter.budget"), color: "bg-red-400", pill: t("landing.features.actionCenter.alert") },
          { label: t("landing.features.actionCenter.salary"), color: "bg-emerald-400", pill: t("landing.features.actionCenter.income") },
        ].map(({ label, color, pill }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
            <span className="text-slate-300 text-xs font-medium flex-1">{label}</span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-700/60 px-2 py-0.5 rounded-full">
              {pill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssetTrackingCard() {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
          <BarChart2 size={18} />
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">{t("landing.features.assets.title")}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{t("landing.features.assets.desc")}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">{t("landing.features.assets.total")}</p>
        <p className="text-4xl font-black text-white mb-1">€22,140</p>
        <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
          {t("landing.features.assets.allTime")}
        </span>
        <div className="w-full mt-5 space-y-2">
          {[
            { label: t("landing.features.assets.stocks"), pct: 55, color: "bg-violet-500" },
            { label: t("landing.features.assets.etfs"), pct: 30, color: "bg-indigo-400" },
            { label: t("landing.features.assets.crypto"), pct: 15, color: "bg-emerald-400" },
          ].map(({ label, pct, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-12 text-left">{label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-800">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-slate-400 font-semibold w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecureLedgerCard() {
  const { t } = useTranslation();
  const txns = [
    { name: t("landing.features.ledger.spotify"), cat: t("landing.features.ledger.catEntertainment"), amt: "-€9.99", color: "text-red-400" },
    { name: t("landing.features.ledger.salary"), cat: t("landing.features.ledger.catIncome"), amt: "+€3,800", color: "text-emerald-400" },
    { name: t("landing.features.ledger.groceries"), cat: t("landing.features.ledger.catGroceries"), amt: "-€67.30", color: "text-red-400" },
    { name: t("landing.features.ledger.utilities"), cat: t("landing.features.ledger.catUtilities"), amt: "-€12.50", color: "text-red-400" },
    { name: t("landing.features.ledger.freelance"), cat: t("landing.features.ledger.catIncome"), amt: "+€900", color: "text-emerald-400" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
          <ListOrdered size={18} />
        </div>
        <div>
          <h2 className="font-black text-white text-lg tracking-tight">{t("landing.features.ledger.title")}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{t("landing.features.ledger.desc")}</p>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        {txns.map((tx) => (
          <div key={tx.name} className="flex items-center gap-3 py-2.5 border-b border-slate-800/60 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{tx.name}</p>
              <p className="text-xs text-slate-500">{tx.cat}</p>
            </div>
            <span className={`text-sm font-bold ${tx.color}`}>{tx.amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const boxes = [
  { id: "run-rates", span: "md:col-span-2 row-span-1", minH: "min-h-[280px]", component: <RunRatesCard /> },
  { id: "action", span: "md:col-span-1 row-span-1", minH: "min-h-[280px]", component: <ActionCenterCard /> },
  { id: "asset", span: "md:col-span-1 row-span-1", minH: "min-h-[280px]", component: <AssetTrackingCard /> },
  { id: "ledger", span: "md:col-span-2 row-span-1", minH: "min-h-[280px]", component: <SecureLedgerCard /> },
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
              whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
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
