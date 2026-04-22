import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

import type { Theme, Currency, DateFormat, CurrencyMeta, NotificationPrefs } from "../types/preferences";
import { CURRENCIES, DEFAULT_NOTIFICATIONS } from "../constants/preferences";


interface UserPreferencesContextType {
  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "light" | "dark"; // actual applied theme (system resolved)

  // Currency
  currency: CurrencyMeta;
  setCurrency: (code: Currency) => void;

  // Date format
  dateFormat: DateFormat;
  setDateFormat: (f: DateFormat) => void;

  // Financial Settings (Supabase-backed)
  monthlyBudget: number;
  updateFinancialSettings: (prefs: {
    monthlyBudget?: number;
    currency?: Currency;
    dateFormat?: DateFormat;
  }) => Promise<void>;
  budgetLoading: boolean;

  // Notifications (localStorage)
  notifications: NotificationPrefs;
  setNotifications: (prefs: Partial<NotificationPrefs>) => void;
}

import { applyTheme } from "../utils/theme";
import { getLocalStorageItem, setLocalStorageItem } from "../utils/storage";

// ─── Context ──────────────────────────────────────────────────────────────────

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Theme
  const [theme, setThemeState] = useState<Theme>(() => getLocalStorageItem("pref:theme", "system" as Theme));
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    applyTheme(getLocalStorageItem("pref:theme", "system" as Theme))
  );

  // Currency
  const [currency, setCurrencyState] = useState<CurrencyMeta>(() => {
    const code = getLocalStorageItem<Currency>("pref:currency", "USD");
    return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
  });

  // Date format
  const [dateFormat, setDateFormatState] = useState<DateFormat>(() =>
    getLocalStorageItem("pref:dateFormat", "MM/DD/YYYY" as DateFormat)
  );

  // Notifications
  const [notifications, setNotificationsState] = useState<NotificationPrefs>(() =>
    getLocalStorageItem("pref:notifications", DEFAULT_NOTIFICATIONS)
  );

  // Monthly budget + currency + date format (all Supabase-backed)
  const [monthlyBudget, setMonthlyBudgetState] = useState(0);
  const [budgetLoading, setBudgetLoading] = useState(false);

  // ── Apply theme on system change ──────────────────────────────────────────
  useEffect(() => {
    const resolved = applyTheme(theme);
    setResolvedTheme(resolved);

    // Listen for system preference changes when "system" mode is active
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const r = applyTheme("system");
        setResolvedTheme(r);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // ── Fetch preferences from Supabase ──────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    setBudgetLoading(true);
    supabase
      .from("user_preferences")
      .select("monthly_budget, currency, date_format")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setMonthlyBudgetState(data.monthly_budget ?? 0);
          // Currency from DB takes precedence over localStorage
          if (data.currency) {
            const meta = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
            setCurrencyState(meta);
            setLocalStorageItem("pref:currency", data.currency); // keep in sync
          }
          // Date format from DB takes precedence
          if (data.date_format) {
            setDateFormatState(data.date_format as DateFormat);
            setLocalStorageItem("pref:dateFormat", data.date_format); // keep in sync
          }
        }
        setBudgetLoading(false);
      });
  }, [userId]);

  // ── Setters ───────────────────────────────────────────────────────────────
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setLocalStorageItem("pref:theme", t);
  }, []);

  const setCurrency = useCallback((code: Currency) => {
    const meta = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
    setCurrencyState(meta);
    setLocalStorageItem("pref:currency", code); // optimistic local update
  }, []);

  const setDateFormat = useCallback((f: DateFormat) => {
    setDateFormatState(f);
    setLocalStorageItem("pref:dateFormat", f); // optimistic local update
  }, []);

  const setNotifications = useCallback((partial: Partial<NotificationPrefs>) => {
    setNotificationsState((prev) => {
      const next = { ...prev, ...partial };
      setLocalStorageItem("pref:notifications", next);
      return next;
    });
  }, []);

  const updateFinancialSettings = useCallback(
    async (prefs: { monthlyBudget?: number; currency?: Currency; dateFormat?: DateFormat }) => {
      if (!userId) return;

      const updates: any = { user_id: userId };
      if (prefs.monthlyBudget !== undefined) {
        setMonthlyBudgetState(prefs.monthlyBudget);
        updates.monthly_budget = prefs.monthlyBudget;
      }
      if (prefs.currency !== undefined) {
        const meta = CURRENCIES.find((c) => c.code === prefs.currency) ?? CURRENCIES[0];
        setCurrencyState(meta);
        setLocalStorageItem("pref:currency", prefs.currency);
        updates.currency = prefs.currency;
      }
      if (prefs.dateFormat !== undefined) {
        setDateFormatState(prefs.dateFormat);
        setLocalStorageItem("pref:dateFormat", prefs.dateFormat);
        updates.date_format = prefs.dateFormat;
      }

      const { error } = await supabase.from("user_preferences").upsert(updates, { onConflict: "user_id" });
      if (error) throw error;
    },
    [userId]
  );

  return (
    <UserPreferencesContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        currency,
        setCurrency,
        dateFormat,
        setDateFormat,
        monthlyBudget,
        updateFinancialSettings,
        budgetLoading,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error("useUserPreferences must be used within UserPreferencesProvider");
  return ctx;
}
