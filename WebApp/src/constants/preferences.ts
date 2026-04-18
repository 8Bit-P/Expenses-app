import type { CurrencyMeta, NotificationPrefs, DateFormat } from "../types/preferences";

export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
];

export const DATE_FORMATS: { value: DateFormat; label: string }[] = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (EU)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
];

export const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  budgetThresholdAlerts: true,
  budgetThresholdPct: 80,
  largeTransactionRadar: false,
  largeTransactionAmount: 200,
  weeklyDigest: false,
  trackingReminder: false,
  subscriptionRenewals: false,
};
