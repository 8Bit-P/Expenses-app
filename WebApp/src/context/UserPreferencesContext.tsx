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

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";
export type Currency = "USD" | "EUR" | "GBP" | "JPY";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export interface CurrencyMeta {
  code: Currency;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
];

export interface NotificationPrefs {
  budgetThresholdAlerts: boolean;
  budgetThresholdPct: number; // e.g. 80
  largeTransactionRadar: boolean;
  largeTransactionAmount: number; // e.g. 200
  weeklyDigest: boolean;
  trackingReminder: boolean;
  subscriptionRenewals: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  budgetThresholdAlerts: true,
  budgetThresholdPct: 80,
  largeTransactionRadar: false,
  largeTransactionAmount: 200,
  weeklyDigest: false,
  trackingReminder: false,
  subscriptionRenewals: false,
};

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

  // Monthly budget (Supabase-backed)
  monthlyBudget: number;
  setMonthlyBudget: (amount: number) => Promise<void>;
  budgetLoading: boolean;

  // Notifications (localStorage)
  notifications: NotificationPrefs;
  setNotifications: (prefs: Partial<NotificationPrefs>) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}

function ls<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Theme
  const [theme, setThemeState] = useState<Theme>(() => ls("pref:theme", "system" as Theme));
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    applyTheme(ls("pref:theme", "system" as Theme))
  );

  // Currency
  const [currency, setCurrencyState] = useState<CurrencyMeta>(() => {
    const code = ls<Currency>("pref:currency", "USD");
    return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
  });

  // Date format
  const [dateFormat, setDateFormatState] = useState<DateFormat>(() =>
    ls("pref:dateFormat", "MM/DD/YYYY" as DateFormat)
  );

  // Notifications
  const [notifications, setNotificationsState] = useState<NotificationPrefs>(() =>
    ls("pref:notifications", DEFAULT_NOTIFICATIONS)
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
            lsSet("pref:currency", data.currency); // keep in sync
          }
          // Date format from DB takes precedence
          if (data.date_format) {
            setDateFormatState(data.date_format as DateFormat);
            lsSet("pref:dateFormat", data.date_format); // keep in sync
          }
        }
        setBudgetLoading(false);
      });
  }, [userId]);

  // ── Setters ───────────────────────────────────────────────────────────────
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    lsSet("pref:theme", t);
  }, []);

  const setCurrency = useCallback((code: Currency) => {
    const meta = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
    setCurrencyState(meta);
    lsSet("pref:currency", code); // optimistic local update
    if (userId) {
      supabase
        .from("user_preferences")
        .upsert({ user_id: userId, currency: code }, { onConflict: "user_id" });
    }
  }, [userId]);

  const setDateFormat = useCallback((f: DateFormat) => {
    setDateFormatState(f);
    lsSet("pref:dateFormat", f); // optimistic local update
    if (userId) {
      supabase
        .from("user_preferences")
        .upsert({ user_id: userId, date_format: f }, { onConflict: "user_id" });
    }
  }, [userId]);

  const setNotifications = useCallback((partial: Partial<NotificationPrefs>) => {
    setNotificationsState((prev) => {
      const next = { ...prev, ...partial };
      lsSet("pref:notifications", next);
      return next;
    });
  }, []);

  const setMonthlyBudget = useCallback(
    async (amount: number) => {
      if (!userId) return;
      setMonthlyBudgetState(amount);
      await supabase.from("user_preferences").upsert(
        { user_id: userId, monthly_budget: amount },
        { onConflict: "user_id" }
      );
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
        setMonthlyBudget,
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
