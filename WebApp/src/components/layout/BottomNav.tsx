import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface BottomNavProps {
  onNewTransaction: () => void;
}

export default function BottomNav({ onNewTransaction }: BottomNavProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { label: t("layout.nav.home"), icon: "grid_view", path: "/home" },
    { label: t("layout.nav.expenses"), icon: "payments", path: "/expenses" },
    { label: t("layout.nav.assets"), icon: "show_chart", path: "/assets" },
    { label: t("layout.nav.recurring"), icon: "sync", path: "/recurring" },
  ];

  return (
    <>
      {/* True FAB — floats above the nav bar, anchored bottom-right, hidden on desktop */}
      <button
        onClick={onNewTransaction}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 hover:opacity-90 transition-all duration-200 desk:hidden"
        aria-label={t("sidebar.addTransaction")}
      >
        <span className="material-symbols-outlined text-[26px]">add</span>
      </button>

      {/* Bottom Navigation Bar — 4 evenly-spaced items, hidden on desktop */}
      <nav className="fixed bottom-0 w-full bg-background/90 backdrop-blur-xl border-t border-outline-variant/10 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] z-40 flex items-center justify-around px-4 pt-2 desk:hidden transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 flex-1 transition-all duration-300 ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant/80 hover:text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined transition-all duration-300 ${isActive ? "scale-110" : ""}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span
                className={`font-headline text-[10px] tracking-wide mt-1 ${
                  isActive ? "font-black" : "font-semibold"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
