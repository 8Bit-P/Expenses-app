import SummaryRow from "./components/SummaryRow";
import WealthEvolution from "./components/WealthEvolution";
import CashFlow from "./components/CashFlow";

export default function Dashboard() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Summary Row */}
      <SummaryRow />

      {/* Middle Row: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <WealthEvolution />
        <CashFlow />
      </section>

      {/* Bottom Row: Goals & Subscriptions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {/* Savings Goals */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold font-headline">Savings Goals</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:opacity-80">
              New Goal <span className="material-symbols-outlined text-sm">add_circle</span>
            </button>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-400">flight</span>
                  Japan Trip
                </span>
                <span>40%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[40%]"></div>
              </div>
              <p className="text-right text-[10px] text-slate-400 uppercase font-bold">$4,000 of $10,000</p>
            </div>
          </div>
        </div>

        {/* Upcoming Subscriptions */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold font-headline mb-8">Upcoming Subscriptions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-transparent hover:border-outline-variant/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-error font-black italic">
                  N
                </div>
                <div>
                  <h4 className="font-bold text-sm">Netflix</h4>
                  <p className="text-xs text-on-surface-variant">Due in 3 days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">$17.99</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Monthly</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
