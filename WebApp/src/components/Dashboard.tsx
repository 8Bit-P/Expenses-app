import { Wallet, TrendingUp, ShoppingCart, LineChart, PlusCircle, Plane, Shield } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      {/* Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary-container px-2 py-1 rounded-full">+2.4%</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Net Worth</p>
          <h3 className="text-2xl font-extrabold font-headline tracking-tight">$842,500.00</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary-container px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Monthly Income</p>
          <h3 className="text-2xl font-extrabold font-headline tracking-tight">$12,450.00</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-error" />
            </div>
            <span className="text-xs font-bold text-error bg-error-container px-2 py-1 rounded-full">-5.2%</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Monthly Expenses</p>
          <h3 className="text-2xl font-extrabold font-headline tracking-tight">$4,210.00</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
              <LineChart className="w-5 h-5 text-tertiary" />
            </div>
            <span className="text-xs font-bold text-secondary bg-secondary-container px-2 py-1 rounded-full">+8.1%</span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium mb-1">Total Invested</p>
          <h3 className="text-2xl font-extrabold font-headline tracking-tight">$512,000.00</h3>
        </div>
      </section>

      {/* Middle Row: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl font-bold font-headline mb-1">Wealth Evolution</h2>
              <p className="text-on-surface-variant text-sm">Portfolio growth trajectory over 12 months</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs font-medium">Investments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-xs font-medium">Liquidity</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-2 px-2">
            {[25, 33, 40, 50, 60, 66, 75, 80, 83, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-surface-container-low rounded-t-lg relative group" style={{ height: `${h}%` }}>
                <div className="absolute inset-0 bg-primary/20 rounded-t-lg"></div>
                <div className="absolute bottom-0 inset-x-0 bg-primary rounded-t-lg" style={{ height: `${h * 0.8}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col">
          <h2 className="text-xl font-bold font-headline mb-1">Monthly Cash Flow</h2>
          <p className="text-on-surface-variant text-sm mb-8">Income vs Expenses</p>
          <div className="flex-1 flex items-end justify-between gap-4 px-4">
            {[
              { label: 'Oct', inc: '66%', exp: '25%' },
              { label: 'Nov', inc: '75%', exp: '20%' },
              { label: 'Dec', inc: '80%', exp: '16%' }
            ].map((m) => (
              <div key={m.label} className="w-full flex flex-col gap-2 items-center">
                <div className="w-full bg-surface-container-low rounded-full h-48 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-secondary w-full rounded-b-full" style={{ height: m.inc }}></div>
                  <div className="bg-error w-full border-t-4 border-white" style={{ height: m.exp }}></div>
                </div>
                <span className="text-xs font-bold">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Row: Goals & Subscriptions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold font-headline">Savings Goals</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              New Goal <PlusCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-indigo-400" />
                  Japan Trip
                </span>
                <span>40%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[40%]"></div>
              </div>
              <p className="text-right text-[10px] text-slate-400 uppercase font-bold">$4,000 of $10,000</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Emergency Fund
                </span>
                <span>85%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full w-[85%]"></div>
              </div>
              <p className="text-right text-[10px] text-slate-400 uppercase font-bold">$21,250 of $25,000</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold font-headline mb-8">Upcoming Subscriptions</h2>
          <div className="space-y-4">
            {[
              { name: 'Netflix', due: 'Due in 3 days', amount: '$17.99', initial: 'N', bg: 'bg-error-container', text: 'text-error' },
              { name: 'Spotify', due: 'Due in 5 days', amount: '$9.99', initial: 'S', bg: 'bg-secondary-container', text: 'text-secondary' },
              { name: 'Gym Membership', due: 'Due in 12 days', amount: '$45.00', initial: 'G', bg: 'bg-primary-fixed', text: 'text-primary' },
            ].map((sub) => (
              <div key={sub.name} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-transparent hover:border-outline-variant/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${sub.bg} flex items-center justify-center ${sub.text} font-black italic`}>
                    {sub.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{sub.name}</h4>
                    <p className="text-xs text-on-surface-variant">{sub.due}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{sub.amount}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Monthly</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
