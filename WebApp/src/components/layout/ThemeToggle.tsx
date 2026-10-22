import { useTranslation } from "react-i18next";
import { useUserPreferences } from "../../context/UserPreferencesContext";

/** Sun/moon icon button shared by the desktop and mobile headers. */
export default function ThemeToggle() {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useUserPreferences();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
      aria-label={t("layout.toggleTheme")}
      title={t("layout.toggleTheme")}
    >
      <span className="material-symbols-outlined text-[20px]">{isDark ? "light_mode" : "dark_mode"}</span>
    </button>
  );
}
