export type DomainKey = "Expenses" | "Assets" | "Subscriptions";

export type LedgerRow = {
  id: string;
  date: string;
  emoji: string | null;
  categoryName: string;
  description: string;
  amount: number;
  domain: DomainKey;
};
