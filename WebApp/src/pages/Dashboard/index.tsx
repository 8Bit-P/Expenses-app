import SummaryRow from "./components/SummaryRow";
import WealthEvolution from "./components/WealthEvolution";
import ActionCenter from "./components/ActionCenter";
import SpendingCategories from "./components/SpendingCategories";
import RecentActivity from "./components/RecentActivity";
import SavingsGoals from "./components/SavingsGoals";
import UpcomingRenewals from "./components/UpcomingRenewals";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-on-surface">
            Vault Overview
          </h1>
          <p className="text-sm text-on-surface-variant font-medium mt-2 max-w-md">
            Your real-time financial command center. Monitor liquidity, track goals, and analyze growth.
          </p>
        </div>
        <button className="shrink-0 px-6 py-3.5 bg-on-surface text-surface-container-lowest font-bold rounded-2xl shadow-xl hover:bg-on-surface/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">download</span>
          Export Report
        </button>
      </div>

      {/* ROW 1: KPIs */}
      <div className="order-1">
        <SummaryRow />
      </div>

      {/* ROW 2: Main Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Action Center + Wealth Evolution */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="order-2">
            <ActionCenter />
          </div>
          <div className="order-4 lg:order-none bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5">
            <WealthEvolution />
          </div>
        </div>

        {/* RIGHT COLUMN: Spending Donut */}
        <div className="lg:col-span-4 order-5 lg:order-none">
          <SpendingCategories />
        </div>
      </div>

      {/* ROW 3: Details (Full Width Below) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="order-3 lg:order-none">
          <RecentActivity />
        </div>
        <div className="order-6 lg:order-none">
          <SavingsGoals />
        </div>
        <div className="order-7 lg:order-none">
          <UpcomingRenewals />
        </div>
      </div>
    </div>
  );
}
