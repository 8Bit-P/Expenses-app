import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

import { useTranslation } from "react-i18next";

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
        className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-center max-w-4xl leading-[0.9] mb-8"
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

      {/* Dashboard Screenshot Mockup */}
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

        <div className="relative aspect-video rounded-2xl border border-white/10 bg-slate-900/90 overflow-hidden shadow-2xl shadow-black/60">
          {/* Fake top bar */}
          <div className="h-10 bg-slate-800/80 border-b border-white/5 flex items-center gap-2 px-4">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-4 text-xs text-slate-500 font-mono">vault.app/home</span>
          </div>

          {/* Mock dashboard UI */}
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-44 bg-slate-950/60 border-r border-white/5 p-4 flex flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded bg-violet-500/30 border border-violet-400/40" />
                <span className="text-[11px] font-black text-white tracking-wide">Vault</span>
              </div>
              {[
                { label: t("landing.mockup.home"), active: true },
                { label: t("landing.mockup.expenses"), active: false },
                { label: t("landing.mockup.assets"), active: false },
                { label: t("landing.mockup.recurring"), active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`h-7 rounded-lg flex items-center gap-2 px-2 ${item.active ? "bg-violet-500/20" : ""}`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-sm ${item.active ? "bg-violet-400/60" : "bg-slate-700"}`}
                  />
                  <span className={`text-[10px] font-semibold ${item.active ? "text-violet-300" : "text-slate-500"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Main area */}
            <div className="flex-1 p-5 grid grid-rows-[auto_1fr] gap-4 overflow-hidden">
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: t("landing.mockup.netWorth"), val: "€ 48,320" },
                  { label: t("landing.mockup.monthlyIncome"), val: "€ 5,200" },
                  { label: t("landing.mockup.safeToSpend"), val: "€ 1,840" },
                  { label: t("landing.mockup.investments"), val: "€ 22,100" },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-slate-800/60 rounded-xl p-3 border border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm font-black text-white">{val}</p>
                    <div className="mt-1.5 h-1 w-full rounded-full bg-slate-700">
                      <div className="h-1 rounded-full bg-violet-500" style={{ width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + list */}
              <div className="grid grid-cols-3 gap-3 min-h-0">
                <div className="col-span-2 bg-slate-800/40 rounded-xl border border-white/5 p-3 overflow-hidden">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">
                    {t("landing.mockup.wealthEvolution")}
                  </p>
                  <div className="h-full flex items-end gap-1 pb-4">
                    {[30, 45, 38, 60, 55, 75, 68, 85, 78, 90, 88, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-violet-500/40 hover:bg-violet-500/70 transition-colors"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-800/40 rounded-xl border border-white/5 p-3">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">
                    {t("landing.mockup.recentActivity")}
                  </p>
                  <div className="space-y-2">
                    {["Netflix", "Grocery", "Salary", "Gym"].map((tx) => (
                      <div key={tx} className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-md bg-slate-700 shrink-0" />
                        <span className="text-[9px] text-slate-400 flex-1">{tx}</span>
                        <span className="text-[9px] font-bold text-slate-300">€12</span>
                      </div>
                    ))}
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
