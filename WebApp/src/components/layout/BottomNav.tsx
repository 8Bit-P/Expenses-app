import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

interface BottomNavProps {
  onNewTransaction: () => void;
  isNewTransactionOpen: boolean;
}

export default function BottomNav({ onNewTransaction, isNewTransactionOpen }: BottomNavProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { label: t("layout.nav.home"), icon: "space_dashboard", path: "/home" },
    { label: t("layout.nav.expenses"), icon: "receipt_long", path: "/expenses" },
    { label: t("layout.nav.assets"), icon: "monitoring", path: "/assets" },
    { label: t("layout.nav.recurring"), icon: "event_repeat", path: "/recurring" },
  ];

  return (
    <>
      {/* Floating add button — mobile/tablet only */}
      {!isNewTransactionOpen && (
        <button
          onClick={onNewTransaction}
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+80px)] right-4 z-[110] h-12 pl-3.5 pr-4 rounded-xl bg-accent text-on-accent flex items-center gap-1.5 text-sm font-semibold shadow-lg ring-1 ring-black/10 active:scale-95 transition desk:hidden"
          aria-label={t("sidebar.addTransaction")}
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span className="hidden sm:inline">{t("sidebar.addTransaction")}</span>
        </button>
      )}

      <nav className="fixed bottom-0 inset-x-0 z-[100] bg-surface-container-lowest border-t border-outline-variant pb-[env(safe-area-inset-bottom,0px)] desk:hidden">
        <div className="grid grid-cols-4 h-16 max-w-xl mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-12 h-7 rounded-full transition-colors",
                    isActive && "bg-accent text-on-accent",
                  )}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                </span>
                <span className={cn("text-[11px] leading-none", isActive ? "font-semibold" : "font-medium")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
