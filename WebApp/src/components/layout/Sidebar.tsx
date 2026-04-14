import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/" },
    { label: "Investments", icon: "show_chart", path: "/investments" },
    { label: "Expenses", icon: "payments", path: "/expenses" },
    { label: "Subscriptions", icon: "event_repeat", path: "/subscriptions" },
    { label: "Settings", icon: "settings", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 p-6 bg-slate-50/80 backdrop-blur-xl border-r-0 font-headline tracking-tight z-50 flex flex-col">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-primary">Personal Vault</h1>
        <p className="text-xs text-on-surface-variant opacity-60">Your Secure Financial Guardian</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out hover:translate-x-1 ${
                isActive 
                  ? "text-primary font-bold bg-white/50 shadow-sm" 
                  : "text-slate-500 hover:bg-white/30"
              }`}
            >
              <span 
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 font-bold transition-transform hover:scale-[1.02] active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Add Transaction
        </button>
      </div>
    </aside>
  );
}