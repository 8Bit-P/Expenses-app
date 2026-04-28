import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { label: t("layout.nav.home"), icon: "grid_view", path: "/home" },
    { label: t("layout.nav.expenses"), icon: "payments", path: "/expenses" },
    { label: t("layout.nav.assets"), icon: "show_chart", path: "/assets" },
    { label: t("layout.nav.recurring"), icon: "sync", path: "/recurring" },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-background/80 backdrop-blur-lg border-t border-outline-variant/10 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] z-50 flex justify-around items-center px-4 pt-3 desk:hidden transition-colors duration-300">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${
              isActive
                ? "bg-primary-container/30 text-primary rounded-2xl px-4 scale-105"
                : "text-on-surface-variant/80 hover:text-on-surface"
            }`}
          >
            <span
              className="material-symbols-outlined transition-transform duration-300"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-headline font-semibold text-[10px] tracking-wide mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
