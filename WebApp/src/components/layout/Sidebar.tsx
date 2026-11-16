import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import VaultIcon from "../ui/VaultIcon";
import HelpDrawer from "./HelpDrawer";
import SupportModal from "./SupportModal";
import { cn } from "../../utils/cn";

interface SidebarProps {
  onNewTransaction: () => void;
}

export default function Sidebar({ onNewTransaction }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { signOut, session } = useAuth();
  const { profile } = useProfile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const userEmail = session?.user?.email || "";
  const fallbackAvatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${userEmail}&backgroundColor=transparent`;
  const avatarSrc = profile?.avatar_url || fallbackAvatar;
  const fullName = profile?.full_name || t("layout.user");

  const navItems = [
    { label: t("sidebar.home"), icon: "space_dashboard", path: "/home", shortcut: "1" },
    { label: t("sidebar.expenses"), icon: "receipt_long", path: "/expenses", shortcut: "2" },
    { label: t("sidebar.assets"), icon: "monitoring", path: "/assets", shortcut: "3" },
    { label: t("sidebar.recurring"), icon: "event_repeat", path: "/recurring", shortcut: "4" },
  ];

  const itemBase =
    "relative flex items-center gap-3 h-9 px-3 rounded-lg text-[13px] font-medium transition-colors duration-150";
  const itemIdle = "text-on-rail-variant hover:text-on-rail hover:bg-rail-hover";
  const itemActive = "text-on-rail bg-rail-hover";

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-60 bg-rail text-on-rail border-r border-rail-border z-50 flex flex-col">
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2.5 h-16 px-5 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <VaultIcon className="text-on-accent" width="20" height="20" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">Vault</span>
            <span className="block text-[11px] text-on-rail-variant">{t("sidebar.secureLedger")}</span>
          </span>
        </Link>

        {/* Primary action */}
        <div className="px-3 pb-4">
          <button
            onClick={onNewTransaction}
            className="w-full h-10 px-3 rounded-lg bg-accent text-on-accent flex items-center gap-2 text-[13px] font-semibold transition hover:brightness-95 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="flex-1 text-left">{t("sidebar.addTransaction")}</span>
            <kbd className="kbd">N</kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={cn(itemBase, isActive ? itemActive : itemIdle)}
              >
                {isActive && <span className="absolute -left-3 top-2 bottom-2 w-[3px] rounded-r bg-accent" />}
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                <kbd className="kbd">{item.shortcut}</kbd>
              </Link>
            );
          })}
        </nav>

        {/* Secondary */}
        <div className="px-3 py-3 space-y-0.5 border-t border-rail-border">
          <Link
            to="/settings"
            className={cn(itemBase, location.pathname === "/settings" ? itemActive : itemIdle)}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            {t("sidebar.settings")}
          </Link>
          <button onClick={() => setIsHelpOpen(true)} className={cn(itemBase, itemIdle, "w-full")}>
            <span className="material-symbols-outlined text-[20px]">help</span>
            {t("sidebar.help")}
          </button>
          <button onClick={() => setIsSupportOpen(true)} className={cn(itemBase, itemIdle, "w-full")}>
            <Heart className="w-[18px] h-[18px] mx-px" strokeWidth={1.75} />
            {t("sidebar.support")}
          </button>
        </div>

        {/* Account */}
        <div className="px-3 py-3 border-t border-rail-border flex items-center gap-2.5">
          <Link
            to="/settings"
            className="flex items-center gap-2.5 min-w-0 flex-1 rounded-lg p-1 -m-1 hover:bg-rail-hover transition-colors"
          >
            <img
              alt=""
              src={avatarSrc}
              className="w-8 h-8 rounded-full object-cover bg-rail-hover border border-rail-border shrink-0"
            />
            <span className="min-w-0">
              <span className="block text-[13px] font-medium truncate">{fullName}</span>
              <span className="block text-[11px] text-on-rail-variant truncate">{userEmail}</span>
            </span>
          </Link>
          <button
            onClick={() => signOut()}
            title={t("sidebar.signOut")}
            aria-label={t("sidebar.signOut")}
            className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-on-rail-variant hover:text-error hover:bg-rail-hover transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </aside>
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  );
}
