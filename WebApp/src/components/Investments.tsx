import { ArrowUp, TrendingUp, Bitcoin, TrendingDown, Wallet } from 'lucide-react';

export function Investments() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm group hover:shadow-md transition-all duration-300">
          <p className="text-sm text-on-surface-variant font-medium mb-1">Total Portfolio Value</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight">$412,850.42</h2>
            <span className="text-xs font-bold text-secondary flex items-center bg-secondary-container/30 px-2 py-0.5 rounded-full">
              <ArrowUp className="w-3 h-3 mr-1" /> 12.4%
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm group hover:shadow-md transition-all duration-300">
          <p className="text-sm text-on-surface-variant font-medium mb-1">Total Invested</p>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight">$295,000.00</h2>
          <p className="text-xs text-on-surface-variant mt-2">Last contribution: 2 days ago</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm group hover:shadow-md transition-all duration-300">
          <p className="text-sm text-on-surface-variant font-medium mb-1">All-time ROI</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-tertiary">+39.9%</h2>
            <span className="text-xs font-medium text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-0.5 rounded-full">Record High</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Investment Performance Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-headline font-bold">Investment Performance</h3>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-full bg-surface-container-low text-sm font-medium hover:bg-surface-container-high transition-colors">6M</button>
                <button className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium">1Y</button>
                <button className="px-4 py-1.5 rounded-full bg-surface-container-low text-sm font-medium hover:bg-surface-container-high transition-colors">ALL</button>
              </div>
            </div>
            <div className="h-[320px] w-full relative flex items-end justify-between px-4">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-lg"></div>
              {[30, 45, 35, 60, 55, 75, 65, 85, 70, 90, 100].map((h, i) => (
                <div key={i} className={`w-[8%] rounded-t-md transition-all ${i === 10 ? 'bg-gradient-to-t from-primary to-primary-container' : 'bg-primary/20 hover:bg-primary/40'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-4 text-xs font-medium text-on-surface-variant">
              <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span><span>DEC</span>
            </div>
          </div>

          {/* Portfolio Allocation Section */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-headline font-bold mb-6">Portfolio Allocation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium text-sm">Index Funds</span>
                  </div>
                  <span className="font-bold text-sm">45%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                    <span className="font-medium text-sm">Crypto</span>
                  </div>
                  <span className="font-bold text-sm">25%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="font-medium text-sm">Stocks</span>
                  </div>
                  <span className="font-bold text-sm">20%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <span className="font-medium text-sm">Cash</span>
                  </div>
                  <span className="font-bold text-sm">10%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center relative">
              <div className="w-48 h-48 rounded-full border-[24px] border-primary relative">
                <div className="absolute inset-[-24px] rounded-full border-[24px] border-tertiary border-l-transparent border-t-transparent border-b-transparent rotate-[45deg]"></div>
                <div className="absolute inset-[-24px] rounded-full border-[24px] border-secondary border-l-transparent border-t-transparent border-r-transparent -rotate-[120deg]"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-on-surface-variant">DIVERSIFIED</span>
                  <span className="text-xl font-headline font-extrabold">92/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Section: Form and List */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-headline font-bold mb-6">Add Movement</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-label font-medium text-on-surface-variant mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="py-2 rounded-xl bg-primary-fixed text-primary font-bold text-sm border-2 border-primary">Contribution</button>
                  <button type="button" className="py-2 rounded-xl bg-surface-container-low text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors">Withdrawal</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-label font-medium text-on-surface-variant mb-2">Asset Class</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 text-sm">
                  <option>Index Funds</option>
                  <option>Stocks</option>
                  <option>Crypto</option>
                  <option>Commodities</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-label font-medium text-on-surface-variant mb-2">Amount (USD)</label>
                <input type="number" placeholder="0.00" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-label font-medium text-on-surface-variant mb-2">Date</label>
                <input type="date" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <button className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold shadow-lg shadow-indigo-100 hover:opacity-90 transition-opacity">
                Confirm Entry
              </button>
            </form>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold">Recent Movements</h3>
              <button className="text-primary text-xs font-bold uppercase tracking-wider">View All</button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Buy VTI Index</p>
                  <p className="text-xs text-on-surface-variant">Nov 24, 2023 • Contribution</p>
                </div>
                <span className="text-sm font-extrabold text-secondary">+$2,400</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <Bitcoin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Buy Ethereum</p>
                  <p className="text-xs text-on-surface-variant">Nov 21, 2023 • Contribution</p>
                </div>
                <span className="text-sm font-extrabold text-tertiary">+$850</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-error-container/50 flex items-center justify-center text-error">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Sold AAPL Stock</p>
                  <p className="text-xs text-on-surface-variant">Nov 18, 2023 • Withdrawal</p>
                </div>
                <span className="text-sm font-extrabold text-error">-$1,200</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Dividend Payout</p>
                  <p className="text-xs text-on-surface-variant">Nov 15, 2023 • Income</p>
                </div>
                <span className="text-sm font-extrabold text-secondary">+$142.30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
