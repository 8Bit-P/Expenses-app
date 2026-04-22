import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import { format } from "date-fns";
import NotificationDropdown from "./NotificationDropdown";

export default function TopBar() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile } = useProfile();
  const { resolvedTheme, setTheme } = useUserPreferences();
  const isDark = resolvedTheme === "dark";

  const userEmail = session?.user?.email || "";
  const fallbackAvatar = `https://api.dicebear.com/7.x/micah/svg?seed=${userEmail}&backgroundColor=transparent`;
  const avatarSrc = profile?.avatar_url || fallbackAvatar;
  const firstName = profile?.full_name?.split(" ")[0] || "User";

  // Greeting based on time of day
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  if (hour >= 18) greeting = "Good evening";

  return (
    <header className="flex justify-between items-center w-full px-8 py-3 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-surface-container-low/50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 rounded-xl overflow-hidden bg-surface-container-highest border border-surface-container-highest shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
        >
          <img alt="User Profile" src={avatarSrc} className="w-full h-full object-cover" />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">
            {greeting}
          </span>
          <span className="text-sm font-black text-on-surface leading-tight">
            {firstName}
          </span>
        </div>
      </div>

      {/* Global Actions Context */}
      <div className="flex items-center gap-3">
        {/* Seamless Sun/Moon Theme Toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors overflow-hidden text-on-surface-variant hover:text-on-surface cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {/* Sun Icon */}
          <span
            className={`material-symbols-outlined absolute transition-all duration-500 ease-in-out ${
              isDark ? "-rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
            }`}
          >
            light_mode
          </span>
          {/* Moon Icon */}
          <span
            className={`material-symbols-outlined absolute transition-all duration-500 ease-in-out ${
              isDark ? "rotate-0 opacity-100 scale-100" : "rotate-90 opacity-0 scale-50"
            }`}
          >
            dark_mode
          </span>
        </button>

        {/* Notification Bell with "Live" Ping */}
        <NotificationDropdown />
      </div>
    </header>
  );
}
