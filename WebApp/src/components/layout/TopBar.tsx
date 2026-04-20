import { useNavigate } from "react-router-dom";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";

export default function TopBar() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile } = useProfile();
  const { resolvedTheme, setTheme } = useUserPreferences();
  const isDark = resolvedTheme === "dark";

  const userEmail = session?.user?.email || "";
  const fallbackAvatar = `https://api.dicebear.com/7.x/micah/svg?seed=${userEmail}&backgroundColor=transparent`;
  const avatarSrc = profile?.avatar_url || fallbackAvatar;

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 font-headline bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-surface-container-low/50">
      {/* Search Input (Corners slightly sharpened to xl) */}
      <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-xl w-96 transition-focus-within focus-within:ring-2 focus-within:ring-primary/20">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-outline-variant outline-none"
          placeholder="Search entries, goals, or assets..."
          type="text"
        />
        {/* Quick shortcut hint for power users */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-outline-variant bg-surface-container px-1.5 py-0.5 rounded-md border border-outline-variant/20">
          <span>⌘</span>
          <span>K</span>
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
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
          {/* Red dot badge with a subtle ping animation to make the app feel alive */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error z-10"></span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error animate-ping opacity-75"></span>
        </button>

        {/* Separator line */}
        <div className="w-px h-6 bg-surface-container-highest mx-2"></div>

        {/* User Profile (Corners sharpened to match the new aesthetic) */}
        <button
          onClick={() => navigate("/settings")}
          className="w-9 h-9 rounded-xl overflow-hidden bg-surface-container-highest border border-surface-container-highest shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
        >
          <img alt="User Profile" src={avatarSrc} className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
}
