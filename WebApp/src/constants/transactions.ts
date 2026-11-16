export type TransactionKind = "expense" | "subscription" | "investment";

export interface TransactionKindOption {
  kind: TransactionKind;
  icon: string;
  label: string;
  description: string;
  available: boolean;
  iconBg: string;
  iconColor: string;
}

export const TRANSACTION_KINDS: TransactionKindOption[] = [
  {
    kind: "expense",
    icon: "swap_vert",
    label: "Income / Expense",
    description: "Record a purchase, payment, or income",
    available: true,
    iconBg: "bg-error/10",
    iconColor: "text-error",
  },
  {
    kind: "subscription",
    icon: "autorenew",
    label: "Subscription",
    description: "Track recurring charges",
    available: true,
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
  },
  {
    kind: "investment",
    icon: "trending_up",
    label: "Investment",
    description: "Log an asset or portfolio entry",
    available: true,
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
];
