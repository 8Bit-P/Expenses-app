export type TransactionType = "expense" | "income" | "transfer";

export type BillingCycle = "monthly" | "yearly" | "weekly" | "quarterly";
export type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  status: SubscriptionStatus;
  created_at: string;
  // Joined fields
  category?: Category;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  subscription_id?: string;
  reserve_id?: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string | null;
  needs_review: boolean;
  created_at: string;
  // Joined fields
  category?: Category;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType;
  search?: string;
  needsReview?: boolean | null;
  page?: number;
  pageSize?: number;
}
