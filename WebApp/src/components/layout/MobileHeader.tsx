import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";
import VaultIcon from "../ui/VaultIcon";

export default function MobileHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile } = useProfile();

  const userEmail = session?.user?.email || "";
  const fallbackAvatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${userEmail}&backgroundColor=transparent`;
  const avatarSrc = profile?.avatar_url || fallbackAvatar;

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 pt-[env(safe-area-inset-top,0px)] box-content bg-background border-b border-outline-variant flex items-center justify-between px-4 desk:hidden">
      <Link to="/home" className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-rail flex items-center justify-center">
          <VaultIcon className="text-accent" width="20" height="20" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-on-surface">Vault</span>
      </Link>

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => navigate("/search")}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          aria-label={t("search.placeholder")}
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <ThemeToggle />
        <NotificationDropdown />
        <button
          onClick={() => navigate("/settings")}
          className="ml-1.5 w-8 h-8 rounded-full overflow-hidden bg-surface-container border border-outline-variant active:scale-95 transition"
          aria-label={t("sidebar.settings")}
        >
          <img alt="" className="w-full h-full object-cover" src={avatarSrc} />
        </button>
      </div>
    </header>
  );
}
