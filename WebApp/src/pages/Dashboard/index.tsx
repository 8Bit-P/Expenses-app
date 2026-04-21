import SummaryRow from "./components/SummaryRow";
import WealthEvolution from "./components/WealthEvolution";
import CashFlow from "./components/CashFlow";

export default function Dashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      {/* Premium Dashboard Header */}
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

      {/* Summary Row */}
      <SummaryRow />

      {/* Middle Row: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <WealthEvolution />
        <CashFlow />
      </section>

      {/* Bottom Row: Goals & Subscriptions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Savings Goals */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">flag</span>
                Savings Goals
              </h2>
            </div>
            <button className="text-primary text-xs font-black uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors">
              New Goal
            </button>
          </div>
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-transparent hover:border-outline-variant/20 transition-all">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-xl">
                    🎌
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">Japan Trip</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      Target: $10,000
                    </p>
                  </div>
                </div>
                <span className="font-black text-primary">40%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[40%]"></div>
              </div>
              <p className="text-right text-xs font-bold text-on-surface mt-2">$4,000 Saved</p>
            </div>
          </div>
        </div>

        {/* Upcoming Subscriptions */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">event_repeat</span>
              Upcoming Renewals
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-transparent hover:border-outline-variant/20 transition-all group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-error-container/50 flex items-center justify-center text-error font-black text-xl italic shadow-sm">
                  N
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Netflix</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-error mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
                    Due in 3 days
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-on-surface">$17.99</p>
                <p className="text-[10px] uppercase font-black text-on-surface-variant tracking-widest">Monthly</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
