import { LayoutDashboard, LineChart, Wallet, Repeat, Settings, Plus } from 'lucide-react';

export function Sidebar({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (tab: string) => void }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'investments', label: 'Investments', icon: LineChart },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-6 w-64 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl font-headline tracking-tight z-50">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Luminous Ledger</h1>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">The Ethereal Guardian</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out scale-98 hover:translate-x-1 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-white/60 dark:bg-slate-900/60 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
        <button className="w-full bg-gradient-to-br from-primary to-primary-container text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold transition-all shadow-lg shadow-indigo-200/50 hover:opacity-90 active:scale-95">
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>
    </aside>
  );
}
