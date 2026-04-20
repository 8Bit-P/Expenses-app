export type TransactionKind = "expense" | "subscription" | "investment";

export interface TransactionKindOption {
  kind: TransactionKind;
  icon: string;
  label: string;
  description: string;
  available: boolean;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

export const TRANSACTION_KINDS: TransactionKindOption[] = [
  {
    kind: "expense",
    icon: "receipt_long",
    label: "Expense",
    description: "Record a purchase or payment",
    available: true,
    gradient: "from-red-500/10 to-rose-500/5",
    iconBg: "bg-red-500/15",
    iconColor: "text-red-400",
  },
  {
    kind: "subscription",
    icon: "autorenew",
    label: "Subscription",
    description: "Track recurring charges",
    available: true,
    gradient: "from-violet-500/10 to-purple-500/5",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
  {
    kind: "investment",
    icon: "trending_up",
    label: "Investment",
    description: "Log an asset or portfolio entry",
    available: true,
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
];
