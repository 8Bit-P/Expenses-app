export type Theme = "light" | "dark" | "system";
export type Currency = "USD" | "EUR" | "GBP" | "JPY";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export interface CurrencyMeta {
  code: Currency;
  symbol: string;
  label: string;
}

export interface NotificationPrefs {
  budgetThresholdAlerts: boolean;
  budgetThresholdPct: number; // e.g. 80
  largeTransactionRadar: boolean;
  largeTransactionAmount: number; // e.g. 200
  weeklyDigest: boolean;
  trackingReminder: boolean;
  subscriptionRenewals: boolean;
}
