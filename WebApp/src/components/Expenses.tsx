import { Calendar, TrendingUp, MoreHorizontal, ArrowRight, Utensils, ShoppingBag, Zap } from 'lucide-react';

export function Expenses() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Editorial Section */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Expense Narrative</h2>
          <p className="text-on-surface-variant mt-2 font-medium">Tracking your liquid flow with meticulous grace.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-surface-container-lowest rounded-xl shadow-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Oct 2023 - Nov 2023</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-error">
          <p className="text-sm font-semibold text-on-surface-variant mb-1">Total Monthly Spend</p>
          <h3 className="text-3xl font-black font-headline text-on-surface">$4,822.40</h3>
          <div className="mt-3 flex items-center gap-1 text-error font-bold text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>12% from last month</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-primary">
          <p className="text-sm font-semibold text-on-surface-variant mb-1">Top Category</p>
          <h3 className="text-3xl font-black font-headline text-on-surface">Living</h3>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[45%]"></div>
            </div>
            <span className="text-xs font-bold text-primary">45%</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-l-4 border-tertiary-container">
          <p className="text-sm font-semibold text-on-surface-variant mb-1">Subscription Total</p>
          <h3 className="text-3xl font-black font-headline text-on-surface">$248.00</h3>
          <div className="mt-3 text-xs font-semibold text-on-surface-variant">
            8 active services
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold font-headline">Spending by Category</h4>
              <MoreHorizontal className="w-5 h-5 text-outline-variant" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="18" className="text-surface-container-low"></circle>
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="18" strokeDasharray="502.4" strokeDashoffset="150" className="text-error"></circle>
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="18" strokeDasharray="502.4" strokeDashoffset="350" className="text-primary"></circle>
                  <circle cx="96" cy="96" r="80" fill="transparent" stroke="currentColor" strokeWidth="18" strokeDasharray="502.4" strokeDashoffset="450" className="text-tertiary"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black">$4.8k</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Total</span>
                </div>
              </div>
              <div className="flex-1 w-full space-y-4">
                {[
                  { label: 'Housing & Utilities', amount: '$2,100.00', color: 'bg-error' },
                  { label: 'Dining & Lifestyle', amount: '$1,450.00', color: 'bg-primary' },
                  { label: 'Transport', amount: '$822.40', color: 'bg-tertiary' },
                  { label: 'Miscellaneous', amount: '$450.00', color: 'bg-outline-variant' },
                ].map((cat) => (
                  <div key={cat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                      <span className="font-semibold text-sm">{cat.label}</span>
                    </div>
                    <span className="text-sm font-bold">{cat.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold font-headline">Recent Flow</h4>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                View Statement <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-error-container/30 rounded-xl flex items-center justify-center text-error">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">The Celestial Bistro</h5>
                    <p className="text-xs text-on-surface-variant">Nov 14, 2023 • Dining</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-on-surface">-$124.50</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Completed</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">Nordic Threads</h5>
                    <p className="text-xs text-on-surface-variant">Nov 12, 2023 • Lifestyle</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-on-surface">-$380.00</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Completed</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-tertiary-container/20 rounded-xl flex items-center justify-center text-tertiary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">Grid Energy Corp</h5>
                    <p className="text-xs text-on-surface-variant">Nov 10, 2023 • Utilities</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-on-surface">-$156.20</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-50">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low p-6 rounded-2xl space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Filter Narrative</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-2">Category focus</label>
                <select className="w-full bg-surface-container-lowest border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all">
                  <option>All Categories</option>
                  <option>Housing</option>
                  <option>Lifestyle</option>
                  <option>Utilities</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-2">Time Horizon</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-primary text-white py-2 rounded-lg text-xs font-bold">Month</button>
                  <button className="bg-surface-container-lowest text-on-surface py-2 rounded-lg text-xs font-bold">Quarter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
