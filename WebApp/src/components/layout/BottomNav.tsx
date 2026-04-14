import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { label: "Home", icon: "dashboard", path: "/" },
    { label: "Assets", icon: "account_balance_wallet", path: "/investments" },
    { label: "Expenses", icon: "payments", path: "/expenses" },
    { label: "Recurring", icon: "autorenew", path: "/subscriptions" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-white/80 backdrop-blur-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[32px] md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${
              isActive ? "bg-primary/10 text-primary rounded-2xl px-4 scale-105" : "text-slate-400 hover:text-primary"
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-headline font-semibold text-[10px] tracking-wide mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}