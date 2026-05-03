import { useState } from "react";
import SummaryRow from "./components/SummaryRow";
import WealthEvolution from "./components/WealthEvolution";
import ActionCenter from "./components/ActionCenter";
import SpendingCategories from "./components/SpendingCategories";
import RecentActivity from "./components/RecentActivity";
import DashboardReserves from "./components/DashboardReserves";
import UpcomingRenewals from "./components/UpcomingRenewals";
import ReviewWidget from "./components/ReviewWidget";
import WelcomeEmptyState from "./components/WelcomeEmptyState";
import HelpDrawer from "../../components/layout/HelpDrawer";
import { useTransactions } from "../../hooks/useTransactions";
import { useInvestments } from "../../hooks/useInvestments";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const [helpSection, setHelpSection] = useState<string | undefined>(undefined);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // We only fetch pageSize: 1 to minimize payload, we just need totalCount
  const { totalCount, loading: txLoading } = useTransactions({ needsReview: null, pageSize: 1 });
  const { assets, isLoading: invLoading } = useInvestments();

  const openHelp = (section?: string) => {
    setHelpSection(section);
    setIsHelpOpen(true);
  };

  const handleManualAdd = () => {
    window.dispatchEvent(new CustomEvent("open-new-transaction"));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      {/* Review Inbox (Top Priority) */}
      <ReviewWidget />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-on-surface">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-on-surface-variant font-medium mt-2 max-w-md">{t("dashboard.subtitle")}</p>
        </div>
        <button
          disabled
          className="shrink-0 px-6 py-3.5 bg-on-surface text-surface-container-lowest font-bold rounded-2xl shadow-xl opacity-50 cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          {t("dashboard.exportReport")}
          <span className="ml-1 px-1.5 py-0.5 bg-surface-container-lowest/20 text-[9px] uppercase tracking-widest font-black rounded-md">
            {t("auth.soon")}
          </span>
        </button>
      </div>

      {!txLoading && !invLoading && totalCount === 0 && assets.length === 0 ? (
        <WelcomeEmptyState onAddManual={handleManualAdd} />
      ) : (
        <>
          {/* ROW 1: KPIs */}
          <SummaryRow />

          {/* ROW 2: Priority Alerts (Full Width) */}
          <ActionCenter />

          {/* ROW 3: Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Wealth Evolution (8 cols) */}
            <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
              <WealthEvolution />
            </div>

            {/* RIGHT: Spending Donut (4 cols) */}
            <div className="lg:col-span-4">
              <SpendingCategories />
            </div>
          </div>

          {/* ROW 4: Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentActivity />
            <DashboardReserves onHelpClick={() => openHelp("reserves")} />
            <UpcomingRenewals />
          </div>
        </>
      )}

      {/* Help Drawer — context-aware, opened from within cards */}
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} initialSection={helpSection} />
    </div>
  );
}
