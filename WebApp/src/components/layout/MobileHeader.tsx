import { useState, useEffect } from "react";

export default function MobileHeader() {
  // Re-using the theme logic so mobile users can toggle it too!
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 flex justify-between items-center px-4 py-3 md:hidden transition-colors duration-300">
      
      {/* User Profile & Branding */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl overflow-hidden bg-surface-container-highest border border-outline-variant/20 shadow-sm cursor-pointer active:scale-95 transition-all">
          <img 
            alt="User" 
            className="w-full h-full object-cover" 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          />
        </button>
        <span className="font-headline font-bold text-on-surface tracking-tight text-lg">
          Vault
        </span>
      </div>

      {/* Actions (Theme & Notifications) */}
      <div className="flex items-center gap-1">
        
        {/* Seamless Sun/Moon Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors overflow-hidden text-on-surface-variant hover:text-on-surface active:scale-95 focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {/* Sun Icon */}
          <span className={`material-symbols-outlined absolute transition-all duration-500 ease-in-out ${isDark ? '-rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
            light_mode
          </span>
          {/* Moon Icon */}
          <span className={`material-symbols-outlined absolute transition-all duration-500 ease-in-out ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-50'}`}>
            dark_mode
          </span>
        </button>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all duration-300 active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
          {/* Red dot badge with a subtle ping animation */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error z-10"></span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error animate-ping opacity-75"></span>
        </button>
        
      </div>
    </header>
  );
}