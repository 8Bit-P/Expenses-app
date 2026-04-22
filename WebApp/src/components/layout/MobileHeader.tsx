import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import NotificationDropdown from "./NotificationDropdown";

export default function MobileHeader({ onNewTransaction }: { onNewTransaction: () => void }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile } = useProfile();
  const { resolvedTheme, setTheme } = useUserPreferences();
  const isDark = resolvedTheme === "dark";

  const userEmail = session?.user?.email || "";
  const fallbackAvatar = `https://api.dicebear.com/7.x/micah/svg?seed=${userEmail}&backgroundColor=transparent`;
  const avatarSrc = profile?.avatar_url || fallbackAvatar;

  const firstName = profile?.full_name?.split(" ")[0] || "User";
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  if (hour >= 18) greeting = "Good evening";

  return (
    <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center px-4 py-3 desk:hidden transition-colors duration-300">
      {/* User Profile & Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/settings")}
          className="w-9 h-9 rounded-xl overflow-hidden bg-surface-container-highest border border-outline-variant/20 shadow-sm cursor-pointer active:scale-95 transition-all"
        >
          <img alt="User" className="w-full h-full object-cover" src={avatarSrc} />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black leading-tight">
            {greeting}
          </span>
          <span className="text-sm font-black text-on-surface leading-tight">
            {firstName}
          </span>
        </div>
      </div>

      {/* Actions (Theme & Notifications) */}
      <div className="flex items-center gap-1">


        {/* Seamless Sun/Moon Theme Toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors overflow-hidden text-on-surface-variant hover:text-on-surface active:scale-95 focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {/* Sun Icon */}
          <span
            className={`material-symbols-outlined absolute transition-all duration-500 ease-in-out ${isDark ? "-rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`}
          >
            light_mode
          </span>
          {/* Moon Icon */}
          <span
            className={`material-symbols-outlined absolute transition-all duration-500 ease-in-out ${isDark ? "rotate-0 opacity-100 scale-100" : "rotate-90 opacity-0 scale-50"}`}
          >
            dark_mode
          </span>
        </button>

        {/* Notification Bell */}
        <NotificationDropdown />
      </div>
    </header>
  );
}
