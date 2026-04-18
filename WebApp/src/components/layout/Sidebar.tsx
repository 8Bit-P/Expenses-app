import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onNewTransaction: () => void;
}

export default function Sidebar({ onNewTransaction }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/" },
    { label: "Investments", icon: "show_chart", path: "/investments" },
    { label: "Expenses", icon: "payments", path: "/expenses" },
    { label: "Subscriptions", icon: "event_repeat", path: "/subscriptions" },
    { label: "Settings", icon: "settings", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 p-6 bg-background/80 backdrop-blur-xl border-r border-outline-variant/20 font-headline tracking-tight z-50 flex flex-col transition-colors duration-300">
      {/* Friendly Logo & Title Section */}
      <div className="mb-10 flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center border border-primary/20 shadow-sm group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-on-surface tracking-tight">Personal Vault</h1>
          <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5">Secure Ledger</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group ${
                isActive
                  ? "text-primary font-bold bg-primary-container/20 shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <span
                className="material-symbols-outlined group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sleek, Premium Action Button */}
      <div className="mt-auto">
        <button
          onClick={onNewTransaction}
          className="w-full py-3.5 px-4 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded-xl flex items-center justify-center gap-2 font-bold transition-all border border-outline-variant/50 active:scale-95 group shadow-sm"
        >
          <span className="material-symbols-outlined text-primary group-hover:rotate-90 transition-transform">add</span>
          New Transaction
        </button>
      </div>
    </aside>
  );
}
