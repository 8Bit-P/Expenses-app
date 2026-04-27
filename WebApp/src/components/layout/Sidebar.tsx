import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import VaultIcon from "../ui/VaultIcon";

interface SidebarProps {
  onNewTransaction: () => void;
}

import { useTranslation } from "react-i18next";

export default function Sidebar({ onNewTransaction }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { label: t("sidebar.home"), icon: "grid_view", path: "/home" },
    { label: t("sidebar.expenses"), icon: "payments", path: "/expenses" },
    { label: t("sidebar.assets"), icon: "show_chart", path: "/assets" },
    { label: t("sidebar.recurring"), icon: "sync", path: "/recurring" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 p-6 bg-background/80 backdrop-blur-xl border-r border-outline-variant/20 font-headline tracking-tight z-50 flex flex-col transition-colors duration-300">
      {/* Friendly Logo & Title Section */}
      <Link to="/home" className="mb-10 flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center border border-primary/20 shadow-sm group-hover:scale-105 transition-transform">
          <VaultIcon className="text-primary" width="24" height="24" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-on-surface tracking-tight">Vault</h1>
          <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold mt-0.5">
            {t("sidebar.secureLedger")}
          </p>
        </div>
      </Link>

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

      {/* Sleek, Premium Action Buttons Section */}
      <div className="mt-auto space-y-4">
        <button
          onClick={onNewTransaction}
          className="w-full py-4 px-4 bg-primary text-on-primary rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-[0.98] group shadow-xl shadow-primary/25 hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add</span>
          {t("sidebar.addTransaction")}
        </button>

        <div className="bg-surface-container-lowest/50 backdrop-blur-md rounded-2xl p-2 border border-outline-variant/10">
          <Link
            to="/settings"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
              location.pathname === "/settings"
                ? "text-primary font-bold bg-primary-container/20"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: location.pathname === "/settings" ? "'FILL' 1" : "'FILL' 0" }}
            >
              settings
            </span>
            <span className="text-xs font-bold">{t("sidebar.settings")}</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all group">
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
              help
            </span>
            <span className="text-xs font-bold">{t("sidebar.help")}</span>
          </button>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/5 transition-all group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
              logout
            </span>
            <span className="text-xs font-bold">{t("sidebar.signOut")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
