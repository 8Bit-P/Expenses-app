import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

// --- Mini components replicating the real app's design language ---

function MockKpiCard({
  label,
  value,
  change,
  changePos,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  change?: string;
  changePos?: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-[#151b2d] rounded-xl p-3 border border-white/5 relative overflow-hidden group">
      <div className={`absolute -top-6 -right-6 w-14 h-14 ${iconBg} rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity`} />
      <div className="flex justify-between items-center mb-3">
        <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center border border-white/5`}>
          <span className={`material-symbols-outlined text-[13px] ${iconColor}`}>{icon}</span>
        </div>
        {change && (
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${changePos ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-black text-white tabular-nums leading-tight">{value}</p>
    </div>
  );
}

function MockTransactionRow({
  emoji,
  name,
  category,
  amount,
  type,
}: {
  emoji: string;
  name: string;
  category: string;
  amount: string;
  type: "income" | "expense" | "transfer";
}) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0 group">
      <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-sm shrink-0">{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-slate-200 truncate">{name}</p>
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight px-1.5 py-0.5 bg-slate-800 rounded-md">{category}</span>
      </div>
      <span className={`text-[11px] font-black tabular-nums ${type === "income" ? "text-emerald-400" : type === "transfer" ? "text-slate-500" : "text-slate-300"}`}>
        {type === "income" ? "+" : type === "transfer" ? "↔" : "-"}{amount}
      </span>
    </div>
  );
}

function MockActionRow({
  label,
  pill,
  pillColor,
  dot,
}: {
  label: string;
  pill: string;
  pillColor: string;
  dot: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-white/5">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="text-slate-300 text-[10px] font-medium flex-1 leading-tight">{label}</span>
      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${pillColor}`}>{pill}</span>
    </div>
  );
}

function MockBarChart() {
  const bars = [
    { invest: 55, cash: 30 },
    { invest: 60, cash: 28 },
    { invest: 58, cash: 32 },
    { invest: 70, cash: 25 },
    { invest: 65, cash: 27 },
    { invest: 80, cash: 22 },
    { invest: 78, cash: 20 },
    { invest: 88, cash: 18 },
    { invest: 85, cash: 19 },
    { invest: 95, cash: 15 },
  ];
  return (
    <div className="flex items-end gap-0.5 h-full px-1">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-[1px]" style={{ height: "100%" }}>
          <div className="w-full rounded-sm bg-violet-500/70" style={{ height: `${b.invest}%` }} />
          <div className="w-full rounded-sm bg-indigo-400/40" style={{ height: `${b.cash}%` }} />
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-widest uppercase"
      >
        <Zap size={12} />
        {t("landing.hero.badge")}
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-center max-w-4xl leading-[0.9] mb-8"
      >
        <span className="bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          {t("landing.hero.headlinePrefix")}
        </span>
        <br />
        <span className="bg-gradient-to-br from-violet-300 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
          {t("landing.hero.headlineSuffix")}
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-xl text-slate-400 max-w-2xl mx-auto text-center leading-relaxed mb-10"
      >
        {t("landing.hero.subheadline")}
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-20"
      >
        <Link
          to="/auth?mode=signup"
          className="group flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-base rounded-full transition-all duration-200 shadow-xl shadow-violet-900/60 hover:shadow-violet-800/80 hover:-translate-y-0.5"
        >
          {t("landing.hero.startFree")}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <a
          href="#pricing"
          className="px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-base rounded-full transition-all duration-200 hover:-translate-y-0.5"
        >
          {t("landing.hero.viewPricing")}
        </a>
      </motion.div>

      {/* Rich Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl relative"
        role="img"
        aria-label="Vault dark mode financial dashboard"
      >
        {/* Glow behind card */}
        <div className="absolute inset-x-0 -bottom-10 h-40 bg-violet-600/20 blur-[60px] rounded-full mx-auto w-3/4 pointer-events-none" />

        <div className="relative rounded-2xl border border-white/10 bg-[#0c1324] overflow-hidden shadow-2xl shadow-black/60 mb-10 sm:mb-0">
          {/* Fake top bar */}
          <div className="h-10 bg-[#0f1929]/80 border-b border-white/5 flex items-center gap-2 px-4">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="ml-4 text-[10px] text-slate-500 font-mono truncate max-w-[100px] sm:max-w-none">vault.app/home</div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex h-5 w-32 rounded-md bg-slate-800/70 border border-white/5 items-center px-2 gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500/40" />
                <div className="h-1.5 flex-1 rounded-full bg-slate-700/60" />
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 border border-white/5" />
            </div>
          </div>

          {/* Mock dashboard UI */}
          <div className="flex flex-col md:flex-row h-auto md:h-[480px]">
            {/* Sidebar */}
            <div className="hidden md:flex w-40 bg-[#0d1628]/80 border-r border-white/5 p-3 flex-col gap-1 shrink-0">
              <div className="flex items-center gap-2 mb-4 px-2 pt-1">
                <div className="w-5 h-5 rounded-md bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full border border-violet-400/60" />
                </div>
                <span className="text-[11px] font-black text-white tracking-wide">Vault</span>
              </div>
              {[
                { label: t("landing.mockup.home"), icon: "cottage", active: true },
                { label: t("landing.mockup.expenses"), icon: "receipt_long", active: false },
                { label: t("landing.mockup.assets"), icon: "auto_graph", active: false },
                { label: t("landing.mockup.recurring"), icon: "sync", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`h-8 rounded-lg flex items-center gap-2 px-2 transition-colors ${item.active ? "bg-violet-500/20" : "hover:bg-white/5"}`}
                >
                  <span className={`material-symbols-outlined text-[14px] ${item.active ? "text-violet-300" : "text-slate-600"}`}>{item.icon}</span>
                  <span className={`text-[10px] font-semibold ${item.active ? "text-violet-200" : "text-slate-600"}`}>{item.label}</span>
                </div>
              ))}
              <div className="mt-auto border-t border-white/5 pt-3 space-y-1">
                <div className="h-8 rounded-lg flex items-center gap-2 px-2">
                  <span className="material-symbols-outlined text-[14px] text-slate-700">settings</span>
                  <span className="text-[10px] font-semibold text-slate-700">Settings</span>
                </div>
              </div>
            </div>

            {/* Main area */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden min-w-0">
              {/* Page title */}
              <div className="hidden sm:flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-white">Vault Overview</h2>
                  <p className="text-[9px] text-slate-600">Real-time financial command center</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-6 px-3 rounded-full bg-violet-600 flex items-center">
                    <span className="text-[9px] font-bold text-white">+ New</span>
                  </div>
                </div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
                <MockKpiCard label={t("landing.mockup.netWorth")} value="€ 48,320" change="+2.1%" changePos icon="account_balance_wallet" iconBg="bg-violet-500/10" iconColor="text-violet-400" />
                <MockKpiCard label={t("landing.mockup.monthlyIncome")} value="€ 5,200" change="+8.3%" changePos icon="trending_up" iconBg="bg-emerald-500/10" iconColor="text-emerald-400" />
                <MockKpiCard label={t("landing.mockup.safeToSpend")} value="€ 61 / day" icon="payments" iconBg="bg-orange-500/10" iconColor="text-orange-400" />
                <MockKpiCard label={t("landing.mockup.investments")} value="€ 22,100" change="+12.4%" changePos icon="auto_graph" iconBg="bg-blue-500/10" iconColor="text-blue-400" />
              </div>

              {/* Charts + Activity row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 min-h-0">
                {/* Wealth Evolution chart */}
                <div className="col-span-2 bg-[#151b2d] rounded-xl border border-white/5 p-3 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{t("landing.mockup.wealthEvolution")}</p>
                      <p className="text-[8px] text-slate-700">Portfolio growth by asset class</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-violet-500/70" /><span className="text-[8px] text-slate-600">Invested</span></div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-indigo-400/40" /><span className="text-[8px] text-slate-600">Liquidity</span></div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <MockBarChart />
                  </div>
                </div>

                {/* Right panel: Activity + Action Center */}
                <div className="flex flex-col gap-2 min-h-0">
                  {/* Recent activity */}
                  <div className="bg-[#151b2d] rounded-xl border border-white/5 p-2.5 flex flex-col flex-1 overflow-hidden">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-2 shrink-0">{t("landing.mockup.recentActivity")}</p>
                    <div className="flex-1 overflow-hidden">
                      <MockTransactionRow emoji="🎵" name="Spotify" category="Media" amount="€9.99" type="expense" />
                      <MockTransactionRow emoji="💰" name="Salary — May" category="Income" amount="€3,800" type="income" />
                      <MockTransactionRow emoji="🛒" name="Whole Foods" category="Groceries" amount="€67" type="expense" />
                    </div>
                  </div>

                  {/* Action Center */}
                  <div className="bg-[#151b2d] rounded-xl border border-white/5 p-2.5 shrink-0">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-2">Action Center</p>
                    <div className="space-y-1.5">
                      <MockActionRow label="Netflix renews in 3 days" pill="Upcoming" pillColor="text-amber-400 bg-amber-500/10" dot="bg-amber-400" />
                      <MockActionRow label="Budget 18% over target" pill="Alert" pillColor="text-red-400 bg-red-500/10" dot="bg-red-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-10 mt-16 text-center"
      >
        {[
          { icon: <Shield size={14} />, label: t("landing.hero.statEncryption") },
          { icon: <TrendingUp size={14} />, label: t("landing.hero.statAnalytics") },
          { icon: <Zap size={14} />, label: t("landing.hero.statAds") },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <span className="text-violet-500">{icon}</span>
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
