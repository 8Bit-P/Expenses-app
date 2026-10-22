import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import VaultIcon from "../../../components/ui/VaultIcon";
import { CHART } from "../../../constants/chartColors";

// --- Mini components replicating the real app's design language ---

function MockKpiCard({
  label,
  value,
  change,
  changePos,
}: {
  label: string;
  value: string;
  change?: string;
  changePos?: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest p-3 min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-on-surface-variant truncate mb-2">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className="text-[15px] font-semibold tracking-tight text-on-surface tabular-nums leading-none truncate">{value}</p>
        {change && (
          <span
            className={`inline-flex items-center h-4 px-1 rounded text-[10px] font-medium tabular-nums shrink-0 ${
              changePos ? "text-secondary bg-secondary/10" : "text-error bg-error/10"
            }`}
          >
            {change}
          </span>
        )}
      </div>
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
  type: "income" | "expense";
}) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="w-6 h-6 rounded-md bg-surface-container flex items-center justify-center text-[11px] shrink-0">{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-on-surface truncate leading-tight">{name}</p>
        <p className="text-[10px] text-on-surface-variant truncate leading-tight">{category}</p>
      </div>
      <span className={`text-[11px] font-medium tabular-nums ${type === "income" ? "text-secondary" : "text-on-surface"}`}>
        {type === "income" ? "+" : "-"}
        {amount}
      </span>
    </div>
  );
}

function MockActionRow({ label, pill, tone }: { label: string; pill: string; tone: "warning" | "error" }) {
  const pillCls = tone === "warning" ? "text-amber-600 bg-amber-500/10" : "text-error bg-error/10";
  const dotCls = tone === "warning" ? "bg-amber-500" : "bg-error";
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls}`} />
      <span className="text-on-surface text-[11px] flex-1 leading-tight truncate">{label}</span>
      <span className={`inline-flex items-center h-4 px-1 rounded text-[10px] font-medium shrink-0 ${pillCls}`}>{pill}</span>
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
    <div className="relative h-full">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="absolute left-0 right-0 border-t border-outline-variant" style={{ top: `${i * 33.33}%` }} />
      ))}
      <div className="relative flex items-end gap-1.5 h-full">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-px h-full">
            <div className="w-full rounded-t-[2px]"             style={{ height: `${b.cash * 0.6}%`, backgroundColor: CHART.secondary }} />
                        <div className="w-full" style={{ height: `${b.invest * 0.75}%`, backgroundColor: CHART.primary }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();

  const navItems = [
    { label: t("landing.mockup.home"), icon: "cottage", active: true },
    { label: t("landing.mockup.expenses"), icon: "receipt_long", active: false },
    { label: t("landing.mockup.assets"), icon: "auto_graph", active: false },
    { label: t("landing.mockup.recurring"), icon: "sync", active: false },
  ];

  return (
    <section className="px-6 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Masthead rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 pb-3 border-b border-on-surface"
        >
          <span className="w-2 h-2 bg-accent ring-1 ring-on-surface/20 shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface">
            {t("landing.hero.badge")}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-8 md:pt-12">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="lg:col-span-8 font-display font-normal text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.92] tracking-[-0.015em] text-on-surface"
          >
            {t("landing.hero.headlinePrefix")}{" "}
            <span className="bg-accent text-on-accent px-[0.08em] box-decoration-clone">
              {t("landing.hero.headlineSuffix")}
            </span>
          </motion.h1>

          {/* Sub-headline + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 flex flex-col justify-end gap-6"
          >
            <p className="text-base md:text-[17px] text-on-surface-variant leading-relaxed">
              {t("landing.hero.subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/auth?mode=signup"
                className="group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-accent text-on-accent text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
              >
                {t("landing.hero.startFree")}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#support"
                className="inline-flex items-center justify-center h-11 px-5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-surface-container-low hover:border-outline transition-colors"
              >
                {t("landing.hero.supportMe")}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 md:mt-16"
          role="img"
          aria-label="Vault financial dashboard"
        >
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-xl">
            {/* Window bar */}
            <div className="h-9 border-b border-outline-variant bg-surface-container-low flex items-center gap-1.5 px-3.5">
              <span className="w-2.5 h-2.5 rounded-full border border-outline" />
              <span className="w-2.5 h-2.5 rounded-full border border-outline" />
              <span className="w-2.5 h-2.5 rounded-full border border-outline" />
              <div className="ml-3 h-5 px-2 rounded border border-outline-variant bg-surface-container-lowest flex items-center text-[10px] text-on-surface-variant font-mono truncate max-w-[160px] sm:max-w-[240px]">
                {t("landing.hero.mockup.url")}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:h-[440px]">
              {/* Sidebar */}
              <div className="hidden md:flex w-44 bg-rail text-on-rail p-3 flex-col gap-0.5 shrink-0">
                <div className="flex items-center gap-2 mb-5 px-2 pt-1">
                  <div className="w-6 h-6 rounded-md bg-accent text-on-accent flex items-center justify-center">
                    <VaultIcon className="text-on-accent" width="16" height="16" />
                  </div>
                  <span className="text-[12px] font-semibold">Vault</span>
                </div>
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className={`h-8 rounded-md flex items-center gap-2 px-2 ${item.active ? "bg-rail-hover text-on-rail" : "text-on-rail-variant"}`}
                  >
                    <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                    <span className="text-[11px] font-medium">{item.label}</span>
                    {item.active && <span className="ml-auto w-1 h-3.5 rounded-full bg-accent" />}
                  </div>
                ))}
                <div className="mt-auto border-t border-rail-border pt-2">
                  <div className="h-8 rounded-md flex items-center gap-2 px-2 text-on-rail-variant">
                    <span className="material-symbols-outlined text-[15px]">settings</span>
                    <span className="text-[11px] font-medium">{t("landing.hero.mockup.settings")}</span>
                  </div>
                </div>
              </div>

              {/* Main area */}
              <div className="flex-1 bg-background p-3 sm:p-4 flex flex-col gap-3 overflow-hidden min-w-0">
                {/* Page title */}
                <div className="hidden sm:flex items-end justify-between pb-2.5 border-b border-outline-variant">
                  <div>
                    <p className="text-[10px] text-on-surface-variant">{t("landing.hero.mockup.overviewSubtitle")}</p>
                    <h2 className="font-display text-[22px] leading-none text-on-surface mt-1">{t("landing.hero.mockup.overview")}</h2>
                  </div>
                  <div className="h-6 px-2.5 rounded-md bg-primary text-on-primary flex items-center">
                    <span className="text-[10px] font-medium">{t("landing.hero.mockup.new")}</span>
                  </div>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant border border-outline-variant rounded-lg overflow-hidden shrink-0">
                  <MockKpiCard label={t("landing.mockup.netWorth")} value="€ 48,320" change="+2.1%" changePos />
                  <MockKpiCard label={t("landing.mockup.monthlyIncome")} value="€ 5,200" change="+8.3%" changePos />
                  <MockKpiCard label={t("landing.mockup.safeToSpend")} value="€ 61 / day" />
                  <MockKpiCard label={t("landing.mockup.investments")} value="€ 22,100" change="+12.4%" changePos />
                </div>

                {/* Charts + Activity row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 min-h-0">
                  {/* Wealth evolution chart */}
                  <div className="md:col-span-2 bg-surface-container-lowest rounded-lg border border-outline-variant p-3 flex flex-col overflow-hidden min-h-[160px]">
                    <div className="flex items-start justify-between gap-2 mb-3 shrink-0">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-on-surface">{t("landing.mockup.wealthEvolution")}</p>
                        <p className="text-[10px] text-on-surface-variant truncate">{t("landing.hero.mockup.wealthSubtitle")}</p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: CHART.primary }} />
                          <span className="text-[10px] text-on-surface-variant">{t("landing.hero.mockup.invested")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: CHART.secondary }} />
                          <span className="text-[10px] text-on-surface-variant">{t("landing.hero.mockup.liquidity")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[100px]">
                      <MockBarChart />
                    </div>
                  </div>

                  {/* Right column: activity + action center */}
                  <div className="flex flex-col gap-3 min-h-0">
                    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-3 flex flex-col flex-1 overflow-hidden">
                      <p className="text-[12px] font-semibold text-on-surface mb-1 shrink-0">{t("landing.mockup.recentActivity")}</p>
                      <div className="flex-1 overflow-hidden divide-y divide-outline-variant">
                        <MockTransactionRow emoji="🎵" name="Spotify" category="Media" amount="€9.99" type="expense" />
                        <MockTransactionRow emoji="💰" name="Salary — May" category="Income" amount="€3,800" type="income" />
                        <MockTransactionRow emoji="🛒" name="Whole Foods" category="Groceries" amount="€67" type="expense" />
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-3 shrink-0">
                      <p className="text-[12px] font-semibold text-on-surface mb-1">{t("landing.hero.mockup.actionCenter")}</p>
                      <div className="divide-y divide-outline-variant">
                        <MockActionRow label={t("landing.hero.mockup.netflix")} pill={t("landing.hero.mockup.upcoming")} tone="warning" />
                        <MockActionRow label={t("landing.hero.mockup.budgetAlert")} pill={t("landing.hero.mockup.alert")} tone="error" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 border-y border-outline-variant divide-y sm:divide-y-0 sm:divide-x divide-outline-variant"
        >
          {[
            { icon: <Shield size={15} strokeWidth={1.75} />, label: t("landing.hero.statEncryption") },
            { icon: <TrendingUp size={15} strokeWidth={1.75} />, label: t("landing.hero.statAnalytics") },
            { icon: <Zap size={15} strokeWidth={1.75} />, label: t("landing.hero.statAds") },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 py-3.5 sm:px-5 sm:first:pl-0 text-sm text-on-surface">
              <span className="text-on-surface-variant">{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
